import { PrismaCommentWithAuthorMapper } from './../mappers/prisma-comment-with-author-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

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
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return questionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: { questionId },
      include: {
        author: true, // eager loading
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
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
