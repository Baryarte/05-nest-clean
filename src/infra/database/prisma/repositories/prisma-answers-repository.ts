import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(answer: Answer): Promise<void> {
    const prismaAnswer = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data: prismaAnswer,
    })

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    )
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async save(answer: Answer): Promise<void> {
    const prismaAnswer = PrismaAnswerMapper.toPrisma(answer)
    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: answer.id.toString(),
        },
        data: prismaAnswer,
      }),
      this.answerAttachmentRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])
  }
}
