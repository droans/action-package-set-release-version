import * as core from "@actions/core";
import * as github from "@actions/github";

import { InputResult } from "../const/types.js";
import { Repository } from "../const/types.js";
import { execWithCallback } from "./utils.js";

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.setFailed(`GITHUB_TOKEN env variable must be set in the action config.`)
    process.exit(1);
  }
  return token
}

export function getRepository(): Repository {
  const repoPath = process.env.GITHUB_REPOSITORY;
  if (!repoPath) {
    core.setFailed(`Could not get repo path from env variables!`)
    process.exit(1);
  }
  const [owner, repo] = repoPath?.split('/');
  return {
    owner: owner,
    repo: repo
  }
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

export function parseGitUserEmail(git_user: string, git_email: string) {
  if (!git_user?.length) {
    git_user = 'github-actions-package-set-release-version[bot]'
  }
  if (!git_email?.length) {
    git_email = 'github-actions-package-set-release-version[bot]@users.noreply.github.com'
  }
  return [git_user, git_email];
}

export async function getLatestRelease() {
  const octokit = getOktokit();
  const repoData = getRepository();
  const owner = repoData.owner;
  const repo = repoData.repo
  return await octokit.rest.repos.getLatestRelease({owner, repo});
}

export async function getLatestReleaseTag() {
  const release = await getLatestRelease();
  return release.data.tag_name;
}

export function uploadUpdatedPackageJson() {
  // TODO
  const inputs = getInputs();
  const msg = inputs.commit_message;
  const ghUser = inputs.git_user;
  const ghEmail = inputs.git_email;
  core.debug(`Setting GH User to ${ghUser}`);
  core.debug(`Setting GH Email to ${ghEmail}`);
  core.debug(`Setting commit message to ${msg}`);
  execWithCallback(`"git" config --local user.email "${ghEmail}"`);
  execWithCallback(`"git" config --local user.name "${ghUser}"`);
  execWithCallback(`"git" add package.json`);
  execWithCallback(`"git" commit -m ${msg}`);
  execWithCallback(`"git" push`);
  core.info(`Pushed updated package.json`)
}

function getOktokit() {
  const token = getGitHubToken();
  return github.getOctokit(token);
}