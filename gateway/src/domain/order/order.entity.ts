import { OrderLine } from "./order-line.entity";

export class Order {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly totalPrice: string,
    public readonly status: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly orderLines?: OrderLine[]
  ) {}
}
