import { spawn } from "child_process";
import fs from "fs";
import path from "path";

import { program } from "commander";

const options = program
  .requiredOption("-i, --inputFile <path>", "path to input file")
  .requiredOption("-o, --outputDirectory <path>", "path to output directory")
  .showHelpAfterError()
  .parse()
  .opts();

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

const THUMBNAILS = [
  {
    extension: "jpeg",
    width: "1920",
    height: "1080",
    type: "1080p",
  },
  {
    extension: "jpeg",
    width: "1280",
    height: "720",
    type: "720p",
  },
];

const OUTPUT_PATH = "output/";

const inputFile = path.parse(options.inputFile);
const inputFileReadStream = fs.createReadStream(options.inputFile);

const M3U8_EXTENSION = "m3u8";

const inputArgs = ["-hide_banner", "-re", "-i pipe:"];
const mapArgs = RESOLUTIONS.map(() => {
  return "-map 0:v:0";
});
const encodingArgs = ["-c:v h264", "-crf 23"];
const filterArgs = RESOLUTIONS.flatMap((resolution, index) => {
  return [
    `-filter:v:${index} scale=w=${resolution.width}:h=${resolution.height}`,
    `-maxrate:v:${index} ${resolution.maxrate}`,
    `-bufsize:v:${index} ${resolution.bufsize}`,
  ];
});
const varStreamArgs = [
  `-var_stream_map "${RESOLUTIONS.map(
    (resolution, index) =>
      `v:${index},name:${inputFile.name}_${resolution.type}`
  ).join(" ")}"`,
];
const hlsArgs = [
  "-hls_time 4",
  `-hls_segment_filename ${OUTPUT_PATH}%v_%03d.ts`,
  "-master_pl_name master.m3u8",
];
const videoOutput = [`${OUTPUT_PATH}%v.m3u8`];
const thumbnailsOutput = THUMBNAILS.flatMap((thumbnail, index) => [
  "-r 1",
  "-t 1",
  `-filter scale=w=${thumbnail.width}:h=${thumbnail.height}`,
  `${OUTPUT_PATH}${inputFile.name}_${thumbnail.type}.${thumbnail.extension}`,
]);

const ffmpegArgs = [
  ...inputArgs,
  ...mapArgs,
  ...encodingArgs,
  ...filterArgs,
  ...varStreamArgs,
  ...hlsArgs,
  ...videoOutput,
  ...thumbnailsOutput,
];

const ffmpegCommand = `ffmpeg \n\t${ffmpegArgs.join("\n\t")}`;
console.log(ffmpegCommand);

const ffmpeg = spawn("ffmpeg", ffmpegArgs, { shell: true });

inputFileReadStream.pipe(ffmpeg.stdin);

ffmpeg.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ffmpeg.on("close", (code) => {
  console.log(`ffmpeg process exited with code ${code}`);
});
