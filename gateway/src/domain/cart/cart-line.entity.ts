export class CartLine {
  constructor(
    public readonly id: number,
    public readonly cartId: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly unitPrice: string,
    public readonly totalPrice: string,
    public readonly status: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly name?: string,
    public readonly image?: string
  ) {}
}
