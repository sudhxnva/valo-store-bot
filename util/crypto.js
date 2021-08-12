const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.SECRET);
const iv = crypto.randomBytes(16);

function createCipherKey (secret) {
  return crypto.createHash('md5').update(secret).digest('hex')
}

const encrypt = (text) => {
  const cipherKey = createCipherKey(secretKey)
  const cipher = crypto.createCipheriv(algorithm, cipherKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash) => {
  const cipherKey = createCipherKey(secretKey)
  const decipher = crypto.createDecipheriv(
    algorithm,
    cipherKey,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
