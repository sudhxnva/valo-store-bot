function generateSkinsEmbed(user, skins) {
  return {
    color: 0x0099ff,
    title: `${user}'s Valorant Store`,
    author: {
      name: "ValoStoreBot",
    },
    description: "Here are the firearms on offer today in your store",
    fields: skins.map((skin) => ({
      name: skin.name,
      value: `Cost: ${skin.cost.amount} VP`,
    })),
    timestamp: new Date(),
    footer: {
      text: "Bot by VIPΞR#4643",
    },
  };
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
