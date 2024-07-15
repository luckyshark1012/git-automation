# Git Automation Script

This script automates the process of cloning a Git repository, changing the commit author, and pushing the changes to a new repository. The repository will be cloned into the parent directory of the current working directory.

## Prerequisites

- Node.js installed on your machine.
- Git installed on your machine.

## Usage

1. Clone this repository or download the `git-automation.js` script.
2. Open a terminal and navigate to the directory containing `git-automation.js`.
3. Run the script using Node.js and provide the `sourceRepo` and `targetRepo` as parameters:

   ```sh
   node git-automation.js <sourceRepo> <targetRepo>