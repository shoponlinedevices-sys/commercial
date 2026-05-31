"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartLine = void 0;
class CartLine {
    constructor(id, cartId, productId, quantity, unitPrice, totalPrice, status, createdAt, updatedAt, name, image) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name;
        this.image = image;
    }
}
exports.CartLine = CartLine;
//# sourceMappingURL=cart-line.entity.js.map