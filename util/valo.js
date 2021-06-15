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
    console.log("Val: Logged in");
    const { skins } = await valorant.storeApi.getStorefront(
      valorant.user.Subject,
      true
    );
    console.log("Val: Skins retrieved");
    const { Identity } = await valorant.playerApi.getInventory(
      user.user.Subject
    );
    console.log("Val: Playercard retrieved");
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
