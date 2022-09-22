const Jimp = require("jimp");
const path = require("path");

const formatRoutine = (routine) => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const _routine = [...routine];
  const MEMBER_PER_DAY = 6;
  return days.reduce((store, currentDay, dayIndex) => {
    let currentDayMembers = _routine.splice(0, MEMBER_PER_DAY);
    store[currentDay] = [];
    currentDayMembers.map((member, memberIndex) => {
      store[currentDay][memberIndex] = {
        name: member[0],
        id: `(${member[1]})`,
        ...getPositionInImage(dayIndex, memberIndex),
      };
    });

    return store;
  }, []);
};

// Positions based on image
const statingX = 213;
const startingY = 152;
const gapBetweenColum = 96;
const gapBetweenRow = 66;
const gapBetweenNameAndID = 17;

const getPositionInImage = (row, colum) => {
  const nameX = statingX + gapBetweenColum * colum;
  const nameY = startingY + gapBetweenRow * row;
  const idX = nameX + 3;
  const idY = nameY + gapBetweenNameAndID;
  return { nameX, nameY, idX, idY };
};

const generateImage = async (routine, routineNumber = 1, options = {}) => {
  const defaultOptions = {
    watermark: false,
    ...options,
  };
  const TEMPLATE_IMAGE_PATH = path.join(
    process.cwd(),
    "src",
    "templates",
    `${routineNumber}.png`
  );
  const GENERATED_IMAGE_PATH = path.join(
    process.cwd(),
    "src",
    "generated_routines",
    `${new Date().toDateString().replace(/ /g, "-")}-${routineNumber}.png`
  );
  try {
    const routineWithTextPositions = formatRoutine(routine);

    const image = await Jimp.read(TEMPLATE_IMAGE_PATH);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);

    const waterMarkFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    Object.keys(routineWithTextPositions).map((day) => {
      routineWithTextPositions[day].map((member) => {
        image.print(font, member.nameX, member.nameY, member.name);
        image.print(font, member.idX, member.idY, member.id);
      });
    });

    if (defaultOptions?.watermark) {
      image.print(
        waterMarkFont,
        395,
        465,
        "generated with realDarkCode/routine-generator"
      );
    }
    await image.writeAsync(GENERATED_IMAGE_PATH);
    return GENERATED_IMAGE_PATH;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateImage };
