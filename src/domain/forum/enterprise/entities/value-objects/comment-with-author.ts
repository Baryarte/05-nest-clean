import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId
  content: string
  authorId: UniqueEntityId
  author: string
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  // getters and setters
  get commentId() {
    return this.props.commentId
  }

  set commentId(commentId: UniqueEntityId) {
    this.props.commentId = commentId
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
  }

  get authorId() {
    return this.props.authorId
  }

  set authorId(authorId: UniqueEntityId) {
    this.props.authorId = authorId
  }

  get author(): string {
    return this.props.author
  }

  set author(author: string) {
    this.props.author = author
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date | null | undefined) {
    this.props.updatedAt = updatedAt
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
