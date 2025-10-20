import { db } from "@/server/db";

const ORDER_TIMEOUT_MINUTES = 15;

export async function lazyCleanupExpiredOrders() {
  const now = new Date();

  try {
    const expiredOrders = await db.order.findMany({
      where: {
        paymentStatus: "pending",
        reservationExpiresAt: {
          lt: now,
          not: null,
        },
        status: "pending",
      },
      include: {
        items: true,
      },
      take: 10,
    });

    if (expiredOrders.length === 0) {
      return { cleaned: 0 };
    }

    for (const order of expiredOrders) {
      await db.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "cancelled",
            paymentStatus: "expired",
            reservationExpiresAt: null,
          },
        });
      });
    }

    return {
      cleaned: expiredOrders.length,
    };
  } catch (error) {
    console.error("Error in lazy cleanup:", error);
    return { cleaned: 0, error };
  }
}

export function calculateReservationExpiry(): Date {
  return new Date(Date.now() + ORDER_TIMEOUT_MINUTES * 60 * 1000);
}

export async function isStockAvailable(
  productId: string,
  requestedQuantity: number
): Promise<{ available: boolean; actualStock: number }> {
  await lazyCleanupExpiredOrders();

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  const actualStock = product?.stock ?? 0;
  return {
    available: actualStock >= requestedQuantity,
    actualStock,
  };
}
