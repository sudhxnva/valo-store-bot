const { RiotApiClient, Region } = require("valorant.js");

function getClient(username, password) {
  return new RiotApiClient({
    username: "Reya01",
    password: "Bubbalubba20",
    region: Region.AP,
    debug: true,
  });
}

async function getSkins(valorant) {
  await valorant.login();
  const store = await valorant.storeApi.getStorefront(
    valorant.user.Subject,
    true
  );
  return store.skins;
}

module.exports = {
  getClient,
  getSkins,
};
