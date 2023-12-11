import { AttachmentsRepository } from '@/domain/forum/application/repositories/Attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/Attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(Attachment: Attachment) {
    this.items.push(Attachment)
  }
}
