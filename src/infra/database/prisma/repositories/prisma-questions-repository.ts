import { UniqueEntityId } from './../../../../core/entities/unique-entity-id'
import { Slug } from './../../../../domain/forum/enterprise/entities/value-objects/slug'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) return null

    const questionEntity = PrismaQuestionMapper.toDomain(question)

    return questionEntity
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    if (!question) return null

    const questionEntity = PrismaQuestionMapper.toDomain(question)

    return questionEntity
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    const questionsEntities = questions.map(PrismaQuestionMapper.toDomain)
    return questionsEntities
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: { id: data.id },
    })
  }
}
