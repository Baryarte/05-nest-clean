import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
        url: 'http://fake-url.com/profile.png',
      }),
    )
  })

  it('should not be able to upload and create a new attachment with an invalid type', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })

  // it('should not be able to register a new student with an email that is already in use', async () => {
  //   const student = Student.create({
  //     name: 'any_name',
  //     email: 'any_email',
  //     password: 'any_password',
  //   })

  //   await inMemoryStudentsRepository.create(student)

  //   const result = await sut.execute({
  //     name: 'any_name',
  //     email: 'any_email',
  //     password: 'any_password',
  //   })

  //   expect(result.isLeft()).toBeTruthy()
  //   expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  // })
})
