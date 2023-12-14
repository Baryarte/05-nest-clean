import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Injectable } from '@nestjs/common'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

@Injectable()
export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: AnswerComment[] = []

  async create(questionComment: AnswerComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async save(questionComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items[itemIndex] = questionComment
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const questionComments = this.items
      .filter(
        (questionComment) => questionComment.answerId.toString() === answerId,
      )
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author with ID ${comment.authorId} not found.`)
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }

  async findManyRecent(params: PaginationParams) {
    console.log('findManyRecent: ', params)
  }
}
