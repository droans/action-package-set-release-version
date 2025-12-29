export const INPUTS = [
  'prerelease',
  'prerelease-identifier',
  'push_after_setting',
  'version'
]

export interface InputResult {
  prerelease: boolean;
  'prerelease-identifier': string;
  push_after_setting: boolean;
  version: string; 
}