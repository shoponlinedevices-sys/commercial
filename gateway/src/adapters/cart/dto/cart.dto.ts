import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumberString,
  Min,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class CartLineDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  unitPrice!: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class AddToCartDto {
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartLineDto)
  cartLines?: CartLineDto[];
}