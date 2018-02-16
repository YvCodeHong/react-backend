import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types';

/**
 * This is a HOC which will inject the dataProvider instance into the props
 * of the wrapped component
 * @param {React.Component} Wrapped - the wrapped component
 * @returns {withDataProvider}
 */
function withDataProvider(Wrapped) {
  class WDP extends Component {
    render() {
      let {dataProvider} = this.context
      let newProps = Object.assign({ }, {dataProvider}, this.props)
      return (<Wrapped {...newProps}/>)
    }
  }
  let wrappedName = Wrapped.displayName || Wrapped.name || 'Component'
  WDP.displayName = 'withDataProvider(' + wrappedName + ')';
  WDP.contextTypes = {
    dataProvider: PropTypes.object
  }
  return WDP
}

export default withDataProvider
