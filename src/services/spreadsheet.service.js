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

const updateRoutineToSheet = async (formattedRoutine = []) => {
  console.log("Updating Routine...");
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheet_id,
    range: config.routine_data_range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: formattedRoutine,
    },
  });
  console.log(
    `Updated ${response.data.updatedRows || 0} Rows, ${
      response.data.updatedColumns || 0
    } Columns, ${response.data.updatedCells || 0} Cells `
  );
};

const FormatRoutineForSheet = (routine = []) => {
  const formattedRoutine = [];
  routine.map((day) =>
    day.map((member) => {
      console.log(member)
      formattedRoutine.push([
        member.short_name,
        member.id.slice(-3),
        member.section,
      ]);
    })
  );

  return formattedRoutine;
};

const getRoutineFromSheet = async () => {
  const auth = await authorize();

  console.log("Fetching routine data");
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheet_id,
    range: config.routine_data_range,
  });
  return res.data.values;
};
module.exports = {
  getMemberListFromSheet,
  FormatRoutineForSheet,
  updateRoutineToSheet,
  getRoutineFromSheet,
};
