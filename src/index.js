const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");
const spreadsheetService = require("./services/spreadsheet.service");

// TODO: Generate Routine image from routine data
(async () => {
  // const memberList = await memberService.getActiveMembers();
  // const routine = routineService.generateRoutine(memberList);
  // const formattedRoutine = spreadsheetService.FormatRoutineForSheet(routine);
  // spreadsheetService.updateRoutineToSheet(formattedRoutine);
  const routine = await spreadsheetService.getRoutineFromSheet();

  console.log(routine);
})();
