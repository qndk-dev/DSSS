import { Client, Events } from "discord.js";
import { Event } from "../interfaces/Command.js";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    const guilds = client.guilds.cache.size;
    const users = client.users.cache.size;
    const commands = client.application?.commands.cache.size || 0;

    console.log("╔════════════════════════════════════════╗");
    console.log("║                DSSS Bot                ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(`Hello world!`);
    console.log(`Bot: ${client.user?.tag}`);
    console.log(`ID: ${client.user?.id}`);
    console.log(`Guilds: ${guilds}`);
    console.log(`Servers: ${users}`);
    console.log("══════════════════════════════════════════");
    client.user?.setPresence({
      activities: [{ name: `/help | ${guilds} servers`, type: 2 }],
      status: "online",
    });
  },
};

export default event;
