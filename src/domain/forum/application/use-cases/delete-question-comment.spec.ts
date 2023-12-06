import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository copy'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-id'),
      },
      new UniqueEntityId('question-comment-id'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      questionCommentId: 'question-comment-id',
      authorId: 'author-id',
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user ', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('any_id'),
    })

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: 'any_other_id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
