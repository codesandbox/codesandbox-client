export function isContributor(username: string) {
  return (
    this.contributors.find(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1
  );
}
