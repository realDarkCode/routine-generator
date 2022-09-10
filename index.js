const authorize = require("./services/auth");
const { google } = require("googleapis");
const config = require("./config/spreadsheet.json");
async function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheet_id,
    range: config.data_range,
  });
  const rows = res.data.values;
  console.log(rows);
}

authorize().then(listMajors).catch(console.error);
