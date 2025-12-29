export interface PackageJSONContents {
  version?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [str: string]: any
}

export interface Repository {
  owner: string;
  repo: string;
}

export type SemVerRevision =
  'major'
  | 'minor'
  | 'patch'
  | 'prerelease'

export interface InputResult {
  prerelease: boolean;
  'prerelease_identifier': string;
  push_after_setting: boolean;
  git_user: string,
  git_email: string,
  commit_message: string;
  version: string;
}
