const {
  Client,
  Intents,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const { getClient, getSkins } = require("./util/valo");
require("discord-reply");
const { generateRegisterEmbed, imageEmbed } = require("./util/createEmbed");

const storeCommand =
  process.env.NODE_ENV === "development" ? "!test" : "!store";

const { decrypt, encrypt } = require("./util/crypto");
require("./db");
const { User } = require("./models/user");

const intents = new Intents(Intents.ALL);

const client = new Client({ ws: { intents } });

client.on("ready", async () => {
  client.user.setActivity("!store", {
    type: "LISTENING",
  });
  console.log("Bot Ready");
});

client.on("message", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  if (message.content == "!ping") {
    const resultMessage = await message.reply("Calculating ping...");
    const ping = resultMessage.createdTimestamp - message.createdTimestamp;
    resultMessage.edit(
      `Bot latency: **${ping}ms**\nAPI Latency: **${client.ws.ping}ms**`
    );
  }

  if (message.content === storeCommand) {
    try {
      if (message.channel.type === "dm")
        return message.reply("Use this command on the server!");
      const user = await User.findOne({ discordID: message.author.id });
      if (!user) {
        message.lineReply(
          "I don't have your Valorant credentials, please reply to my DM with them!"
        );
        return message.author.send({ embed: generateRegisterEmbed() });
      }

      const waitMessage = await message.lineReplyNoMention("Fetching...");
      try {
        const valorant = getClient(
          user.riotUsername,
          decrypt(user.riotPassword)
        );
        const { skins, playerCard } = await getSkins(valorant);
        const embed = await imageEmbed(
          {
            name: valorant.user.GameName,
            tag: valorant.user.TagLine,
            region: valorant.region.Name,
          },
          skins,
          playerCard,
          message
        );
        message.lineReplyNoMention(embed);
        waitMessage.delete();
      } catch (err) {
        waitMessage.delete();
        console.error(err);
        message.lineReplyNoMention(
          "Sorry! I have trouble connecting to the store."
        );
      }
    } catch (error) {
      message.lineReplyNoMention("Sorry! I ran into an error.");
      console.error(error);
    }
  }

  if (message.content.startsWith("!register")) {
    if (message.channel.type !== "dm") {
      message.delete({ reason: "Send personal details only on DM" });
      return message.reply(
        "Hey! Don't share your credentials on the server. Send it on DM only!"
      );
    }
    const args = message.content.slice("!register".length).trim().split(" ");
    if (args.length != 2) return message.reply("Invalid format!");

    const waitMessage = await message.reply("Authenticating...");

    const details = {
      discordName: message.author.username,
      riotUsername: args[0],
      riotPassword: encrypt(args[1]),
    };
    const valorant = getClient(args[0], args[1]);

    valorant
      .login()
      .then(async (res) => {
        await User.findOneAndUpdate({ discordID: message.author.id }, details, {
          upsert: true,
          new: true,
        });
        waitMessage.delete();
        message.reply(
          `Success! Welcome aboard, **${res.user.GameName}**!\nUse the command` +
            "`!store` on the server to view the guns on sale in your store!"
        );
      })
      .catch((err) => {
        console.error(err);
        waitMessage.delete();
        message.reply("Sorry, Invalid credentials! Please try again");
      });
  }
});

client.login(process.env.BOT_TOKEN);
