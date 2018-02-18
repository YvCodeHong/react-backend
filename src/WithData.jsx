import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom'

import { renderChildren, serverSide } from './utilities'
import ProviderRules from './ProviderRules'

// These are the three interal states of the ProviderData component
const DONE = 0
const LOADING = 1
const LOADED = 2

/**
 * Use this WithData component to wrap all your React components
 * that need access to data from the dataProvider
 */
class WithData extends ProviderRules {

  loadState = DONE

  /**
   * Constructor
   * @param {Object} props - must contain the dataProvider instance property
   * @param {Object} context - will receive an optional context when rendering 
   * at server side
   * @returns {ProviderData}
   */
  constructor(props, context) {
    super(props)
    if (context && context.serverRenderer) {
      this.serverRenderer = context.serverRenderer
    }
  }
  
  /**
   * This component will wait until all the data from the backend are ready (or in error)
   * and then will update the component tree.
   * @returns {Boolean}
   */
  shouldComponentUpdate() {
    if (this.loadState === LOADING) return false
    if (this.loadState === LOADED) {
      this.loadState = DONE
      return true
    }
    
    let shouldReload = this.dataProvider.shouldReload()
    
    if (shouldReload) {
      this.loadState = LOADING
      let self = this
      this.dataProvider.resolveNeeds().then(function() {
        self.loadState = LOADED
        self.forceUpdate()
      })
      return false
    }
    else return true
  }
  
  render() {
    if (this.serverRenderer && this.serverRenderer.renderingDataOnly) return null
    else return renderChildren(this.props)
  }
}
WithData.contextTypes = {
  serverRenderer: PropTypes.object // optional
}

export default WithData
