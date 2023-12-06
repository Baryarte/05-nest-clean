import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
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

  async findManyRecent(params: PaginationParams) {
    console.log('findManyRecent: ', params)
  }
}
