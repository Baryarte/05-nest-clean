import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

// export class ZodValidationPipe implements PipeTransform {
//   constructor(private schema: ZodSchema) {}

//   transform(value: unknown) {
//     try {
//       this.schema.parse(value)
//     } catch (error) {
//       if (error instanceof ZodError) {
//         throw new BadRequestException({
//           message: 'Validation failed',
//           errors: fromZodError(error),
//           statusCode: 400,
//         })
//       }
//       throw new BadRequestException('Validation failed')
//     }

//     return value
//   }
// }

/**
 * ZodValidationPipe é uma classe que implementa a interface PipeTransform do NestJS.
 * Ela usa o ZodSchema para validar os dados recebidos.
 *
 * @param schema - O esquema Zod usado para validar os dados.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  /**
   * Transforma os dados recebidos validando-os com o esquema Zod.
   *
   * @param value - Os dados a serem validados.
   * @returns Os dados validados.
   * @throws BadRequestException - Se a validação falhar.
   */
  transform(value: unknown) {
    try {
      // Tenta analisar os dados com o esquema Zod
      return this.schema.parse(value)
    } catch (error) {
      // Se a validação falhar, lança uma exceção com os detalhes do erro
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation Failed',
          errors: fromZodError(error),
          statusCode: 400,
        })
      }
      // Se ocorrer um erro desconhecido, lança uma exceção genérica
      throw new BadRequestException('Validation Failed')
    }

    // Retorna os dados validados
    return value
  }
}
