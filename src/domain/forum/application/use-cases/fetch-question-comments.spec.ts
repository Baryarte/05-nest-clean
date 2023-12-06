import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository copy'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityId('question_id')
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId,
        createdAt: new Date(2022, 0, 20),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId,
        createdAt: new Date(2022, 0, 18),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId,
        createdAt: new Date(2022, 0, 23),
      }),
    )

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated question comments', async () => {
    const question = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
          createdAt: new Date(2022, 0, i),
        }),
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 1) }),
    ])
  })
})
