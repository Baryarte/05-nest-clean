import { makeAnswer } from 'test/factories/make-answer'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer_id'),
      authorId: student.id,
      createdAt: new Date(2022, 0, 20),
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer_id'),
      authorId: student.id,
      createdAt: new Date(2022, 0, 18),
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer_id'),
      authorId: student.id,
      createdAt: new Date(2022, 0, 23),
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer_id',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          createdAt: new Date(2022, 0, 23),
        }),
        expect.objectContaining({
          author: 'John Doe',
          createdAt: new Date(2022, 0, 20),
        }),
        expect.objectContaining({
          author: 'John Doe',
          createdAt: new Date(2022, 0, 18),
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const answer = makeAnswer()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
          createdAt: new Date(2022, 0, i),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            author: 'John Doe',
            createdAt: new Date(2022, 0, 21),
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            author: 'John Doe',
            createdAt: new Date(2022, 0, 21),
          }),
        }),
      ]),
    )
  })
})
