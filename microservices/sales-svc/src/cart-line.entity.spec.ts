import { getMetadataArgsStorage } from 'typeorm';
import { CartLineEntity } from './cart-line.entity';

describe('CartLineEntity', () => {
  it('maps the cart ID property and relation to the same database column', () => {
    const metadata = getMetadataArgsStorage();
    const cartIdColumn = metadata.columns.find(
      (column) => column.target === CartLineEntity && column.propertyName === 'cartId',
    );
    const cartRelationColumn = metadata.joinColumns.find(
      (column) => column.target === CartLineEntity && column.propertyName === 'cart',
    );

    expect(cartIdColumn?.options.name).toBe('cartId');
    expect(cartRelationColumn?.name).toBe('cartId');
  });
});
