import { postRouter } from "@/server/api/routers/post";
import { cartRouter } from "@/server/api/routers/cart";
import { ordersRouter } from "@/server/api/routers/orders";
import { paypalRouter } from "@/server/api/routers/paypal";
import { csrfRouter } from "@/server/api/routers/csrf";
import { productRouter } from "@/server/api/routers/product";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  cart: cartRouter,
  orders: ordersRouter,
  paypal: paypalRouter,
  csrf: csrfRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
