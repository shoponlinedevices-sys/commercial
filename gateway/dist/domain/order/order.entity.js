"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, userId, totalPrice, status, createdAt, updatedAt, orderLines) {
        this.id = id;
        this.userId = userId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderLines = orderLines;
    }
}
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map