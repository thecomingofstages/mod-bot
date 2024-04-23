import { DiscordCommand, DiscordInteraction } from "./types";

export const slashCommands = [
  {
    name: "online",
    description: "ตรวจสอบสถานะของบอต",
    type: 1,
  },
  {
    name: "verify",
    description: "ยืนยันตัวตนเพื่อเข้าใช้งานเซิร์ฟเวอร์",
    type: 1,
    options: [
      {
        type: 3,
        name: "email",
        required: true,
        description: "อีเมลที่ใช้ลงทะเบียน",
      },
    ],
  },
] as const satisfies DiscordCommand[];

export type Interactions = DiscordInteraction<typeof slashCommands>;
