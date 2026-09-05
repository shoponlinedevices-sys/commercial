import { OrderService } from './order.service';

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
    const service = new OrderService(dataSource as any, { sendOrderConfirmationEmail } as any);

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
    const service = new OrderService(dataSource as any, { sendOrderConfirmationEmail } as any);

    await expect(service.createOrder({
      userId: 'user-1',
      totalAmount: 125,
      orderLines: [],
    })).rejects.toThrow('database failure');

    expect(sendOrderConfirmationEmail).not.toHaveBeenCalled();
  });
});