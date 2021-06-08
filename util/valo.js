const { RiotApiClient, Region } = require("valorant.js");

function getClient(username, password) {
  return new RiotApiClient({
    username,
    password,
    region: Region.AP,
    debug: true,
  });
}

async function getSkins(valorant) {
  try {
    const user = await valorant.login();
    const store = await valorant.storeApi.getStorefront(
      valorant.user.Subject,
      true
    );
    let PlayerCard;
    // const { PlayerCard = null } = await valorant.playerApi.getInventory(
    //   user.user.Subject
    // );
    return {
      skins: store.skins,
      playerCard: PlayerCard,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getClient,
  getSkins,
};
