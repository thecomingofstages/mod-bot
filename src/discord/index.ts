import { Hono } from "hono";
import { createDiscordRequest } from "./request";
import { Interactions, slashCommands } from "./commands";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
} from "discord-interactions";
import { DiscordEnvVars } from "./types";
import { verifySignature } from "./ีutils";

const app = new Hono<{
  Bindings: DiscordEnvVars;
  Variables: {
    discordRequest: ReturnType<typeof createDiscordRequest>;
  };
}>();

app.use(async (c, next) => {
  c.set(
    "discordRequest",
    createDiscordRequest({ discordToken: c.env.DISCORD_TOKEN })
  );
  await next();
});

app.get("/register/commands", async (c) => {
  try {
    const request = c.get("discordRequest");
    const appId = c.env.DISCORD_APP_ID;
    return await request.put(`applications/${appId}/commands`, {
      json: slashCommands,
    });
  } catch (err) {
    console.error(err);
    return c.text("Error registering commands");
  }
});

app.use("/interactions", verifySignature);

app.post("/interactions", async (c) => {
  const { type, data, member, guild } = await c.req.json<Interactions>();
  if (type === InteractionType.PING) {
    return c.json({ type: InteractionResponseType.PONG });
  }
  if (type === InteractionType.APPLICATION_COMMAND) {
    switch (data.name) {
      case "verify": {
        // handle verify command
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Verify command /guilds/${guild.id}/members/${member.user.id} with email ${data.options[0].value}`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case "online": {
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "I'm online!",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
    }
  }
});
export default app;
