import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { renderChildren } from './utilities'

/**
 * Use this React component in your component tree to express data needs.
 */
class NeedsData extends Component {
  constructor(props, context) {
    super(props, context)
    let {needs} = props
    let {dataProvider} = context
    dataProvider.pushNeeds(needs)
  }
  
  render = () => renderChildren(this.props)
}
NeedsData.propTypes = {
  needs: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array]).isRequired
} 
NeedsData.contextTypes = {
  dataProvider: PropTypes.object
}

export default NeedsData
