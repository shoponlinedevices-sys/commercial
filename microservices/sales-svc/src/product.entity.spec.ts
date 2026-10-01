import { getMetadataArgsStorage } from 'typeorm';
import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  it('maps the product category using the categoryId column', () => {
    const categoryColumn = getMetadataArgsStorage().columns.find(
      (column) => column.target === ProductEntity && column.propertyName === 'categoryId',
    );
    const legacyCategoryColumn = getMetadataArgsStorage().columns.find(
      (column) => column.target === ProductEntity && column.propertyName === 'category',
    );

    expect(categoryColumn).toBeDefined();
    expect(categoryColumn?.options.name).toBeUndefined();
    expect(legacyCategoryColumn).toBeUndefined();
  });
});
