import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/Student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string) {
    const Student = this.items.find((item) => item.email === email)

    if (!Student) {
      return null
    }

    return Student
  }

  async create(Student: Student) {
    this.items.push(Student)
  }
}
