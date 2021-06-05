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
  const user = await valorant.login();
  const store = await valorant.storeApi.getStorefront(
    valorant.user.Subject,
    true
  );
  const { PlayerCard } = await valorant.playerApi.getInventory(
    user.user.Subject
  );
  return {
    skins: store.skins,
    playerCard: PlayerCard,
  };
}

module.exports = {
  getClient,
  getSkins,
};
