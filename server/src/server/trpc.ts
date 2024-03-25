/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v11/router
 * @link https://trpc.io/docs/v11/procedures
 */

import { TRPCError, initTRPC } from "@trpc/server";
import { transformer } from "@/utils/transformer";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
    /**
     * @link https://trpc.io/docs/v11/data-transformers
     */
    transformer,
    /**
     * @link https://trpc.io/docs/v11/error-formatting
     */
    errorFormatter({ shape }) {
        return shape;
    },
});

/**
 * Create a router
 * @link https://trpc.io/docs/v11/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * Merge multiple routers together
 * @link https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Create a server-side caller
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Protected base procedure
 */
export const authedProcedure = t.procedure.use(function isAuthed(opts) {
    const user = opts.ctx.session?.user;

    if (!user) {
        opts.ctx.logger.error("Unauthorized access");

        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
        ctx: {
            user,
        },
    });
});
