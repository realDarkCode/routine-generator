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

function nextSundayDate() {
  var today = new Date();
  today.setDate(today.getDate() + ((0 - 1 - today.getDay() + 7) % 7) + 1);
  return today;
}
module.exports = { deleteFile, makeDirIfNotExists, nextSundayDate };
