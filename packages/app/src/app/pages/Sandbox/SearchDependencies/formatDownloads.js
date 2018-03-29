export default function formatDownloads(downloads) {
  if (downloads >= 1000000) {
    const x = Math.floor(downloads / 100000);
    const millions = x / 10;
    return millions + 'M';
  }
  if (downloads >= 1000) {
    const x = Math.floor(downloads / 100);
    const thousands = x / 10;
    return thousands + 'K';
  }
  return downloads.toString();
}
