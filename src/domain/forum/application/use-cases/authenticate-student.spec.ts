import { FakeEncrypter } from './../../../../../test/cryptography/fake-encrypter'
import { FakeHasher } from './../../../../../test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const hashedPassword = await fakeHasher.hash('any_password')

    const student = makeStudent({
      email: 'any_email',
      password: hashedPassword,
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    })

    console.log(result)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })
})
