module.exports = function (user, skins) {
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
};
