const fs = require("node:fs");
const path = require("node:path");

const deleteFile = (path) => {
  try {
    fs.existsSync(path) && fs.unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { deleteFile };
