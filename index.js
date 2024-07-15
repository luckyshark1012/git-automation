const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Retrieve command-line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node git-automation.js <sourceRepo> <targetRepo>');
  process.exit(1);
}

const sourceRepo = args[0];
const targetRepo = args[1];
const authorName = 'luckyshark1012';
const authorEmail = 'luckyshark1012@gmail.com';
const projectName = sourceRepo.split('/').pop().replace('.git', '');

// Function to run shell commands
const runCommand = (command, successMessage, failureMessage) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`${failureMessage}: ${stderr}`);
        reject(error);
      } else {
        console.log(successMessage);
        resolve(stdout);
      }
    });
  });
};

const cloneRepo = async () => {
  try {
    // Move up one directory level
    const upOneLevel = path.resolve('..');
    process.chdir(upOneLevel);
    console.log(`Moved up to ${upOneLevel}`);

    // Clone the repository
    await runCommand(`git clone ${sourceRepo}`, 'Step 1: Repository cloned successfully', 'Step 1: Failed to clone repository');
    
    // Change directory to the cloned project
    process.chdir(projectName);
    console.log(`Step 2: Changed directory to ${projectName}`);
  } catch (error) {
    console.error('Process terminated due to error.');
    process.exit(1);
  }
};

const updateRemote = async () => {
  try {
    await runCommand('git remote remove origin', 'Step 3: Removed origin successfully', 'Step 3: Failed to remove origin');
    await runCommand(`git remote add origin ${targetRepo}`, 'Step 4: Added new origin successfully', 'Step 4: Failed to add new origin');
    await runCommand(`git remote set-url origin ${targetRepo}`, 'Step 5: Set URL for origin successfully', 'Step 5: Failed to set URL for origin');
  } catch (error) {
    console.error('Process terminated due to error.');
    process.exit(1);
  }
};

const rewriteAuthor = async () => {
  try {
    const filterBranchCommand = `git filter-branch -f --env-filter "GIT_AUTHOR_NAME='${authorName}'; GIT_AUTHOR_EMAIL='${authorEmail}'; GIT_COMMITTER_NAME='${authorName}'; GIT_COMMITTER_EMAIL='${authorEmail}';"`;
    await runCommand(filterBranchCommand, 'Step 6: Rewritten commit author successfully', 'Step 6: Failed to rewrite commit author');
  } catch (error) {
    console.error('Process terminated due to error.');
    process.exit(1);
  }
};

const changeBranchAndPush = async () => {
  try {
    await runCommand('git branch -M main', 'Step 7: Branch name changed to main successfully', 'Step 7: Failed to change branch name to main');
    await runCommand('git push --set-upstream origin main', 'Step 8: Pushed to main branch successfully', 'Step 8: Failed to push to main branch');
  } catch (error) {
    console.error('Process terminated due to error.');
    process.exit(1);
  }
};

const main = async () => {
  await cloneRepo();
  await updateRemote();
  await rewriteAuthor();
  await changeBranchAndPush();
  console.log('All steps completed successfully.');
};

main();