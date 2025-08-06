const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  grayLight: "\x1b[90m",
  black: "\x1b[40m",
};

const print = (data, color) => {
  if (typeof data === "object") {
    return console.log(data);
  }
  console.log(`${colors[color]}${data}\x1b[0m`);
};

export default print;
