import { Hono } from "hono";
import discordApp from "./discord";

const app = new Hono();

app.get("/", (c) => {
  return c.text("OK");
});

app.route("/discord", discordApp);

export default app;
