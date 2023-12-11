﻿import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // check if filetype is pdf png jpg or jpeg with regex
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}