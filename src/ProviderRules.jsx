import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom'

import { renderChildren, serverSide } from './utilities'

/**
 * Use the ProviderRules component along with NeedsData components
 * in order to express how to retrieve data from the backend
 */
class ProviderRules extends Component {
  /**
   * Constructor
   * @param {Object} props - must contain a dataProvider property
   * @returns {ProviderRules}
   */
  constructor(props) {
    super(props)
    
    let {dataProvider} = this.props
    this.dataProvider = dataProvider
  }
  
  getChildContext() {
    let dataProvider = this.dataProvider
    return ({ dataProvider })
  }
  
  render() {
    return renderChildren(this.props) 
  }
}
ProviderRules.propTypes = {
  dataProvider: PropTypes.object.isRequired
} 
ProviderRules.childContextTypes = {
  dataProvider: PropTypes.object
};

export default ProviderRules
