export const generateThumbnail = () => {
  let numberOfShapes = getRandomInteger(5) + 1;
  let shapes = "";

  for (let i = 0; i < numberOfShapes; i++) {
    shapes += generateShape();
    if (i < numberOfShapes - 1) {
      shapes += ";";
    }
  }

  return `bc=${getRandomColor()};${shapes}`;
};

const generateShape = () => {
  const potentialShapes = ["sq", "rt", "cr"];
  const potentialOrientations = ["v", "h"];

  const shape = potentialShapes[getRandomInteger(3)];
  const orientation = potentialOrientations[getRandomInteger(2)];

  return `st=${shape},sbc=${getRandomColor()},sld=${getRandomInteger(
    70
  )}%,ssx=${getRandomInteger(90)}%,ssy=${getRandomInteger(
    90
  )}%,or=${orientation}`;
};

const getRandomInteger = (maxNotInclusive: number) => {
  return Math.floor(Math.random() * maxNotInclusive);
};

const getRandomColor = () => {
  const alphabet = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];

  let value = "";
  for (let i = 0; i < 6; i++) {
    value += alphabet[getRandomInteger(16)];
  }

  return `#${value}`;
};
