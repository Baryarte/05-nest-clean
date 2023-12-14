import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface QuestionDetailsProps {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  author: string
  title: string
  content: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  set questionId(questionId: UniqueEntityId) {
    this.props.questionId = questionId
  }

  get authorId(): UniqueEntityId {
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

  get title(): string {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
  }

  get slug(): Slug {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug
  }

  get attachments(): Attachment[] {
    return this.props.attachments
  }

  set attachments(attachments: Attachment[]) {
    this.props.attachments = attachments
  }

  get bestAnswerId(): UniqueEntityId | null | undefined {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | null | undefined) {
    this.props.bestAnswerId = bestAnswerId
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
}
