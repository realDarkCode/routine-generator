const memberService = require("./member.service");
const config = require("../config/member.json");
const { isSameObject } = require("../utils/objectMethod");
const getBlankRoutine = () => {
  return [[], [], [], [], []];
};

const deleteMemberFromList = (memberList, memberId) => {
  let memberAtIndex;
  memberList.find((member, index) => {
    if (member["ID"] === memberId) {
      memberAtIndex = index;
      return;
    }
  });
  memberList.splice(memberAtIndex, 1);
};

const getRandomMember = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  let member = list[randomIndex];
  if (!member) return null;
  list.splice(randomIndex, 1);
  return member;
};

const getExtraMember = (dayRoutine = [], list = []) => {
  while (true) {
    const member = getRandomMember(list);
    const isMemberAlreadyExits = !!dayRoutine.find((m) => member?.id === m?.id);

    if (!isMemberAlreadyExits) {
      return member;
    }
  }
};
const generateRoutine = (memberList) => {
  const excludeList = config.exclude || [];
  excludeList.map((id) => deleteMemberFromList(memberList, id));
  const [boysList, girlsList] = memberService.getMemberByGender(memberList);
  const routine = getBlankRoutine();
  const boys = [...boysList];
  const girls = [...girlsList];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      if (j < 3) {
        let boy = getRandomMember(boys);
        if (!boy) {
          boy = getExtraMember(routine[i], boysList);
        }
        routine[i][j] = boy;
      } else {
        let girl = getRandomMember(girls);
        routine[i][j] = girl;
      }
    }
  }
  return routine;
};

module.exports = { generateRoutine };
