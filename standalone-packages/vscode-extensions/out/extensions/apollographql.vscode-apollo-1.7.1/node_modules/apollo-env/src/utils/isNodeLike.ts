export const isNodeLike =
  typeof process === "object" &&
  process &&
  process.release &&
  process.versions &&
  typeof process.versions.node === "string";
