export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let href = window.location.href
  let r = href.substr(href.indexOf('?') + 1).match(reg)
  if (r != null) return decodeURI(r[2])
  return false
}
