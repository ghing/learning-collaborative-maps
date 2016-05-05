export function agencyIdFromUrl(url) {
  let agencyBits = url.split('/');
  return agencyBits[agencyBits.length - 1];
}
