const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");
const spreadsheetService = require("./services/spreadsheet.service");
(async () => {
  const memberList = await memberService.getActiveMembers();
  const routine = routineService.generateRoutine(memberList);
  const formattedRoutine = spreadsheetService.FormatRoutineForSheet(routine);
  spreadsheetService.updateRoutineToSheet(formattedRoutine);
})();
