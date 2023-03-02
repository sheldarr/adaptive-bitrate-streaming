const { spawn } = require("child_process");

async function spawnAsync(command, options) {
  const child = spawn(command, options, { shell: true });

  let data = "";
  for await (const chunk of child.stdout) {
    data += chunk;
  }

  let error = "";
  for await (const chunk of child.stderr) {
    error += chunk;
  }

  const exitCode = await new Promise((resolve, reject) => {
    child.on("close", resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }

  return data;
}
