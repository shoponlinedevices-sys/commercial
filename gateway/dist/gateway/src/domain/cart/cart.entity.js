"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
class Cart {
    constructor(id, userId, totalPrice, status, createdAt, updatedAt, cartLines) {
        this.id = id;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cartLines = cartLines;
    }
}
exports.Cart = Cart;
//# sourceMappingURL=cart.entity.js.map