export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly image: string,
    public readonly oldPrice?: number,
    public readonly badge?: string,
    public readonly sku?: string,
    public readonly unit?: string,
    public readonly moq?: string,
    public readonly category?: number
  ) {}
}
