import * as core from "@actions/core";
import { exec } from "node:child_process";


export function execWithCallback(cmd: string) {
  core.debug(`Executing ${cmd}`);
  exec(cmd,
    (error, stdout, stderr) => {
      if (error) {
        core.error(`Received error:`);
        core.error(error);
      }
      if (stderr) {
        core.error(`Received error:`);
        core.error(stderr);
      }
      if (stdout) {
        core.debug(stdout);
      }
    }
  );
}
