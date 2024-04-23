import { InteractionType } from "discord-interactions";

export type DiscordCommand<
  A extends Array<DiscordCommandOption> = Array<DiscordCommandOption>
> = {
  name: string;
  description: string;
  type: 1;
  options?: A;
};

export type DiscordCommandOption = {
  type: number;
  name: string;
  description: string;
  required?: boolean;
};

export type DiscordEnvVars = {
  DISCORD_TOKEN: string;
  DISCORD_APP_ID: string;
  DISCORD_PUBLIC_KEY: string;
};

// These are super TypeScript types to allow you to type-check your Discord interactions
// from defined commands. Worth for intellisense!

type DiscordInteractInput<O> = O extends DiscordCommandOption
  ? Pick<O, "name" | "type"> & {
      value: string;
    }
  : never;

type DiscordInteractInputArray<
  A extends Array<DiscordCommandOption> = Array<DiscordCommandOption>,
  I extends keyof A = keyof A,
  O extends A[I] = A[I]
> = {
  options: Array<DiscordInteractInput<O>>;
};

export type DiscordInteraction<
  A extends Array<DiscordCommand> = Array<DiscordCommand>,
  I extends keyof A = keyof A,
  C extends A[I] = A[I]
> = {
  type: InteractionType;
  token: string;
  id: string;
  guild: {
    id: string;
  };
  data: C extends DiscordCommand
    ? {
        name: C["name"];
      } & (C["options"] extends Array<DiscordCommandOption>
        ? DiscordInteractInputArray<C["options"]>
        : {})
    : never;
  member: {
    nick: string | null;
    roles: unknown[];
    user: {
      id: string;
      username: string;
      global_name: string;
    };
  };
};
