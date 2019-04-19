const callbackExec = require("child_process").exec;
const promisify = require("util").promisify;
const exec = promisify(callbackExec);
const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "input",
      name: "script",
      message: "What is the script alias?",
      validate: function(value) {
        // check if dir exists
        return true;
      }
    }
  ])
  .then(async answers => {
    try {
      console.log("example ", answers.script);
    } catch (e) {
      console.log("error when creating a script", e);
    }
  });
