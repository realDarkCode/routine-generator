const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");

(async () => {
  const memberList = await memberService.getActiveMembers();
  routineService.generateRoutine(memberList);
})();
