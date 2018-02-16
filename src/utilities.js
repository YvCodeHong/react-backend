/**
 * Utility method to render only the children 
 * @param {type} props
 * @returns the rendered children components
 */
function renderChildren(props) {
  if (props.children) 
    return (props.children)
  else
    return null
}

/**
 * Utility method to determine if the current route contains "reload" in the 
 * query string
 * @param {Object} location - current route location
 * @returns {Boolean} - true if the query string contains "reload"
 */
function containsReload(location) {
  return Boolean(location.search && location.search.match(/reload/))
}

/**
 * Utility method to remove the "reload" part from the query string
 * @param {Object} location - current route location
 * @returns {Object} - new location object without "reload" query string param
 */
function withoutReload(location) {
  let newLocation = Object.assign({ }, location)
  if (newLocation.search) {
    newLocation.search = newLocation.search.replace('reload', '')
  }
  return newLocation
}

/**
 * @returns {Boolean} True if the code is running at the server side
 */
function serverSide() {
  return (typeof(window) === 'undefined')
}

export { renderChildren, containsReload, withoutReload, serverSide }