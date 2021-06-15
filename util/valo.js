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
    const startTime = new Date();
    const user = await valorant.login();
    console.log(`Val: Logged in (${(new Date() - startTime) / 1000}s)`);
    const skinsStartTime = new Date();
    const { skins } = await valorant.storeApi.getStorefront(
      valorant.user.Subject,
      true
    );
    console.log(
      `Val: Skins retrieved (${(new Date() - skinsStartTime) / 1000}s)`
    );
    const cardStartTime = new Date();
    const { Identity } = await valorant.playerApi.getInventory(
      user.user.Subject
    );
    console.log(
      `Val: Playercard retrieved (${(new Date() - cardStartTime) / 1000}s)`
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
