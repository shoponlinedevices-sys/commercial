"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderLine = void 0;
class OrderLine {
    constructor(id, orderId, productId, quantity, unitPrice, totalPrice, status, createdAt, updatedAt, product) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.product = product;
    }
}
exports.OrderLine = OrderLine;
//# sourceMappingURL=order-line.entity.js.map