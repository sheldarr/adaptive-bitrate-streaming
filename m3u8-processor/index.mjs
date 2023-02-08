import ffmpeg from "fluent-ffmpeg";
import ms from "ms";

import { program } from "commander";

const options = program
  .requiredOption("-i, --input <path>")
  .requiredOption("-o, --output <path>")
  .parse()
  .opts();

ffmpeg(input, {
  timeout: ms("5m"),
})
  .on("progress", function (progress) {
    console.log(`Processing: ${progress.percent}% done`);
  })
  .on("error", function (err) {
    console.log("Cannot process video: " + err.message);
    reject();
  })
  .on("end", () => {
    console.log(`Finished processing: ${output}`);
    resolve();
  })
  .save(output);
