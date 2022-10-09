const prompt = require("prompt-sync")();

const showHomeMenu = () => {
  console.log("-------Duty Schedule Generator----------");
  console.log("-------Home Menu----------");
  console.log("1. Member");
  console.log("2. Routine");
  console.log("3. Clear Cache");
  console.log("0. Exit");
};

const showMemberMenu = () => {
  console.clear();
  console.log("-------Duty Schedule Generator----------");
  console.log("-------Member Menu----------");
  console.log("1. Show All Member List");
  console.log("2. Show All Active Members");
  console.log("3. Show Member list by Gender");
  console.log("0. Exit");
};

const showRoutineMenu = () => {
  console.clear();
  console.log("-------Duty Schedule Generator----------");
  console.log("-------Routine Menu----------");
  console.log("1. Show Current Routine");
  console.log("2. Verify routine");
  console.log("3. Generate new Routine");
  console.log("4. Generate Image from current Routine");
  console.log("0. Exit");
};

const takeInputFromConsole = (highestOption = 3) => {
  let input;
  while (true) {
    input = parseInt(prompt("Enter an Option: ")) ?? -1;
    if (input === 0) process.exit(0);
    if (input >= 1 && input <= highestOption) return input;
    console.log("Invalid Input!");
  }
};
module.exports = {
  showHomeMenu,
  showMemberMenu,
  showRoutineMenu,
  takeInputFromConsole,
};
