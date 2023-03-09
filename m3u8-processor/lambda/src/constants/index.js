const TMP_PATH = "/tmp";
const INPUT_PATH = `${TMP_PATH}/input`;
const OUTPUT_PATH = `${TMP_PATH}/output`;

const RESOLUTIONS = [
  {
    width: "854",
    height: "480",
    type: "480p",
    maxrate: "1500k",
    bufsize: "2000k",
  },
  {
    width: "1280",
    height: "720",
    type: "720p",
    maxrate: "3000k",
    bufsize: "4000k",
  },
  {
    width: "1920",
    height: "1080",
    type: "1080p",
    maxrate: "4500k",
    bufsize: "6000k",
  },
  {
    width: "3840",
    height: "2160",
    type: "4k",
    maxrate: "25500k",
    bufsize: "34000k",
  },
];

module.exports = {
  INPUT_PATH,
  OUTPUT_PATH,
  RESOLUTIONS,
};
