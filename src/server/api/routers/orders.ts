import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const ordersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: { imageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        shippingMethod: order.shippingMethod,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          color: item.color,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        shippingInfo: {
          firstName: order.shippingFirstName,
          lastName: order.shippingLastName,
          email: order.shippingEmail,
          phone: order.shippingPhone,
          address: order.shippingAddress,
          apartment: order.shippingApartment,
          city: order.shippingCity,
          state: order.shippingState,
          zipCode: order.shippingZipCode,
          country: order.shippingCountry,
        },
      })),
    };
  }),
});
