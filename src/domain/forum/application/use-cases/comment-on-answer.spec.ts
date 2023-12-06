import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on a answer', async () => {
    const newAnswer = makeAnswer()
    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: 'any_content',
    })
    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryAnswerCommentsRepository.items[0].id).toEqual(
        result.value?.answerComment.id,
      )
      expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
        result.value?.answerComment.content,
      )
    }
  })
})
