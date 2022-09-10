const authorize = require("./services/auth");
const memberService = require("./services/member.service");
async function run(auth) {
  console.log("Logged in successfully");
  const memberList = await memberService.getActiveMembers(null, auth);
  console.log(memberList.length);
}

authorize().then(run).catch(console.error);
