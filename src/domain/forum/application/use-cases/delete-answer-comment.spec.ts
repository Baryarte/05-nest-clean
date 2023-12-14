import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityId('author-id'),
      },
      new UniqueEntityId('answer-comment-id'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: 'answer-comment-id',
      authorId: 'author-id',
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer comment from another user ', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('any_id'),
    })

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: 'any_other_id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
