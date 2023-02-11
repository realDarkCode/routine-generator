const memberService = require("./member.service");
const config = require("../config/member.json");
const { isSameObject } = require("../utils/objectMethod");
const routineConfig = require("../config/routine.json");
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
  let [boysList, girlsList] = memberService.getMemberByGender(memberList);
  const routine = getBlankRoutine();
  const boys = [...boysList];
  const girls = [...girlsList];
  const memberPerDay = routineConfig.memberPerDay || 6;
  let member;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < memberPerDay; j++) {
      if (boysList.length === 0)
        boysList = memberService.getMemberByGender(memberList, {
          maleOnly: true,
        });
      if (girlsList.length === 0)
        girlsList = memberService.getMemberByGender(memberList, {
          femaleOnly: true,
        });
      if (j < memberPerDay / 2) {
        member = getRandomMember(boys) || getExtraMember(routine[i], boysList);
      } else {
        member =
          getRandomMember(girls) || getExtraMember(routine[i], girlsList);
      }
      routine[i][j] = member;
    }
  }
  return routine;
};

const formatSpreadsheetRoutine = (routine) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  return days.reduce((store, currentDay) => {
    const currentDayMembers = routine.splice(
      0,
      routineConfig.memberPerDay || 6
    );
    currentDayMembers.map((member) =>
      store.push({
        day: currentDay,
        name: member[0],
        id: member[1],
        section: member[2],
      })
    );
    return store;
  }, []);
};
const verifyRoutine = (spreadSheetRoutine, activeMemberList) => {
  spreadSheetRoutine = formatSpreadsheetRoutine(spreadSheetRoutine);
  const result = activeMemberList.reduce((acc, curr) => {
    const member = {};
    member.name = curr["Short Name"];
    member.id = curr["ID"].slice(-3);
    member.section = curr["Section"];
    const dutyDay = spreadSheetRoutine
      .reduce((acc, curr) => {
        if (curr.id === member.id) acc.push(curr.day);
        return acc;
      }, [])
      .join(", ");
    member.day = dutyDay;
    acc.push(member);
    return acc;
  }, []);
  return result;
};
module.exports = {
  generateRoutine,
  formatSpreadsheetRoutine,
  verifyRoutine,
};
