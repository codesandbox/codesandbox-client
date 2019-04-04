export default function delay(timeout = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
