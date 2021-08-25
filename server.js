const { Client, Intents } = require("discord.js");
const { getClient, getSkins } = require("./util/valo");
const fs = require("fs");
let CronJob = require("cron").CronJob;
require("discord-reply");
const {
  generateRegisterEmbed,
  generateSkinsEmbed,
} = require("./util/createEmbed");
const credentialsFilePath = "./users.json";
const storeCommand =
  process.env.NODE_ENV === "development" ? "!test" : "!store";

const { decrypt, encrypt } = require("./util/crypto");

const intents = new Intents(Intents.ALL);
const channelName = "valo";

const client = new Client({ ws: { intents } });
let details = {};
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}
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
    return message.channel.send("<@" + message.author.id + ">, ");
  }
  if (message.content === "!intro") {
    message.reply(
      "Hey there! I'm the Valo Store Bot \n" +
        "`!intro`   : Gives an intro\n" +
        "`!store` : View your store\n" +
        "`!register` : Works only in DM. Register your account.\n" +
        "`!wishlist` : View your wishlist\n" +
        "`!wishlist add gun_name` : Add a gun to get notified about it\n" +
        "`!wishlist remove gun_name` : Remove a gun from wishlist\n" +
        "`!wishlist remove index_number` : Remove a gun from wishlist\n"
    );
  }
  if (
    message.content.trim().split(" ").length < 3 &&
    message.content.trim().split(" ")[0] === storeCommand
  ) {
    let user;
    try {
      if (fs.existsSync(credentialsFilePath)) {
        details = require(credentialsFilePath);
      } else {
        fs.writeFileSync(credentialsFilePath, "{}");
      }
      if (message.channel.type === "dm")
        return message.reply("Use this command on the server!");
      if (message.content.trim().split(" ").length === 2) {
        user = details[message.content.split(" ").pop()];
        if (!user) {
          message.lineReply("This user does not exist");
          return message.author.send({ embed: generateRegisterEmbed() });
        }
      }
      if (!user) {
        user = details[message.author.username];
      }
      if (!user) {
        message.lineReply(
          "I don't have your Valorant credentials, use !register in my DM"
        );
        return message.author.send({ embed: generateRegisterEmbed() });
      }

      const waitMessage = await message.lineReplyNoMention("Fetching...");
      try {
        const valoClient = getClient(
          user.riotUsername,
          decrypt(user.riotPassword),
          user.shard
        );
        const { skins, Identity, lastCompetitiveMatch, unranked } =
          await getSkins(valoClient);
        const competitiveTiers = [
          "",
          "Iron",
          "Bronze",
          "Silver",
          "Gold",
          "Platinum",
          "Diamond",
          "Immortal",
          "Radiant",
        ];
        let rank;
        if (lastCompetitiveMatch) {
          rank = `${
            competitiveTiers[
              Math.floor(lastCompetitiveMatch.TierAfterUpdate / 3)
            ]
          } ${(lastCompetitiveMatch.TierAfterUpdate % 3) + 1}`;
        } else {
          rank =
            `Unranked\n> (Play ${unranked.gamesNeededForRank} more competitive game` +
            (unranked.gamesNeededForRank === 1 ? ")" : "s)");
        }
        const embed = await generateSkinsEmbed(
          {
            name: valoClient.user.GameName,
            tag: valoClient.user.TagLine,
            region: valoClient.region.Name,
          },
          skins,
          Identity,
          rank,
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
    if (args.length !== 3 && args.length !== 2)
      return message.reply(
        "Invalid format!\n Send as !register <riotID> <password> <region> (OPTIONAL)"
      );
    const regions = ["NA", "EU", "AP", "KR"];
    if (!regions.includes(args[2]))
      return message.reply("Invalid Region Entered!");
    const waitMessage = await message.reply("Authenticating...");

    const detailsObj = {
      riotUsername: args[0],
      riotPassword: encrypt(args[1]),
      shard: args[2],
      discordId: message.author.id,
      nickname: message.author.username,
      wishlist: [],
    };
    const valorant = getClient(args[0], args[1], args[2]);

    valorant
      .login()
      .then(async (res) => {
        if (fs.existsSync(credentialsFilePath)) {
          details = require(credentialsFilePath);
        } else {
          fs.writeFileSync(credentialsFilePath, "{}");
        }
        details[message.author.username] = detailsObj;
        console.log(details);
        fs.writeFileSync(credentialsFilePath, JSON.stringify(details));
        waitMessage.delete();
        message.reply(
          `Success! Welcome aboard, **${res.user.GameName}#${res.user.TagLine}**!\nUse the command` +
            "`!store` on the server to view the guns on sale in your store!"
        );
      })
      .catch((err) => {
        console.error(err);
        waitMessage.delete();
        message.reply("Sorry, Invalid credentials! Please try again");
      });
  }

  if (message.content.startsWith("!wishlist")) {
    let wishCommand = message.content.trim().split(" ")[1];
    if (fs.existsSync(credentialsFilePath)) {
      details = require(credentialsFilePath);
    } else {
      message.reply(
        "Sorry, create an account with !register before adding a wishlist"
      );
    }
    let userDetails = details[message.author.username];
    if (!userDetails) {
      message.reply(
        "Sorry, create an account with !register before adding a wishlist"
      );
    }
    let gunName;
    if (wishCommand) {
      switch (wishCommand) {
        case "add":
          if (message.content.trim().split(" ").length !== 4) {
            return message.channel.send(
              "Invalid format. Use it as !wishlist add Skin_name Gun_name"
            );
          }
          gunName =
            message.content.trim().split(" ")[2] +
            " " +
            message.content.trim().split(" ")[3];
          if (!userDetails.wishlist.includes(gunName)) {
            userDetails.wishlist.push(gunName.toLowerCase());
          }
          details[message.author.username] = userDetails;
          fs.writeFileSync(credentialsFilePath, JSON.stringify(details));
          return message.channel.send("Added successfully!");
        case "remove":
          if (
            message.content.trim().split(" ").length !== 4 &&
            message.content.trim().split(" ").length !== 3
          ) {
            return message.channel.send(
              "Invalid format. Use it as !wishlist remove Skin_name Gun_name or !wishlist remove <index_number>"
            );
          }
          let index;
          if (message.content.trim().split(" ")[3]) {
            gunName =
              message.content.trim().split(" ")[2] +
              " " +
              message.content.trim().split(" ")[3];
            gunName = gunName.toLowerCase();
            index = userDetails.wishlist.indexOf(gunName);
          } else {
            index = message.content.trim().split(" ")[2];
            if (!parseInt(index)) {
              return message.channel.send(
                "Invalid format. Use it as !wishlist remove Skin_name Gun_name or !wishlist remove <index_number>"
              );
            }
            index = parseInt(index);
            index -= 1;
          }
          if (index > -1) {
            userDetails.wishlist.splice(index, 1);
          }
          details[message.author.username] = userDetails;
          fs.writeFileSync(credentialsFilePath, JSON.stringify(details));
          return message.channel.send("Removed successfully!");
      }
    } else {
      //display wishlist
      let replyMsg = "Your Wishlist:\n";
      if (!userDetails.wishlist || userDetails.wishlist.length < 1) {
        return message.channel.send("Wishlist empty, add few guns");
      }
      userDetails.wishlist.forEach((gun, index) => {
        let sno = index + 1;
        replyMsg += `${sno}. ${titleCase(gun)}\n`;
      });
      return message.reply(replyMsg);
    }
  }
});

const checkStoreAndNotify = async () => {
  console.log("called", client.channels);
  const channel = client.channels.cache.find(
    (channel) => channel.name === channelName
  );
  if (fs.existsSync(credentialsFilePath)) {
    details = require(credentialsFilePath);
    for (const [key, value] of Object.entries(details)) {
      let user = value;
      const valoClient = getClient(
        user.riotUsername,
        decrypt(user.riotPassword),
        user.shard
      );
      const { skins } = await getSkins(valoClient);
      let replyMessage = `Hey <@${user.discordId}>, **ALERT!!!**\nYour wishlisted skin(s) now available in your store!\n`;
      let i = 1;
      skins.forEach((skin) => {
        if (user.wishlist.includes(skin.name.toLowerCase())) {
          replyMessage = replyMessage + `${i}. ${skin.name}\n`;
          i += 1;
        }
      });
      channel.send(replyMessage);
    }
  }
};

let storeCheckJob = new CronJob(
  "50 04 01 * * 1-6",
  function () {
    checkStoreAndNotify();
  },
  null,
  true,
  "Asia/Kolkata"
);
storeCheckJob.start();
client.login(process.env.BOT_TOKEN);
