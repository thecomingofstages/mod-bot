import ky from "ky";

export const createDiscordRequest = ({
  discordToken,
}: {
  discordToken: string;
}) =>
  ky.create({
    prefixUrl: "https://discord.com/api/v10/",
    headers: {
      Authorization: `Bot ${discordToken}`,
      "User-Agent":
        "DiscordBot (https://github.com/thecomingofstages/mod-bot, 1.0.0)",
    },
  });
