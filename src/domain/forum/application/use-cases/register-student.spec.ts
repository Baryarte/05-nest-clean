import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should be able to register a new student with a hashed password', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const hashedPassword = await fakeHasher.hash('any_password')

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a new student with an email that is already in use', async () => {
    const student = Student.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
