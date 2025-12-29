import * as core from "@actions/core";
import * as fs from 'fs';
import * as path from 'path';
import { PackageJSONContents } from "../const/types";

function getPackageFile(): string {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      core.setFailed('package.json file not found!')
      process.exit(1)
    }
    return packagePath;
  } catch (e) {
    core.setFailed(`Error getting package file: ${e}`);
    process.exit(1);
  }
}

function getAndOpenPackageFile(): PackageJSONContents {
  const fpath = getPackageFile();
  return JSON.parse(fs.readFileSync(fpath, 'utf-8'));
}

export function getCurrentVersion() {
  const js = getAndOpenPackageFile();
  const ver = js?.version;
  if (!ver) {
    core.setFailed(`Version not found in package.json contents!`);
    process.exit(1);
  }
  return js.version;
}
