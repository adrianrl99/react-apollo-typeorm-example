import { PaginationInputInterface } from 'shared'
import { Field, InputType } from 'type-graphql'

@InputType()
export class PaginationInput implements PaginationInputInterface {
  @Field(() => Number, { nullable: true })
  offset: number | undefined

  @Field(() => Number, { nullable: true })
  limit: number | undefined
}
