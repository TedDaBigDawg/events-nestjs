import { IsString } from 'class-validator';

export class CardPaymentSuccessDto {
  @IsString()
  reference: string;
}
