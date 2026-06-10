import { OrderLine } from "./order-line.entity";

export class Order {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly totalAmount: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly orderLines?: OrderLine[]
  ) {}
}
