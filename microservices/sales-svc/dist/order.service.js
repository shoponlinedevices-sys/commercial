"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_line_entity_1 = require("./order-line.entity");
const cart_entity_1 = require("./cart.entity");
const cart_line_entity_1 = require("./cart-line.entity");
const product_entity_1 = require("./product.entity");
let OrderService = class OrderService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get productRepository() {
        return this.dataSource.getRepository(product_entity_1.ProductEntity);
    }
    get orderRepository() {
        return this.dataSource.getRepository(order_entity_1.OrderEntity);
    }
    get orderLineRepository() {
        return this.dataSource.getRepository(order_line_entity_1.OrderLineEntity);
    }
    get cartRepository() {
        return this.dataSource.getRepository(cart_entity_1.CartEntity);
    }
    get cartLineRepository() {
        return this.dataSource.getRepository(cart_line_entity_1.CartLineEntity);
    }
    async getUserOrders(userId) {
        return this.orderRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAllOrders() {
        return this.orderRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['orderLines'],
        });
    }
    async getOrderById(orderId) {
        return this.orderRepository.findOne({
            where: { id: orderId },
        });
    }
    async createOrder(data) {
        return this.dataSource.transaction(async (manager) => {
            const order = manager.create(order_entity_1.OrderEntity, {
                userId: data.userId,
                totalAmount: data.totalAmount,
                shippingAddress: data.shippingAddress,
                fcmToken: data.fcmToken,
                status: 'pending',
            });
            const savedOrder = await manager.save(order_entity_1.OrderEntity, order);
            const orderLineEntities = data.orderLines.map((line) => {
                const unitPrice = parseFloat(line.unitPrice);
                const totalPrice = unitPrice * line.quantity;
                return manager.create(order_line_entity_1.OrderLineEntity, {
                    orderId: savedOrder.id,
                    productId: line.productId.toString(),
                    unitPrice: line.unitPrice,
                    quantity: line.quantity,
                    totalPrice: totalPrice.toString(),
                });
            });
            if (orderLineEntities.length > 0) {
                await manager.save(order_line_entity_1.OrderLineEntity, orderLineEntities);
            }
            return manager.findOne(order_entity_1.OrderEntity, {
                where: { id: savedOrder.id },
                relations: ['orderLines'],
            });
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        return this.orderRepository.save(order);
    }
    async findAllCarts() {
        const carts = await this.cartRepository.find({
            relations: ['cartLines'],
        });
        return { carts };
    }
    async getCart(id) {
        const cart = await this.cartRepository.findOne({
            where: { id },
        });
        if (!cart) {
            throw new Error('Cart not found');
        }
        return { cart };
    }
    async getCartByUserId(userId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['cartLines'],
        });
        if (!cart) {
            return { cart: null };
        }
        return { cart };
    }
    async addToCart(data) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: data.productId },
            });
            console.log('addToCart', product);
            if (!product) {
                throw new Error('Product not found');
            }
            let cart = await this.cartRepository.findOne({
                where: { userId: data.userId },
            });
            if (!cart) {
                cart = this.cartRepository.create({
                    userId: data.userId,
                    totalPrice: '0',
                    status: 1,
                });
                cart = await this.cartRepository.save(cart);
            }
            let cartLine = await this.cartLineRepository.findOne({
                where: { cartId: cart.id, productId: data.productId },
            });
            if (cartLine) {
                const newQuantity = cartLine.quantity + (data.quantity || 0);
                cartLine.quantity = isNaN(newQuantity) ? cartLine.quantity : newQuantity;
                if (data.image) {
                    cartLine.image = data.image;
                }
            }
            else {
                const validQuantity = data.quantity || 1;
                cartLine = this.cartLineRepository.create({
                    cartId: cart.id,
                    productId: data.productId,
                    quantity: isNaN(validQuantity) ? 1 : validQuantity,
                    unitPrice: product.price,
                    status: 1,
                    name: data.cartLines?.[0]?.name || 'Sản phẩm',
                    image: data.image || data.cartLines?.[0]?.image || 'https://via.placeholder.com/150',
                });
            }
            await this.cartLineRepository.save(cartLine);
            const cartLines = await this.cartLineRepository.find({
                where: { cartId: cart.id },
            });
            const totalPrice = cartLines.reduce((sum, line) => sum + (Number(line.unitPrice) * line.quantity), 0);
            cart.totalPrice = totalPrice.toString();
            await this.cartRepository.save(cart);
            const updatedCart = await this.cartRepository.findOne({
                where: { id: cart.id },
            });
            return { cart: updatedCart };
        }
        catch (error) {
            console.error('Error in addToCart:', error);
            throw error;
        }
    }
    async getCartLinesByUserId(userId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
        });
        if (!cart) {
            return { cartLines: [] };
        }
        const cartLines = await this.cartLineRepository.find({
            where: { cartId: cart.id },
        });
        return { cartLines };
    }
    async removeCartLine(cartLineId) {
        try {
            const cartLine = await this.cartLineRepository.findOne({
                where: { id: cartLineId },
            });
            if (!cartLine) {
                throw new Error('Cart line not found');
            }
            await this.cartLineRepository.remove(cartLine);
            const cart = await this.cartRepository.findOne({
                where: { id: cartLine.cartId },
            });
            if (cart) {
                const cartLines = await this.cartLineRepository.find({
                    where: { cartId: cart.id },
                });
                const totalPrice = cartLines.reduce((sum, line) => sum + (Number(line.unitPrice) * line.quantity), 0);
                cart.totalPrice = totalPrice.toString();
                await this.cartRepository.save(cart);
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error in removeCartLine:', error);
            throw error;
        }
    }
    async clearCartByUserId(userId) {
        try {
            const cart = await this.cartRepository.findOne({
                where: { userId },
            });
            if (!cart) {
                return { success: true };
            }
            await this.cartLineRepository.delete({ cartId: cart.id });
            cart.totalPrice = '0';
            await this.cartRepository.save(cart);
            return { success: true };
        }
        catch (error) {
            console.error('Error in clearCartByUserId:', error);
            throw error;
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderService);
//# sourceMappingURL=order.service.js.map