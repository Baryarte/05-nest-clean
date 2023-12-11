import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!questionComment) {
      return null
    }
    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      skip: (page - 1) * 20,
      take: 20,
    })

    return questionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async save(questionComment: QuestionComment): Promise<void> {
    const prismaQuestionComment =
      PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.update({
      where: { id: questionComment.id.toString() },
      data: prismaQuestionComment,
    })
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const prismaQuestionComment =
      PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.create({ data: prismaQuestionComment })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const prismaQuestionComment =
      PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.delete({
      where: { id: prismaQuestionComment.id },
    })
  }
}
