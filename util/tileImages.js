const Canvas = require("canvas");

module.exports = async (imageURLs) => {
  let images = [];
  for (const imageURL of imageURLs) {
    const image = await Canvas.loadImage(imageURL);
    images.push(image);
  }

  const width =
    Math.max(
      images[0].width + images[1].width,
      images[2].width + images[3].width
    ) + 40;
  const height =
    Math.max(
      images[0].height + images[2].height,
      images[1].height + images[3].height
    ) + 40; //Resolution I found best that worked for my case

  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(images[0], 0, 0);
  ctx.drawImage(images[1], images[0].width + 40, 0);
  ctx.drawImage(images[2], 0, images[0].height + 40);
  ctx.drawImage(images[3], images[2].width + 40, images[1].height + 40);

  return canvas.toBuffer();
};
