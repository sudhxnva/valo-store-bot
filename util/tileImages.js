const Canvas = require("canvas");

module.exports = async (imageURLs) => {
  const maxHeight = 250;
  let totalHeight = 0;
  const yPadding = 50;

  let images = [];
  for (const imageURL of imageURLs) {
    const image = await Canvas.loadImage(imageURL);
    images.push({
      data: image,
      rHeight: maxHeight,
      rWidth: maxHeight * (image.width / image.height),
    });
  }

  images.forEach((image) => (totalHeight += image.rHeight));

  const height = totalHeight + 4 * yPadding;
  const width = Math.max(
    images[0].rWidth,
    images[1].rWidth,
    images[2].rWidth,
    images[3].rWidth
  );
  const middleXOffset = Math.max(images[0].rWidth, images[2].rWidth);
  const middleYOffset = Math.max(images[0].rHeight, images[1].rHeight);

  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    images[0].data,
    0,
    0,
    images[0].data.width,
    images[0].data.height,
    (width - images[0].rWidth) / 2,
    0,
    images[0].rWidth,
    images[0].rHeight
  );
  ctx.drawImage(
    images[1].data,
    0,
    0,
    images[1].data.width,
    images[1].data.height,
    (width - images[1].rWidth) / 2,
    images[0].rHeight + yPadding,
    images[1].rWidth,
    images[1].rHeight
  );
  ctx.drawImage(
    images[2].data,
    0,
    0,
    images[2].data.width,
    images[2].data.height,
    (width - images[2].rWidth) / 2,
    images[0].rHeight + images[1].rHeight + 2 * yPadding,
    images[2].rWidth,
    images[2].rHeight
  );
  ctx.drawImage(
    images[3].data,
    0,
    0,
    images[3].data.width,
    images[3].data.height,
    (width - images[3].rWidth) / 2,
    images[0].rHeight + images[1].rHeight + images[2].rHeight + 3 * yPadding,
    images[3].rWidth,
    images[3].rHeight
  );

  return canvas.toBuffer();
};
