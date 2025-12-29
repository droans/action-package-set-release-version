import * as core from "@actions/core";
import * as github from "@actions/github";

import { INPUTS, InputResult } from "../const/const.js";

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.setFailed(`GITHUB_TOKEN env variable must be set in the action config.`)
    process.exit(1);
  }
  return token
}

export function listEnv() {
  const entries = Object.entries(process.env).sort();
  entries.forEach(
    (entry) => {
      const key = entry[0];
      const val = entry[1];
      if (key.toLowerCase() != 'github_token') {
        console.log(`${key}: ${val}`);
      }
    }
  )
}

export function getInputs(): InputResult {
  const prereleaseStr = core.getInput('prerelease');
  const pushAfterStr = core.getInput('push_after_setting');
  
  const prerelease = prereleaseStr.toLowerCase() == 'true';
  const pushAfter = pushAfterStr.toLowerCase() == 'true';
  const prereleaseId = core.getInput('prerelease_identifier');
  const ver = core.getInput('ver');


  return {
    prerelease: prerelease,
    "prerelease_identifier": prereleaseId,
    push_after_setting: pushAfter,
    version: ver
  }
}

export function getLatestRelease(prerelease: boolean) {
  const token = getGitHubToken();
  const octokit = github.getOctokit(token);

  // TODO
}

export function uploadUpdatedPackageJson(data: Record<string, any>) {
  // TODO
}