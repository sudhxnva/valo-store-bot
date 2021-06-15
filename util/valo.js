const { RiotApiClient, Region } = require("valorant.js");

function getClient(username, password, shard = "AP") {
  return new RiotApiClient({
    username,
    password,
    region: Region[`${shard}`],
    debug: true,
  });
}

async function getSkins(valorant) {
  try {
    const user = await valorant.login();
    const { skins } = await valorant.storeApi.getStorefront(
      valorant.user.Subject,
      true
    );
    const { Identity } = await valorant.playerApi.getInventory(
      user.user.Subject
    );
    return {
      skins,
      Identity,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getClient,
  getSkins,
};
