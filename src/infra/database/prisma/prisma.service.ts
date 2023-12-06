import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect() // quando a aplicação for iniciada, o prisma irá conectar ao banco de dados
  }

  onModuleDestroy() {
    return this.$disconnect() // se a aplicação for encerrada, o prisma irá desconectar do banco de dados
  }
}
