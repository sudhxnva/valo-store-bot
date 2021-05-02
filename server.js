const Discord = require("discord.js");
const { getClient, getSkins } = require("./util/valo");
const createEmbed = require("./util/createEmbed");

const client = new Discord.Client();

client.on("ready", async () => {
  console.log("Bot Ready");
});

client.on("message", async (message) => {
  if (message.content === "!store") {
    message.channel.send("Hol up");
    const valorant = getClient();
    const skins = await getSkins(valorant);
    const embed = createEmbed(valorant.user.GameName, skins);
    message.channel.send({ embed });
  }
});

client.login("ODM3OTc0Nzc4MzUzOTQyNTM5.YI0W0w.LfHaMOQpQnlcu5zvi4qLsPrqGOM");
