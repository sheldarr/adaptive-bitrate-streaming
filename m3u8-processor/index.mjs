import ffmpeg from "fluent-ffmpeg";
import ms from "ms";
import path from "path";

import { program } from "commander";

const options = program
  .requiredOption("-i, --inputFile <path>", "path to input file")
  .requiredOption("-o, --outputDirectory <path>", "path to output directory")
  .option("-r, --resolutions <resolution...>", "output resolutions", [
    "360",
    "720",
  ])
  .showHelpAfterError()
  .parse()
  .opts();

const inputFile = path.parse(options.inputFile);

const M3U8_EXTENSION = "m3u8";

const command = ffmpeg(options.inputFile, {
  timeout: ms("5m"),
})
  .on("start", (commandLine) => {
    console.log("Spawned ffmpeg with command: " + commandLine);
  })
  .on("progress", (progress) => {
    console.log(`Processing: ${progress.percent}% done`);
  })
  .on("end", () => {
    console.log(`Finished processing`);
  })
  .on("error", (err) => {
    console.log("Cannot process video: " + err.message);
  });

options.resolutions.forEach((resolution) => {
  command
    .output(
      `${options.outputDirectory}/${inputFile.name}_${resolution}p.${M3U8_EXTENSION}`
    )
    .size(`?x${resolution}`);
});

command.run();
