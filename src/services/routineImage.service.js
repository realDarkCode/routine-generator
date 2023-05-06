const Jimp = require("jimp");
const path = require("path");
const routineConfig = require("../config/routine.json");
const { nextSundayDate } = require("../utils/util");
const formatRoutine = (routine, memberPerDay = 6, landscape = true) => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const _routine = [...routine];
  return days.reduce((store, currentDay, dayIndex) => {
    let currentDayMembers = _routine.splice(0, memberPerDay);
    currentDayMembers.sort(([aName], [bName]) => {
      if (aName < bName) return -1;
      else if (aName > bName) return 1;
      else return 0;
    });
    store[currentDay] = [];
    currentDayMembers.map((member, memberIndex) => {
      let positions;
      if (!landscape) {
        positions = getPositionInImage(memberIndex, dayIndex);
      } else {
        positions = getPositionInImage(dayIndex, memberIndex);
      }
      store[currentDay][memberIndex] = {
        name: member[0].toUpperCase(),
        id: `${member[2].charAt(0)}-${member[1]}`,
        ...positions,
      };
    });
    return store;
  }, []);
};

// Positions based on image
const statingX = 160;
const startingY = 1051;
const gapBetweenColum = 371;
const gapBetweenRow = 171;
const gapBetweenNameAndID = 55;

const getPositionInImage = (row, colum) => {
  const nameX = statingX + gapBetweenColum * colum;
  const nameY = startingY + gapBetweenRow * row;
  const idX = nameX + 5;
  const idY = nameY + gapBetweenNameAndID;
  return { nameX, nameY, idX, idY };
};

const formatInputDays = (days) => {
  const allDays = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const result = [];

  if (typeof days !== "string") return [];
  if (days.length === 0) return [];
  days = days.split(" ");
  days.forEach((day) => {
    const dayInNum = parseInt(day);
    if (dayInNum < 1 && dayInNum > 5) return;
    result.push(allDays[dayInNum - 1]);
  });
  return result;
};

const generateImage = async (routine, routineNumber = 1, options = {}) => {
  const allDays = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const _options = {
    watermark: false,
    ...options,
  };

  const userDays = formatInputDays(options.days);
  const DAYS = userDays.length === 0 ? allDays : userDays;

  const MEMBER_PER_DAY = routineConfig.memberPerDay || 6;
  const IS_IMAGE_LANDSCAPE = routineConfig.IsImageLandscape || false;

  const TEMPLATE_IMAGE_PATH = path.join(
    process.cwd(),
    "src",
    "templates",
    `${routineNumber}-${MEMBER_PER_DAY}.png`
  );
  const GENERATED_IMAGE_PATH = path.join(
    process.cwd(),
    "src",
    "routines",
    `${new Date().toDateString().replace(/ /g, "-")}-${routineNumber}.png`
  );

  try {
    const routineWithTextPositions = formatRoutine(
      routine,
      MEMBER_PER_DAY,
      IS_IMAGE_LANDSCAPE
    );

    const image = await Jimp.read(TEMPLATE_IMAGE_PATH);
    const bodyFont = await Jimp.loadFont(
      path.join(__dirname, `../fonts/MONTSERRAT_52_MEDIUM.fnt`)
    );
    const headingFont = await Jimp.loadFont(
      path.join(__dirname, `../fonts/MONTSERRAT_64_MEDIUM.fnt`)
    );

    const headingBoldFont = await Jimp.loadFont(
      path.join(__dirname, `../fonts/MONTSERRAT_64_BOLD.fnt`)
    );

    // Printing routine heading
    image.print(headingBoldFont, 155, 662, "Starts:");
    image.print(
      headingFont,
      390,
      662,
      nextSundayDate().toLocaleDateString("en-US", {
        day: "2-digit",
        year: "numeric",
        month: "short",
      })
    );

    image.print(headingBoldFont, 1088, 662, "Entry:");
    image.print(headingFont, 1306, 662, "7:00 AM");

    // Printing routine data
    DAYS.map((day) => {
      routineWithTextPositions[day].map((member) => {
        image.print(bodyFont, member.nameX, member.nameY, member.name);
        image.print(bodyFont, member.idX, member.idY, member.id);
      });
    });

    await image.writeAsync(GENERATED_IMAGE_PATH);
    return GENERATED_IMAGE_PATH;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateImage, formatRoutine };
