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
    switch (input) {
      case 1: // Member
        IOService.showMemberMenu();
        const memberList = await memberService.getMemberList();
        switch (IOService.takeInputFromConsole(3)) {
          case 1: // show all members
            console.table(memberList);
            continue;
          case 2: // show active members
            console.table(await memberService.getActiveMembers(memberList));
            continue;
          case 3: // Member by gender
            const [maleList, femaleList] =
              await memberService.getMemberByGender(memberList, {
                activeOnly: true,
              });
            console.log("------------Male Members---------");
            console.table(maleList);
            console.log("------------Female Members---------");
            console.table(femaleList);
            continue;
          default:
            break;
        }
        break;
      case 2: // routine
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
