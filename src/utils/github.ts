import * as core from "@actions/core";
import * as github from "@actions/github";

import { InputResult } from "../const/types.js";

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.setFailed(`GITHUB_TOKEN env variable must be set in the action config.`)
    process.exit(1);
  }
  return token
}


export function getInputs(): InputResult {
  const prereleaseStr = core.getInput('prerelease');
  const pushAfterStr = core.getInput('push_after_setting');
  
  const prerelease = prereleaseStr.toLowerCase() == 'true';
  const pushAfter = pushAfterStr.toLowerCase() == 'true';
  const prereleaseId = core.getInput('prerelease_identifier');
  const commitMessage = core.getInput('commit_message');
  const gitUserUnparsed = core.getInput('git_user');
  const gitEmailUnparsed = core.getInput('git_email');
  const [gitUser, gitEmail] = parseGitUserEmail(gitUserUnparsed, gitEmailUnparsed);
  const ver = core.getInput('ver');
  return {
    prerelease: prerelease,
    "prerelease_identifier": prereleaseId,
    push_after_setting: pushAfter,
    commit_message: commitMessage,
    git_user: gitUser,
    git_email: gitEmail,
    version: ver
  }
}

export async function getLatestRelease() {
  const octokit = getOktokit();
}
  // TODO
function getOktokit() {
  const token = getGitHubToken();
  return github.getOctokit(token);
}