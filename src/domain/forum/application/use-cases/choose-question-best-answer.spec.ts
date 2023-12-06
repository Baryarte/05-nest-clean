import { InMemoryAnswerAttachmentsRepository } from './../../../../../test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      new InMemoryAnswerAttachmentsRepository(),
    )
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose a best answer', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)
    const newAnswer = makeAnswer({
      authorId: newQuestion.authorId,
      questionId: newQuestion.id,
    })
    await inMemoryAnswersRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })
    expect(response.isRight()).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id,
    )
  })

  it('should not be able to choose another users question best answer', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)
    const newAnswer = makeAnswer({
      authorId: newQuestion.authorId,
      questionId: newQuestion.id,
    })
    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'any_other_id',
      answerId: newAnswer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
