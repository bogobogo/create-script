const callbackExec = require("child_process").exec;
const promisify = require("util").promisify;
const exec = promisify(callbackExec);
const fs = require("fs");
const join = require("path").join;
const homedir = require("os").homedir();
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
    },
    {
      type: "list",
      name: "script_lang",
      message: "What lang do you want to write your script in?",
      choices: ["node", "bash-script"],
      filter: function(val) {
        return val.toLowerCase();
      }
    },
    {
      type: "input",
      name: "bash_script_content",
      message: "Type in your bash script:",
      when: function(answers) {
        return answers.script_lang === "bash-script";
      }
    }
  ])
  .then(async answers => {
    try {
      if (answers.script) {
        if (answers.script_lang) {
          if (answers.script_lang === "node") {
            await handleNodeScript(answers);
          } else if (answers.script_lang === "bash-script") {
            await handleBashScript(answers);
          }
          console.log("done!");
        }
      }
    } catch (e) {
      console.log("error when creating a script", e);
    }
  });

async function handleNodeScript(answers) {
  await exec(`mkdir ~/scripts/${answers.script}`);
  const { stdout: initialScriptContent } = await exec(
    "cat ~/scripts/example/initialFile.js"
  );
  await exec(`cd ~/scripts/${answers.script} && npm init -y`);
  fs.writeFile(
    join(homedir, `scripts/${answers.script}/index.js`),
    initialScriptContent,
    err => {
      console.log(err);
    }
  );
  await exec(
    `cd ~/scripts/${answers.script} && code . && npm install inquirer`
  );
  await exec(
    `echo "alias ${answers.script}='node ~/scripts/${
      answers.script
    }/index.js'" >> ~/.zshrc`
  );
}

async function handleBashScript(answers) {
  try {
    await exec(
      `echo "alias ${answers.script}='${
        answers.bash_script_content
      }'" >> ~/.zshrc`
    );
  } catch (e) {
    console.log("Error making a bash script", e);
  }
}
