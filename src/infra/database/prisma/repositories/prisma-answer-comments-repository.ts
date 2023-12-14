import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!answerComment) {
      return null
    }
    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: { answerId },
      skip: (page - 1) * 20,
      take: 20,
    })

    return answerComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: { answerId },
      include: {
        author: true, // eager loading
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async save(answerComment: AnswerComment): Promise<void> {
    const prismaAnswerComment =
      PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.update({
      where: { id: prismaAnswerComment.id },
      data: prismaAnswerComment,
    })
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const prismaAnswerComment =
      PrismaAnswerCommentMapper.toPrisma(answerComment)
    await this.prisma.comment.create({ data: prismaAnswerComment })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const prismaAnswerComment =
      PrismaAnswerCommentMapper.toPrisma(answerComment)
    await this.prisma.comment.delete({
      where: { id: prismaAnswerComment.id },
    })
  }
}
