import { CartLine } from "./cart-line.entity";

export class Cart {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly totalPrice: string,
    public readonly status: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly cartLines?: CartLine[]
  ) {}
}
