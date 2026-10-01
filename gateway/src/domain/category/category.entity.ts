export class Category {
  constructor(
    public readonly id: number,
    public readonly sortOrder: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly isActive: number,
    public readonly icon: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
