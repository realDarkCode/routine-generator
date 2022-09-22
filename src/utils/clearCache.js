const { deleteFile } = require("./util");
const path = require("node:path");
const clearCache = () => {
  const tokenPath = path.join(process.cwd(), "token.json");
  const cachedMemberListPath = path.join(
    process.cwd(),
    "src",
    "data",
    "memberList.json"
  );

  deleteFile(tokenPath);
  deleteFile(cachedMemberListPath);
};

module.exports = clearCache;
