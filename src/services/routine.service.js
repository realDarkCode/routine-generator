const memberService = require("./member.service");
const getBlankRoutine = () => {
  return new Array(5).fill(new Array(6));
};

const deleteMemberFromArray = (memberList, memberId) => {
  let memberAtIndex;
  memberList.find((member, index) => {
    if (member["id"] === memberId) {
      memberAtIndex = index;
      return;
    }
  });
  memberList.splice(memberAtIndex, 1);
};

const getRandomMember = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  let member = list[randomIndex];
  list.splice(randomIndex, 1);
  return member;
};
const generateRoutine = (memberList) => {
  const [boysList, girlsList] = memberService.getMemberByGender(memberList);
  const routine = getBlankRoutine();
};

module.exports = { generateRoutine };
