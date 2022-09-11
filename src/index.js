const memberService = require("./services/member.service");

(async () => {
  const data = await memberService.getActiveMembers();
  console.log(data?.length);
})();
