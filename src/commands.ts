import type { PlainMessage, SlashCommand } from "@towns-protocol/proto";

const commands = [
  {
    name: "help",
    description: "Get help with bot commands",
  },
  {
    name: "time",
    description: "Get the current time",
  },
  {
    name: "poke",
    description: "Poke someone",
  },
] as const satisfies PlainMessage<SlashCommand>[];

export default commands;
