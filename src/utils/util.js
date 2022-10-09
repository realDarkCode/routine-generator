const fs = require("node:fs");
const path = require("node:path");

const deleteFile = (path) => {
  try {
    fs.existsSync(path) && fs.unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
};

const makeDirIfNotExists = (PATH) => {
  try {
    if (!fs.existsSync(PATH)) fs.mkdirSync(PATH, { recursive: true });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { deleteFile, makeDirIfNotExists };
