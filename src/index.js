const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");
const spreadsheetService = require("./services/spreadsheet.service");
const routineImageService = require("./services/routineImage.service");
const IOService = require("./services/IO.service");
const clearCache = require("./utils/clearCache");
(async () => {
  while (true) {
    IOService.showHomeMenu();
    let input = IOService.takeInputFromConsole(3);
    const memberList = await memberService.getMemberList();
    const activeMemberList = memberService.getActiveMembers(memberList);
    const currentRoutine = await spreadsheetService.getRoutineFromSheet();
    switch (input) {
      case 1: // Member
        IOService.showMemberMenu();
        switch (IOService.takeInputFromConsole(3)) {
          case 1: // show all members
            console.table(memberList);
            continue;
          case 2: // show active members
            console.table(activeMemberList);
            continue;
          case 3: // Member by gender
            const [maleList, femaleList] =
              await memberService.getMemberByGender(activeMemberList, {
                activeOnly: true,
              });
            console.log("------------Male Members---------");
            console.table(maleList);
            console.log("------------Female Members---------");
            console.table(femaleList);
            continue;
        }
        break;
      case 2: // routine
        IOService.showRoutineMenu();
        input = IOService.takeInputFromConsole(3);
        switch (input) {
          case 1: // Show current routine
            console.table(
              routineService.formatSpreadsheetRoutine([...currentRoutine])
            );
            continue;
          case 2: // generate routine
            let newRoutine = routineService.generateRoutine([
              ...activeMemberList,
            ]);
            while (true) {
              console.clear();
              console.table(
                routineService.formatSpreadsheetRoutine(
                  spreadsheetService.FormatRoutineForSheet(newRoutine)
                )
              );
              console.log("1. Ok");
              console.log("2. Regenerate");
              input = IOService.takeInputFromConsole(2);
              if (input === 1) break;
              newRoutine = routineService.generateRoutine([
                ...activeMemberList,
              ]);
            }
            const formattedRoutine =
              spreadsheetService.FormatRoutineForSheet(newRoutine);
            await spreadsheetService.updateRoutineToSheet(formattedRoutine);
            continue;
          case 3: // generate image from current routine
            console.clear();
            console.log("-------------Current Routine--------------");
            console.table(
              routineService.formatSpreadsheetRoutine([...currentRoutine])
            );
            console.log("Select template 1-3");
            const template = IOService.takeInputFromConsole(3);
            await routineImageService.generateImage(
              [...currentRoutine],
              template,
              { watermark: true }
            );
            console.log("Routine Generated ");
            continue;
        }
        break;
      case 3: // clear cache
        clearCache();
        break;
      default:
        console.log({ input });
        throw new Error("Invalid Choice");
    }
  }
})();
