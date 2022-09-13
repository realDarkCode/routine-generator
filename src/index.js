const memberService = require("./services/member.service");
const routineService = require("./services/routine.service");

(async () => {
  const memberList = await memberService.getActiveMembers();
  const routine = routineService.generateRoutine(memberList);
  let printed = [];

  routine.map((_) => printed.push(..._));

  console.table(printed);
})();
