import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { renderErrorPage } from "./lib/error-page";

const fetchHandler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(...args: any[]) {
    try {
      return await (fetchHandler as any)(...args);
    } catch (error) {
      console.error("SSR Handler Error:", error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
