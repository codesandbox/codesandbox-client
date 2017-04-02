export default function getJwt() {
  return (document.cookie.match(/[; ]?jwt=([^\s;]*)/) || [])[1];
}
