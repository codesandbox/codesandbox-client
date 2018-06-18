export function isContributor(username: string) {
  return this.contributors.indexOf(username) > -1;
}
