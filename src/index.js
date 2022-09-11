const memberService = require("./services/member.service");

(async () => {
  const data = await memberService.getMemberList();
  console.log(data?.length);
})();
