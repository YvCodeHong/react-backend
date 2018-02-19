/**
 * Base class for your DataProvider objects.
 */
class DataProvider {
  
  /** Resolved values of the promises. Use getData() to access it */
  values = { }
  
  /** Resolved errors of the promises. Use hasErrors() and getError() to access it */
  errors = { }
  
  /** 
   * This will hold a cache of the created promise objects,
   * in the form [ string => promise object ]
   */
  promises = { }
  
  /** will be true when some data need to be fetched from the backend */
  _shouldReload = false
  
  /**
   * Constructor
   * At client side, will retrieve the preloaded data from window.data
   * so that there is no need to fetch data from backend
   * @returns {DataProvider}
   */
  constructor() {
    if (typeof window !== 'undefined' && window.data) {
      Object.keys(window.data).forEach(key => {
        let value = window.data[key]
        this.promises[key] = Promise.resolve(value)
        this.values[key] = value
      })
    }
  }
  
  /**
   * Builder and accessor function to get the promises managed by the DataProvider
   * @param {String} promiseName - name of the dataProvider function, such as "getUserComments"
   * @returns {Promise} - the associated promise
   */
  getPromise(promiseName) {
    let promise = this.promises[promiseName]
    if (! promise) {
      promise = this[promiseName]()
      this.promises[promiseName] = promise
      this._shouldReload = true
    }
    return promise
  }
  
  /**
   * Use the when() function to express dependencies between your data.
   * If several promises share the same dependency, it will be cached and
   * called only one time.
   * Example : 
   * getUserComments() { this.when("getUserId").then(id => db.fetchComments(id)) }
   */
  when = this.getPromise
  
  /**
   * This is used internall by the NeedsData component.
   * @param {String or Object} needs - can be either the name of a function of your
   * dataProvider instance, or an array of names.
   * @returns {undefined}
   */
  pushNeeds = needs => { 
    if (typeof needs === 'string') needs = [needs]
    needs.forEach(promiseFuncName => {
      this.getPromise(promiseFuncName)
    })
  }
  
  /**
   * This will resolved all the promises, and populate the values and errors fields.
   * @returns {Promise} A promise resolving all the data needs.
   */
  resolveNeeds() { 
    let self = this
    
    // we store all the promises in the resolvers array
    // in such a way that they will always resolve (never reject)
    let resolvers = [] 
    Object.values(this.promises).forEach(promise => {
      resolvers.push(promise.then(
        value => { 
          promise.value = value }, 
        error => { 
          promise.error = error }))
    })
    
    // and we resolve the array of promises
    return Promise.all(resolvers).then(
      function() {
        let values = { }
        let errors = { }
        for (var funcName of Object.keys(self.promises)) {
          let p = self.promises[funcName]
          if (p.value) values[funcName] = p.value
          if (p.error) errors[funcName] = p.error
        }
        self.values = values
        self.errors = errors
        self._shouldReload = false
      }
    )
  }

  /**
   * Will force the data to be fetched again from the backend during the next
   * UI refresh
   * @param {String or Object} needs - can be either the name of a function of your
   * dataProvider instance, or an array of names.
   * @returns {undefined}
   */
  invalidate(needs) {
    if (typeof needs === 'string') needs = [needs]
    let self = this
    needs.forEach(need => {
      delete self.promises[need]
      delete self.values[need]
      delete self.errors[need]
    })
  }
  
  /**
   * Will invalidate all the data, in order to force reload during the next UI
   * refresh
   * @returns {undefined}
   */
  invalidateAll() {
    this.promises = { }
    this.values = { }
    this.errors = { }
    this._shouldReload = false
  }
  
  /**
   * @returns {bool} - will return true when there are unresolved needs which must be
   * fetched from the backend
   */
  shouldReload() {
    return this._shouldReload
  }
  
  /**
   * Use this to get the values of the data
   * @param {String} need - the name of the dataProvider function
   * @returns {DataProvider.values} - will return undefined if there was errors
   */  
  getData = (need) => {
    return this.values[need]
  }
  
  /**
   * Use this to get the error triggered when retrieving data
   * @param {String} need - the name of the dataProvider function
   * @returns {DataProvider.errors} - will return undefined if there was no error
   */  
  getError = (need) => {
    return this.errors[need]
  }
  
  /**
   * @returns {Boolean} true if there are some errors
   */
  hasErrors = () => (Object.values(this.errors).length > 0)
}

export default DataProvider
