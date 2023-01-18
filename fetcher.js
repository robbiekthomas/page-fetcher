const request = require("request");
const fs = require("fs");
const readline = require("readline");

const args = process.argv.slice(2);

const writeFile = (url, filePath, isExit = false) => {
  request(url, (error, response, body) => {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    fs.writeFile(filePath, body, (err) => {
      if (err) {
        console.error(err);
      }
      console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}`);
      if (isExit) process.exit();
    });
  });
};
const readAndWriteFiles = async () => {
  const rlLine = readline.createInterface({
    input: readStream,
  });

  const rlQuestion = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let isExist = false;
  for await (const line of rlLine) {
    if (line) {
      isExist = true;
      break;
    }
  }
  if (isExist) {
    rlQuestion.question("Do you want to overwrite the file? ", (answer) => {
      if (answer === "y") {
        writeFile(args[0], args[1]);
      }
      rlQuestion.close();
    });
  }
  rlLine.close();
};

if (!args[0] || !args[1]) {
  console.log("URL or File does not exist");
} else {
  const readStream = fs.createReadStream(args[1]);
  readStream.on("error", (error) => {
    if (error) {
      writeFile(args[0], args[1], true);
    }
  });
  readAndWriteFiles();
}
