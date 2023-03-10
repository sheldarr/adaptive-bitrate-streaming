const aws = require("aws-sdk");
const fs = require("fs/promises");
const path = require("path");

const { INPUT_PATH, OUTPUT_PATH } = require("./constants");
const ffmpeg = require("./ffmpeg");

const s3 = new aws.S3();

exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const videoPath = path.parse(key);

  try {
    const objectMeta = await s3.headObject(params).promise();

    console.log("Object meta:", JSON.stringify(objectMeta, null, 2));

    const videoObjectResponse = await s3.getObject(params).promise();

    await fs.mkdir(INPUT_PATH);
    await fs.mkdir(OUTPUT_PATH);

    await fs.writeFile(
      `${INPUT_PATH}/${videoPath.base}`,
      videoObjectResponse.Body
    );

    const ffmpegProcess = ffmpeg(videoPath);

    const ffmpegPromise = new Promise((resolve, reject) => {
      ffmpegProcess.on("close", (code) => {
        resolve(code);
      });
    });

    const code = await ffmpegPromise;

    if (code !== 0) {
      throw new Error(`ffmpeg process failed with code ${code}`);
    }

    console.log(`ffmpeg process exited with code ${code}`);

    const filePaths = await fs.readdir("/tmp/output");

    await Promise.all(
      filePaths.map(async (file) => {
        const fileBuffer = await fs.readFile(`${OUTPUT_PATH}/${file}`);

        console.log(
          `Saving ${file} to ${bucket}/output/${videoPath.name}/${file}`
        );

        return s3
          .putObject({
            Body: fileBuffer,
            Bucket: bucket,
            Key: `output/${videoPath.name}/${file}`,
          })
          .promise();
      })
    );

    const response = {
      statusCode: 200,
      body: `${bucket}/${key} processed successfully`,
    };

    return response;
  } catch (err) {
    console.error("Error:\n" + err);

    const response = {
      statusCode: 500,
      body: `${err}`,
    };

    return response;
  }
};
