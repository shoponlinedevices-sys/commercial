"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
describe('ProductEntity', () => {
    it('maps the product category using the categoryId column', () => {
        const categoryColumn = (0, typeorm_1.getMetadataArgsStorage)().columns.find((column) => column.target === product_entity_1.ProductEntity && column.propertyName === 'categoryId');
        const legacyCategoryColumn = (0, typeorm_1.getMetadataArgsStorage)().columns.find((column) => column.target === product_entity_1.ProductEntity && column.propertyName === 'category');
        expect(categoryColumn).toBeDefined();
        expect(categoryColumn?.options.name).toBeUndefined();
        expect(legacyCategoryColumn).toBeUndefined();
    });
});
//# sourceMappingURL=product.entity.spec.js.map