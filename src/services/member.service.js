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
const getMemberByGender = (memberList, options = {}) => {
  if (!memberList) throw new Error("Please Provide Member List");
  const boysList = [];
  const girlsList = [];
  const _options = Object.assign(
    {
      activeOnly: false,
      maleOnly: false,
      femaleOnly: false,
    },
    options
  );
  if (_options?.activeOnly) memberList = getActiveMembers(memberList);
  memberList.map((member) => {
    let memberDetails = {
      name: member.Name,
      short_name: member["Short Name"],
      section: member.Section,
      id: member.ID,
    };
    if (member["Gender"] === "Male") {
      boysList.push(memberDetails);
    } else if (member["Gender"] === "Female") {
      girlsList.push(memberDetails);
    } else {
      console.log("Gender not specified");
    }
  });
  if (_options.maleOnly) return boysList;
  else if (_options.femaleOnly) return girlsList;
  return [boysList, girlsList];
};
const getActiveMembers = (memberList) => {
  if (!memberList) throw new Error("Please Provide Member List");

  return memberList.filter((member) => member["Status"] === "Active");
};

const getMembersById = (ids = [], memberList = []) => {
  return memberList.reduce((store, member) => {
    let memberDetails = {
      name: member.Name,
      short_name: member["Short Name"],
      section: member.Section,
      id: member.ID,
    };

    if (ids.includes(memberDetails.id)) store.push(memberDetails);
    return store;
  }, []);
};
module.exports = {
  getMemberList,
  getActiveMembers,
  getMemberByGender,
  getMembersById,
};
