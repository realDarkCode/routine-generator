const authorize = require("./auth");
const config = require("../config/spreadsheet.json");
const { google } = require("googleapis");

const getMemberListFromSheet = async () => {
  const auth = await authorize();

  console.log("Fetching Member's data");
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheet_id,
    range: config.member_list_data_range,
  });
  console.log(`Fetched ${res?.data?.values.length} member's data`);
  return res.data.values;
};

module.exports = { getMemberListFromSheet };
