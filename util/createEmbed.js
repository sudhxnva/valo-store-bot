const { MessageEmbed } = require("discord.js");
const tileImages = require("./tileImages");
const nodeHtmlToImage = require("node-html-to-image");

async function generateSkinsEmbed(user, skins, message) {
  const image = await tileImages(
    skins.map(
      (skin) =>
        `https://media.valorant-api.com/weaponskinlevels/${skin.id}/displayicon.png`
    )
  );

  //A crude implementation of a divider :D
  const fields = skins.map((skin) => ({
    name: skin.name,
    value: `Cost: ${skin.cost.amount} VP`,
    inline: false,
  }));

  return new MessageEmbed()
    .setTitle(`${user}'s Valorant Store`)
    .setAuthor("ValoStoreBot")
    .setDescription(
      `<@${message.author.id}>, here are the offers in your store:`
    )
    .addFields(fields)
    .attachFiles([{ name: "image.png", attachment: image }])
    .setImage("attachment://image.png")
    .setColor(0x0099ff)
    .setTimestamp(new Date())
    .setFooter("Bot by VIPΞR#4643");
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

async function newAttachment(skins) {
  let images = "";
  let priceTier = "";

  for (const skin of skins) {
    switch (skin.cost.amount) {
      case 875:
        priceTier = "12683d76-48d7-84a3-4e09-6985794f0445";
        break;
      case 1275:
        priceTier = "0cebb8be-46d7-c12a-d306-e9907bfc5a25";
        break;
      case 1775:
        priceTier = "60bca009-4182-7998-dee7-b8a2558dc369";
        break;
      case 2475:
        priceTier = "12683d76-48d7-84a3-4e09-6985794f0445";
        break;
      default:
        priceTier = "411e4a55-4e59-7757-41f0-86a53f101bb5";
        break;
    }
    const imageDiv = `
    <div class="skin-wrapper">
      <div class="skin-bg">
        <div class="skin-text skin-price">
          <img src="https://media.valorant-api.com/contenttiers/${priceTier}/displayicon.png"
              class="price-tier-img">
          <span class="skin-price-text">${skin.cost.amount} VP</span>
        </div>
        <div class="skin-text skin-title">${skin.name}</div>
        <div class="skin-text skin-title bg">${skin.name}</div>
        <img src="https://media.valorant-api.com/weaponskinlevels/${skin.id}/displayicon.png"
            class="skin-image" />
      </div>
    </div>`;
    images += imageDiv;
  }

  const template = `<!DOCTYPE html>
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
            border-radius: 10px;
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
            background-color: rgb(48, 48, 48);
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
            color: rgb(255 255 255 / 4%);
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
            z-index: 1;
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
            border-radius: 7px;
            z-index: 1;
        }

        .skin-price-text{
            padding-left: 3px; 
            margin-top: auto; 
            margin-bottom: auto; 
            font-size: 20px;
            opacity: 0.85;
        }

        .price-tier-img {
            width: 15px;
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
  return image;
}

module.exports = {
  generateSkinsEmbed,
  generateRegisterEmbed,
  newAttachment,
};
