import * as core from "@actions/core";
import * as semver from 'semver';
import { getInputs, getLatestReleaseTag, uploadUpdatedPackageJson } from './utils/github.js';
import { getNewVersion, updateReleaseVersion } from './utils/version.js';

async function main() {
  const inputs = getInputs();
  const ver = inputs.version;
  if (ver.length) {
    await updateReleaseVersion(ver);
  } else {
    const priorTag = await getLatestReleaseTag();
    if (!semver.valid(priorTag)) {
      core.setFailed(`Previous version ${priorTag} is not valid!`);
    }
    const newTag = await getNewVersion();
    await updateReleaseVersion(newTag);
    core.info(`Set new version as ${newTag}`)
  }
  if (inputs.push_after_setting) {
    await uploadUpdatedPackageJson();
  }

}

await main()