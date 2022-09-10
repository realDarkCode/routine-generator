const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const config = require("../config/spreadsheet.json");

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
const getMemberList = async (auth) => {
  const list = await loadMemberListIfExits();
  if (list) return list;

  console.log("Fetching spreadsheet data");
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheet_id,
    range: config.data_range,
  });
  const rows = res.data.values;
  const heading = rows.shift();
  console.log(`Fetched ${rows.length} members data`);
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

const getActiveMembers = async (memberList, auth) => {
  if (!memberList) memberList = await getMemberList(auth);
  return memberList.filter((member) => member["Status"] === "Active");
};
module.exports = {
  getMemberList,
  getActiveMembers,
};
