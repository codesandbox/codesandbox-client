export default function(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return `${count}`;
}
