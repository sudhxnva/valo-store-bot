const { RiotApiClient, Region, Locale } = require("@survfate/valorant.js");
const fetch = require("node-fetch");

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
    const balance = await valorant.storeApi.getWallet(
      valorant.user.Subject,
      true
    );

    const { skins, bonus } = await valorant.storeApi.getStorefront(
      valorant.user.Subject,
      true,
      process.env.CONTENT_LOCALE || 'en-US',
    );
    const { Identity } = await valorant.playerApi.getInventory(
      user.user.Subject
    );

    const data = {
      skins,
      bonus,
      balance,
      Identity,
    };

    const {
      QueueSkills: {
        competitive: { TotalGamesNeededForRating },
      },
    } = await user.matchApi.getMmr(user.user.Subject);
    if (!TotalGamesNeededForRating) {
      data.lastCompetitiveMatch = await getLastCompetitiveMatch(user);
    } else data.unranked = { gamesNeededForRank: TotalGamesNeededForRating };

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getLastCompetitiveMatch(val) {
  try {
    const doFetch = async ({ accessToken, rsoToken }, userId, startIndex) => {
      const res = await fetch(
        `https://pd.ap.a.pvp.net/mmr/v1/players/${userId}/competitiveupdates?startIndex=${startIndex}&endIndex=${
          startIndex + 20
        }`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
            "X-Riot-Entitlements-JWT": `${rsoToken.entitlements_token}`,
            "X-Riot-ClientPlatform":
              "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
          },
        }
      );
      const resJson = await res.json();
      return resJson.Matches;
    };

    let counter = 0;
    let match;
    while (counter <= 100) {
      const matches = await doFetch(val.auth, val.user.Subject, counter);
      match = matches.find((match) => match.TierAfterUpdate > 2);
      if (match) break;
      counter += 20;
    }
    return match ? match : null;
  } catch (error) {}
}

module.exports = {
  getClient,
  getSkins,
};
