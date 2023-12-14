import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch recent answers', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id, createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id, createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id, createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })

    expect(result.value?.answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated question answers', async () => {
    const question = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
          createdAt: new Date(2022, 0, i),
        }),
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
    expect(result.value?.answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 1) }),
    ])
  })
})
