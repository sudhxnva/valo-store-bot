const { MessageEmbed } = require("discord.js");
const nodeHtmlToImage = require("node-html-to-image");

function generateRegisterEmbed() {
  return {
    color: 0x0099ff,
    title: "ValoStoreBot",
    description:
      "To register your account, please send a message on **this chat** in this format:\n ```!register <region_code> <riot_username> <riot_password>```\n For Example: `!register NA tenz123 password420`\n\nTo find your region code, use [**this map**](https://user-images.githubusercontent.com/57023357/121816553-f22c8a80-cc99-11eb-8109-8b7a5b66e07d.png)\n\n**NOTE**: Enter username that you login to valo client with(**not** your in-game name)\n**NOTE 2**: If you select the wrong region, the skins shown **will not be correct**\n**NOTE 3**: Make sure there's a space bw username and password",
    footer: {
      text: "PS: This bot encrypts and stores your Valorant credentials because the bot has to access your account to get your skins. Riot's public API does not show user skins without logging in at the moment",
    },
  };
}

async function generateSkinsEmbed(
  user,
  skins,
  {
    PlayerCardID = "c89194bd-4710-b54e-8d6c-60be6274fbb2",
    AccountLevel = "Unknown",
  },
  rank = "Unknown",
  message
) {
  let images = "";
  let priceTier = "";

  for (const skin of skins) {
    priceTier = skinPriceTier(skin.cost.amount);
    const imageDiv = `
    <div class="skin-wrapper">
      <div class="skin-bg">
        <div class="skin-text skin-price">
        <div class="content-tier">
          <img src="https://media.valorant-api.com/contenttiers/${priceTier}/displayicon.png"
              class="price-tier-img">
        </div>
          <span class="skin-price-text">${skin.cost.amount.toLocaleString()} VP</span>
        </div>
        <div class="skin-text skin-title">${skin.name}</div>
        <div class="skin-text skin-title bg">${skin.name}</div>
        <img src="https://media.valorant-api.com/weaponskinlevels/${
          skin.id
        }/displayicon.png"
            class="skin-image ${skinType(skin.name, skin.cost.amount)}" />
      </div>
    </div>`;
    images += imageDiv;
  }

  const template = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ValoStoreBot</title>
    <style>
    :root{
            --body-width: 740px;
            --body-height: 400px;
            --grid-width: 360px;
            --skin-bg-height: 170px;
            --skin-bg-width: 340px; /* Skin bg ratio 2:1 (width: height) */
            --text-margin: 8px;
            --text-price-margin: 10px;
        }

        * {
            /* margin: 0; */
            padding: 0;
            box-sizing: border-box;
            font-family: sans-serif;
        }

        body{
            width: var(--body-width);
            height: var(--body-height);
        }

        .skins-container {
            width: var(--body-width);
            height: var(--body-height);
            padding: 9px 0;
            background-color: rgb(0, 0, 0);
            display: grid;
            grid-template-columns: var(--grid-width) var(--grid-width);
            justify-content: center;
        }

        .skin-wrapper {
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: fit-content;
            padding: 0px;
            overflow: hidden;
        }

        .skin-bg {
            background-color: rgb(29 29 29);
            overflow: hidden;
            height: var(--skin-bg-height);
            border-radius: 5px;
            position: relative;
            width: var(--skin-bg-width);
            max-width: var(--skin-bg-width);
        }

        .skin-image {
            max-height: 125px;
            margin-top: 50%;
            margin-left: 50%;
            transform: translate(-54%, -116%) rotate(27deg);
            opacity: 0.9;
            z-index: 200;
        }

        .skin-image.knife {
            transform: translate(-51%, -126%) rotate(45deg);
        }

        .skin-image.frenzy {
          transform: translate(-54%, -116%) rotate(27deg) scale(1.1);
        }

        .skin-image.shorty,
        .skin-image.ghost {
          transform: translate(-54%, -116%) rotate(27deg) scale(0.7);
        }

        .skin-text {
            font-weight: 700;
            font-style: italic;
            color: rgb(231, 229, 229);
            font-size: 16px;
            text-transform: uppercase;
        }

        .skin-text.skin-title.bg{
            position: absolute;
            padding: 2px;
            font-size: 75px;
            color: rgb(255 255 255 / 5%);
        }

        .skin-text.skin-title{
            position: absolute;
            left: 5px;
            bottom: 5px;
            padding: 2px;
            border-radius: 5px;
            max-width: 150px;
            font-size: 20px;
            color: rgba(255, 255, 255, 0.911);
        }

        .skin-text.skin-price {
            position: absolute;
            right: var(--text-price-margin);
            top: var(--text-price-margin);
            padding-right: 4px;
            font-weight: 100;
            font-style: normal;
            display: inline-flex;
            background-color: rgb(0 0 0 / 36%);
            padding: 4px;
            border-radius: 2px;
            z-index: 1;
        }

        .skin-price-text{
            padding-left: 7px; 
            margin-top: auto; 
            margin-bottom: auto; 
            font-size: 16px;
            opacity: 0.85;
        }

        .price-tier-img {
            display: grid;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .content-tier{
            align-self: center;
            width: 20px;
        }
    </style>
</head>

<body>
    <div class="skins-container">
        ${images}
    </div>
</body>

</html>`;

  const image = await nodeHtmlToImage({
    html: template,
    puppeteerArgs: {
      args: ["--no-sandbox"],
    },
    encoding: "buffer",
    transparent: true,
  });

  return new MessageEmbed()
    .setTitle(`${message.author.username}'s Valorant Store`)
    .setDescription(
      `> **Gamer Tag:** ${user.name}#${user.tag} 
      > **Rank:** ${rank}
      > **Region:** ${user.region.toUpperCase()}
      Here are the offers in your store:
      ${AccountLevel === 0 ? "" : `> **Account Level:** ${AccountLevel}`}`
    )
    .setThumbnail(
      `https://media.valorant-api.com/playercards/${PlayerCardID}/smallart.png`
    )
    .attachFiles([{ name: "image.png", attachment: image }])
    .setImage("attachment://image.png")
    .setTimestamp(new Date())
    .setFooter(process.env.EMBED_FOOTER || "Bot by VIPΞR#4643");
}

async function generateMarketEmbed(
  user,
  balance,
  bonusSkins,
  {
    PlayerCardID = "c89194bd-4710-b54e-8d6c-60be6274fbb2",
    AccountLevel = "Unknown",
  },
  message
) {
  let images = "";
  let priceTier = "";

  for (const skin of bonusSkins) {
    skinBaseCost = Math.ceil((skin.offer.cost.amount*100/(100-skin.discountPercent))/5)*5;
    priceTier = skinPriceTier(skinBaseCost);
    const imageDiv = `
    <div class="skin-wrapper">
      <div class="skin-bg">
        <div class="skin-text skin-price">
        <div class="content-tier">
          <img src="https://media.valorant-api.com/contenttiers/${priceTier}/displayicon.png"
              class="price-tier-img">
        </div>
          <span class="skin-price-text">${skin.discountCost.amount.toLocaleString()} VP</span>
        </div>
        <div class="skin-text skin-base-price">
          <span class="skin-discount-percent-text">-${skin.discountPercent}%</span>
          <span class="skin-base-price-text">${skinBaseCost}</span>
        </div>
        <div class="skin-text skin-title">${skin.offer.rewards[0].name}</div>
        <div class="skin-text skin-title bg">${skin.offer.rewards[0].name}</div>
        <img src="https://media.valorant-api.com/weaponskinlevels/${
          skin.offer.rewards[0].id
        }/displayicon.png"
            class="skin-image ${skinType(skin.offer.rewards[0].name, skinBaseCost)}" />
      </div>
    </div>`;
    images += imageDiv;
  }

  const template = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ValoStoreBot</title>
    <style>
    :root{
            --body-width: 740px;
            --body-height: 600px;
            --grid-width: 360px;
            --skin-bg-height: 170px;
            --skin-bg-width: 340px; /* Skin bg ratio 2:1 (width: height) */
            --text-margin: 8px;
            --text-price-margin: 10px;
        }

        * {
            /* margin: 0; */
            padding: 0;
            box-sizing: border-box;
            font-family: sans-serif;
        }

        body{
            width: var(--body-width);
            height: var(--body-height);
        }

        .skins-container {
          width: var(--body-width);
          height: var(--body-height);
          padding: 9px 0;
          background-color: rgb(0, 0, 0);
          display: grid;
          grid-template-columns: var(--grid-width) var(--grid-width);
          justify-content: center;
        }

        .skin-wrapper {
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: fit-content;
          padding: 0px;
          overflow: hidden;
        }

        .skin-bg {
          background-color: rgb(29 29 29);
          overflow: hidden;
          height: var(--skin-bg-height);
          border-radius: 5px;
          position: relative;
          width: var(--skin-bg-width);
          max-width: var(--skin-bg-width);
        }

        .skin-image {
          max-height: 125px;
          margin-top: 50%;
          margin-left: 50%;
          transform: translate(-54%, -116%) rotate(27deg);
          opacity: 0.9;
          z-index: 200;
        }

        .skin-image.knife {
          transform: translate(-51%, -126%) rotate(45deg);
        }

        .skin-image.frenzy {
          transform: translate(-54%, -116%) rotate(27deg) scale(1.1);
        }

        .skin-image.shorty,
        .skin-image.ghost {
          transform: translate(-54%, -116%) rotate(27deg) scale(0.7);
        }

        .skin-text {
          font-weight: 700;
          font-style: italic;
          color: rgb(231, 229, 229);
          font-size: 16px;
          text-transform: uppercase;
        }

        .skin-text.skin-title.bg {
          position: absolute;
          padding: 2px;
          font-size: 75px;
          color: rgb(255 255 255 / 5%);
        }

        .skin-text.skin-title {
          position: absolute;
          left: 5px;
          bottom: 5px;
          padding: 2px;
          border-radius: 5px;
          max-width: 150px;
          font-size: 20px;
          color: rgba(255, 255, 255, 0.911);
        }

        .skin-text.skin-price {
          position: absolute;
          right: var(--text-price-margin);
          top: var(--text-price-margin);
          padding-right: 4px;
          font-weight: 100;
          font-style: normal;
          display: inline-flex;
          background-color: rgb(0 0 0 / 36%);
          padding: 4px;
          border-radius: 2px;
          z-index: 1;
        }

        .skin-text.skin-base-price {
          position: absolute;
          right: var(--text-price-margin);
          top: calc(var(--text-price-margin) + 33px);
          padding-right: 4px;
          font-weight: 100;
          font-style: normal;
          display: inline-flex;
          background-color: rgb(0 0 0 / 36%);
          padding: 4px;
          border-radius: 2px;
          z-index: 1;
          color: indianred;
        }

        .skin-price-text {
          padding-left: 7px;
          margin-top: auto;
          margin-bottom: auto;
          font-size: 16px;
          opacity: 0.85;
        }

        .skin-discount-percent-text {
          margin-top: auto;
          margin-bottom: auto;
          font-size: 16px;
          opacity: 0.85;
        }
        
        .skin-base-price-text {
          padding-left: 5px;
          margin-top: auto;
          margin-bottom: auto;
          font-size: 12px;
          opacity: 0.85;
          text-decoration: line-through;
        }
        
        .price-tier-img {
          display: grid;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .content-tier {
          align-self: center;
          width: 20px;
        }
    </style>
</head>

<body>
    <div class="skins-container">
        ${images}
    </div>
</body>

</html>`;

  const image = await nodeHtmlToImage({
    html: template,
    puppeteerArgs: {
      args: ["--no-sandbox"],
    },
    encoding: "buffer",
    transparent: true,
  });

  return new MessageEmbed()
    .setTitle(`${message.author.username}'s Valorant Night Market`)
    .setDescription(
      `> **Gamer Tag:** ${user.name}#${user.tag} 
      > **Valorant Points:** ${balance.find(x => x.name === 'Valorant Points').amount}
      > **Radiant Points:** ${balance.find(x => x.name === 'Radiant Points').amount} 
      > **Region:** ${user.region.toUpperCase()}
      Here are the offers in your Night Market:
      ${AccountLevel === 0 ? "" : `> **Account Level:** ${AccountLevel}`}`
    )
    .setThumbnail(
      `https://media.valorant-api.com/playercards/${PlayerCardID}/smallart.png`
    )
    .attachFiles([{ name: "image.png", attachment: image }])
    .setImage("attachment://image.png")
    .setTimestamp(new Date())
    .setFooter(process.env.EMBED_FOOTER || "Bot by VIPΞR#4643");
}

function skinPriceTier(baseprice) {
  switch (baseprice) {
    case 875:
      return "12683d76-48d7-84a3-4e09-6985794f0445";
    case 1275:
      return "0cebb8be-46d7-c12a-d306-e9907bfc5a25";
    case 1775:
      return "60bca009-4182-7998-dee7-b8a2558dc369";
    case 2175:
      return "60bca009-4182-7998-dee7-b8a2558dc369";
    case 2475:
      return "411e4a55-4e59-7757-41f0-86a53f101bb5";
    default:
      return "e046854e-406c-37f4-6607-19a9ba8426fc";
  }
}

function skinType(name, baseprice){
  if (isKnife(name,baseprice))
    return "knife";
  if (name.includes('Shorty'))
    return "shorty";
  if (name.includes('Frenzy'))
    return "frenzy";
  if (name.includes('Ghost'))
    return "ghost";
  return "";
}

function isKnife(name, baseprice) {
  if (baseprice >= 3550)
    return true;
  if (name.includes('Knife'))
    return true;
  const uniques = ["Catrina", "Winterwunderland Candy Cane"];
  if (uniques.includes(name))
    return true;
  return false;
}

module.exports = {
  generateRegisterEmbed,
  generateSkinsEmbed,
  generateMarketEmbed,
};
