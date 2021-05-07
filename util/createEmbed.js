const { MessageEmbed } = require("discord.js");
const tileImages = require("./tileImages");

async function generateSkinsEmbed(user, skins, authorTag) {
  const image = await tileImages(
    skins.map(
      (skin) =>
        `https://media.valorant-api.com/weaponskinlevels/${skin.id}/displayicon.png`
    )
  );

  //A crude implementation of a divider :D
  const fields = skins.map((skin) => ({
    name: skin.name,
    value: `Cost: ${skin.cost.amount} VP`,
    inline: true,
  }));
  const divider = {
    name: "|",
    value: "|",
    inline: true,
  };
  fields.splice(1, 0, divider);
  fields.splice(4, 0, divider);

  return new MessageEmbed()
    .setTitle(`${user}'s Valorant Store`)
    .setAuthor("ValoStoreBot")
    .setDescription(
      `<@${authorTag}>, here are the firearms on offer today in your store`
    )
    .addFields(fields)
    .attachFiles([{ name: "image.png", attachment: image }])
    .setImage("attachment://image.png")
    .setColor(0x0099ff)
    .setTimestamp(new Date())
    .setFooter("Bot by VIPΞR#4643");
}

function generateRegisterEmbed() {
  return {
    color: 0x0099ff,
    title: "ValoStoreBot",
    description:
      "To register your account, please send a message on **this chat** in this format:\n ```!register <riot_username> <riot_password>```\n For Example: `!register tenz123 password420`\n **NOTE**: Enter username that you login to valo client with(**not** your in-game name)\n **NOTE 2**: Make sure there's a space bw username and password",
    footer: {
      text: "PS: Don't worry, I encrypt your password before storing it",
    },
  };
}

module.exports = {
  generateSkinsEmbed,
  generateRegisterEmbed,
};
