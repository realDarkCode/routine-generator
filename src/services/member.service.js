const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const spreadsheetService = require("./spreadsheet.service");

const MEMBER_LIST_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "memberList.json"
);
const saveMemberList = async (memberList) => {
  const content = JSON.stringify(memberList);
  await fs.writeFile(MEMBER_LIST_PATH, content);
};

const loadMemberListIfExits = async () => {
  try {
    const content = await fs.readFile(MEMBER_LIST_PATH);
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
};
const getMemberList = async () => {
  const list = await loadMemberListIfExits();
  if (list) return list;
  const members = await spreadsheetService.getMemberListFromSheet();
  const rows = members;
  const heading = rows.shift();
  const memberListInObj = rows.reduce((store, row) => {
    let obj = {};
    row.map((colData, index) => {
      obj[heading[index]] = colData;
    });
    store.push(obj);
    return store;
  }, []);
  await saveMemberList(memberListInObj);
  return memberListInObj;
};

const getActiveMembers = async (memberList) => {
  if (!memberList) memberList = await getMemberList();
  return memberList.filter((member) => member["Status"] === "Active");
};
module.exports = {
  getMemberList,
  getActiveMembers,
};
