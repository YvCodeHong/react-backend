import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import { renderChildren, serverSide } from './utilities'

/**
 * Internal class to pass the serverRenderer instance 
 * to the WithData child
 * @type InjectServerRenderer
 */
class InjectServerRenderer extends Component {
  /**
   * Constructor
   * @param {type} props - must contain a serverRenderer property
   * @returns {InjectServerRenderer}
   */
  constructor(props) {
    super(props)
    
    let {serverRenderer} = this.props
    this.serverRenderer = serverRenderer
  }
  
  getChildContext() {
    let serverRenderer = this.serverRenderer
    return ({ serverRenderer })
  }
  
  render() {
    return (renderChildren(this.props))
  }
}
InjectServerRenderer.childContextTypes = {
  serverRenderer: PropTypes.object
};

/**
 * Provides a two step rendering algorythm. First step collects the data needs, 
 * and second step resolves the data and renders the DOM components.
 * @type ServerRenderer
 */
class ServerRenderer {
  
  constructor(dataProvider, components) {
    this.dataProvider = dataProvider
    this.componentTree = (
      <InjectServerRenderer serverRenderer={this}>
        {components}
      </InjectServerRenderer>
    )
  }

  /**
   * During the first step, this will be true.
   * Then it will be false, and DOM components will be rendered
   */
  renderingDataOnly = null
  
  /**
   * This function will :
   * - collect all the data needs
   * - resolve the data needs
   * - render the presentation
   * @returns {Promise} - a promise resolving to the rendered DOM tree as string
   */
  render() {
    this.renderingDataOnly = true
    
    // The first rendering will get only the data needs
    ReactDOMServer.renderToString(this.componentTree)

    this.renderingDataOnly = false
    
    // we resolve the needs and return a promise with the complete rendered tree
    let self = this
    return this.dataProvider.resolveNeeds().then(function() {
      return ReactDOMServer.renderToString(self.componentTree)
    })
  }
}

export default ServerRenderer
