import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { initLogger } from "@/server/logger";

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
    onError({ error }) {
        const logger = initLogger();
        if (error.code === "INTERNAL_SERVER_ERROR") {
            // send to bug reporting
            logger.error("Something went wrong", error);
        }
    },
    // responseMeta() {
    //   // ...
    // },
});
