import { verifyKey } from "discord-interactions";
import type { MiddlewareHandler } from "hono";
import { DiscordEnvVars } from "./types";

export const verifySignature: MiddlewareHandler<{
  Bindings: DiscordEnvVars;
}> = async (c, next) => {
  try {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");

    if (typeof signature !== "string" || typeof timestamp !== "string") {
      throw new Error("Bad request signature");
    }
    const isValidRequest = verifyKey(
      await c.req.arrayBuffer(),
      signature,
      timestamp,
      c.env.DISCORD_PUBLIC_KEY
    );
    if (!isValidRequest) {
      throw new Error("Bad request signature");
    }
  } catch (err) {
    console.error(err);
    return c.text("Unauthorized", {
      status: 401,
    });
  }
  await next();
};
