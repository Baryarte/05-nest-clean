import { makeAnswer } from 'test/factories/make-answer'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityId('answer_id')
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
        createdAt: new Date(2022, 0, 20),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
        createdAt: new Date(2022, 0, 18),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
        createdAt: new Date(2022, 0, 23),
      }),
    )

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answer = makeAnswer()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
          createdAt: new Date(2022, 0, i),
        }),
      )
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 1) }),
    ])
  })
})
