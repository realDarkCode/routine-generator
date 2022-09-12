const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");

(async () => {
  const memberList = await memberService.getActiveMembers();
  const routine = routineService.generateRoutine(memberList);

  console.log(routine);
})();
