import { SemVer } from "semver";
import { SemVerRevision } from "../const/types.js";
import { getInputs, getLatestReleaseTag } from "./github.js";
import { execWithCallback } from "./utils.js";

export async function getNewVersion(
  revision: SemVerRevision = 'minor'
): Promise<string> {
  const inputs = getInputs();
  const prereleaseIdentifier = inputs.prerelease_identifier;
  const setVer = inputs.version;
  if (setVer.length) {
    return setVer;
  }
  const priorRelease = await getLatestReleaseTag();
  const ver = new SemVer(priorRelease)
  const newVer = ver.inc(revision, prereleaseIdentifier);
  return newVer.raw;
}

export async function updateReleaseVersion(newVer: string) {
  await execWithCallback(`npm version '${newVer} --git-tag-version false`);
  return;
}