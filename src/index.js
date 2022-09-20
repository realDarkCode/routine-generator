const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");
const spreadsheetService = require("./services/spreadsheet.service");
const routineImageService = require("./services/routineImage.service");

// TODO: Generate Routine image from routine data
(async () => {
  // const memberList = await memberService.getActiveMembers();
  // const routine = routineService.generateRoutine(memberList);
  // const formattedRoutine = spreadsheetService.FormatRoutineForSheet(routine);
  // spreadsheetService.updateRoutineToSheet(formattedRoutine);

  let routine = await spreadsheetService.getRoutineFromSheet();
  routineImageService.generateImage(routine, 1);
  routineImageService.generateImage(routine, 2);
  routineImageService.generateImage(routine, 3);
})();
