const favesKey = 'faves'

const saveFaveIds = faveIds => {
  if (faveIds.length > 0) {
    localStorage.setItem(favesKey, JSON.stringify(faveIds))
  } else {
    localStorage.removeItem(favesKey)
  }
}

const getFaveIds = () => {
  if (typeof localStorage === 'undefined') {
    return []
  }
  const data = localStorage.getItem(favesKey)
  if (data == null) {
    return []
  }
  return JSON.parse(data)
}

export { saveFaveIds, getFaveIds }
