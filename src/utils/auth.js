import Cookies from 'js-cookie'

const TokenKey = 'dls-Token'

export function getToken() {
 
  return Cookies.get(TokenKey)
}
export const getTokenItem = (item = '') => {
  const token = Cookies.get(TokenKey) || ''
  const info = JSON.parse(decodeURI(window.atob(token.split('.')[1])))
  return info[item]
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
