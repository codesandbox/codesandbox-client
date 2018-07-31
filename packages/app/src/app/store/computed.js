export function isContributor(username: string) {
  return (
    this.contributors.findIndex(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1
  );
}
