import * as core from "@actions/core";
import { exec } from '@actions/exec';

export async function execWithCallback(cmd: string) {
  core.debug(`Executing ${cmd}`);
  let stdOut = '';
  let stdErr = '';
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        stdOut += data.toString();
      },
      stderr: (data: Buffer) => {
        stdErr += data.toString();
      },
    }
  }
  
  await exec(cmd, [], options)
  if (stdOut.length) {
    core.debug(stdOut);
  }
  if (stdErr.length) {
    core.debug(stdErr)
  }
}