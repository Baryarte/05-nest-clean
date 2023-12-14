import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '../presenters/questions-details-presenter'

@Controller('/questions/:slug')
// @UseGuards(JwtAuthGuard)
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  // @HttpCode(201)
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      question: QuestionDetailsPresenter.toHTTP(result.value.question),
    }
  }
}
