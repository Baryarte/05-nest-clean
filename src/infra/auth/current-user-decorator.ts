import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

/**
 * CurrentUser é um decorador personalizado para extrair o usuário atual da solicitação.
 * Ele usa a função createParamDecorator do NestJS para criar o decorador.
 *
 * @param _ - Este é um espaço reservado para o argumento de dados, que não é usado neste decorador.
 * @param context - A instância ExecutionContext, que encapsula detalhes da execução do método.
 * @returns O usuário extraído da solicitação.
 */
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    // Muda para o contexto HTTP e obtém o objeto de solicitação
    const request = context.switchToHttp().getRequest()
    // Extrai o usuário do objeto de solicitação
    const user = request.user as UserPayload
    // Retorna o usuário
    return user
  },
)
