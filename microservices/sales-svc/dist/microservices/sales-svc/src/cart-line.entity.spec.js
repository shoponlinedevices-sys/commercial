"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cart_line_entity_1 = require("./cart-line.entity");
describe('CartLineEntity', () => {
    it('maps the cart ID property and relation to the same database column', () => {
        const metadata = (0, typeorm_1.getMetadataArgsStorage)();
        const cartIdColumn = metadata.columns.find((column) => column.target === cart_line_entity_1.CartLineEntity && column.propertyName === 'cartId');
        const cartRelationColumn = metadata.joinColumns.find((column) => column.target === cart_line_entity_1.CartLineEntity && column.propertyName === 'cart');
        expect(cartIdColumn?.options.name).toBe('cartId');
        expect(cartRelationColumn?.name).toBe('cartId');
    });
});
//# sourceMappingURL=cart-line.entity.spec.js.map