const aws = require("aws-sdk");
const fs = require("fs");

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

  console.log("Params:", params);

  try {
    const objectMeta = await s3.headObject(params).promise();

    console.log("Object meta:", JSON.stringify(objectMeta, null, 2));

    const objectReadStream = s3.getObject(params).createReadStream();

    const ffmpegProcess = ffmpeg(params.Key);

    objectReadStream.pipe(ffmpegProcess.stdin);

    const ffmpegPromise = new Promise((resolve, reject) => {
      ffmpegProcess.on("close", (code) => {
        resolve(code);
      });
    });

    const code = await ffmpegPromise;

    console.log(`ffmpeg process exited with code ${code}`);

    fs.readdirSync(".").forEach((file) => {
      console.log(file);
    });

    fs.readdirSync("./output").forEach((file) => {
      console.log(file);
    });

    const response = {
      statusCode: 200,
      body: `${params.Key} processed successfully`,
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
