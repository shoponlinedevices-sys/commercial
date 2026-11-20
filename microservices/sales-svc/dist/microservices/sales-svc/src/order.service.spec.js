"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("./order.service");
const cart_line_entity_1 = require("./cart-line.entity");
describe('OrderService.createOrder email dispatch', () => {
    const order = {
        id: 'order-1',
        totalAmount: 125,
        shippingAddress: '123 Test Street',
        orderLines: [
            {
                productId: 'product-1',
                quantity: 2,
                unitPrice: '62.5',
                totalPrice: '125',
            },
        ],
    };
    it('sends to both fixed recipients and the customer after commit', async () => {
        const manager = {
            create: jest.fn((_, value) => value),
            save: jest.fn().mockResolvedValue({ id: 'order-1' }),
            findOne: jest.fn().mockResolvedValue(order),
        };
        const dataSource = {
            transaction: jest.fn(async (callback) => callback(manager)),
            getRepository: jest.fn(),
        };
        const sendOrderConfirmationEmail = jest.fn().mockResolvedValue({ success: true });
        const service = new order_service_1.OrderService(dataSource, { sendOrderConfirmationEmail });
        await service.createOrder({
            userId: 'user-1',
            totalAmount: 125,
            orderLines: [{ productId: 'product-1', unitPrice: '62.5', quantity: 2 }],
            customerEmail: 'customer@example.com',
            customerName: 'Customer',
        });
        expect(sendOrderConfirmationEmail).toHaveBeenCalledTimes(3);
        expect(sendOrderConfirmationEmail.mock.calls.map(([request]) => request.to)).toEqual(expect.arrayContaining([
            'shoponlinedevices@gmail.com',
            'hieuquan90@gmail.com',
            'customer@example.com',
        ]));
        expect(sendOrderConfirmationEmail).toHaveBeenCalledWith(expect.objectContaining({
            orderId: 'order-1',
            totalAmount: 125,
            customerName: 'Customer',
        }));
    });
    it('does not send email when the order transaction fails', async () => {
        const dataSource = {
            transaction: jest.fn().mockRejectedValue(new Error('database failure')),
            getRepository: jest.fn(),
        };
        const sendOrderConfirmationEmail = jest.fn();
        const service = new order_service_1.OrderService(dataSource, { sendOrderConfirmationEmail });
        await expect(service.createOrder({
            userId: 'user-1',
            totalAmount: 125,
            orderLines: [],
        })).rejects.toThrow('database failure');
        expect(sendOrderConfirmationEmail).not.toHaveBeenCalled();
    });
    it('rejects requests without order lines before starting a transaction', async () => {
        const transaction = jest.fn();
        const service = new order_service_1.OrderService({ transaction }, {});
        await expect(service.createOrder({
            userId: 'user-1',
            totalAmount: 125,
        })).rejects.toThrow('orderLines must be an array');
        expect(transaction).not.toHaveBeenCalled();
    });
});
describe('OrderService.clearCartByUserId', () => {
    it('deletes cart lines without cascading stale eager-loaded lines back into the cart', async () => {
        const cart = {
            id: 12,
            userId: 34,
            totalPrice: '1850000',
            cartLines: [{ id: 56, cartId: 12 }],
        };
        const repository = {
            findOne: jest.fn().mockResolvedValue(cart),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            save: jest.fn(),
        };
        const dataSource = {
            getRepository: jest.fn().mockReturnValue(repository),
        };
        const service = new order_service_1.OrderService(dataSource, {});
        await expect(service.clearCartByUserId(34)).resolves.toEqual({ success: true });
        expect(repository.delete).toHaveBeenCalledWith({ cartId: 12 });
        expect(repository.update).toHaveBeenCalledWith(12, { totalPrice: '0' });
        expect(repository.save).not.toHaveBeenCalled();
    });
});
describe('OrderService.updateCartLineQuantity', () => {
    it('sets the requested quantity and recalculates the cart total', async () => {
        const cartLine = { id: 7, cartId: 3, quantity: 1, unitPrice: '12.5' };
        const cartLineRepository = {
            findOne: jest.fn().mockResolvedValue(cartLine),
            save: jest.fn().mockResolvedValue(cartLine),
            find: jest.fn().mockResolvedValue([cartLine]),
        };
        const cartRepository = {
            update: jest.fn().mockResolvedValue({ affected: 1 }),
        };
        const dataSource = {
            getRepository: jest.fn((entity) => entity === cart_line_entity_1.CartLineEntity ? cartLineRepository : cartRepository),
        };
        const service = new order_service_1.OrderService(dataSource, {});
        await expect(service.updateCartLineQuantity(7, 3)).resolves.toEqual({ success: true });
        expect(cartLine.quantity).toBe(3);
        expect(cartLineRepository.save).toHaveBeenCalledWith(cartLine);
        expect(cartRepository.update).toHaveBeenCalledWith(3, { totalPrice: '37.5' });
    });
    it('rejects quantities below one without changing the cart line', async () => {
        const getRepository = jest.fn();
        const service = new order_service_1.OrderService({ getRepository }, {});
        await expect(service.updateCartLineQuantity(7, 0)).rejects.toThrow('quantity must be a positive integer');
        expect(getRepository).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=order.service.spec.js.map