import test from 'unit.js'
import sinon, { stub, spy } from 'sinon'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types';

import ProviderRules from '../ProviderRules'

describe('ProviderRules component', function() {  
  let dataProvider = { }
  
  before(() => {
    // we catch console.error to trigger Errors
    stub(console, 'error').callsFake((warning) => { throw new Error(warning) })
  })
  after(() => { 
    console.error.restore() 
  })
  
  it('"dataProvider" prop is required', function() {
    let rendered = function() {
      ReactDOMServer.renderToString((
        <ProviderRules />
      ))
    }
    test.error(rendered)
  })

  it('renders its children', function() {
    let Child = (props) => (<div>{props.children}</div>)
    Child = sinon.spy(Child)
    
    ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <Child>
          <Child/>
        </Child>
      </ProviderRules>
    ))
    
    test.number(Child.callCount).is(2)
  })

  it('provides a "dataProvider" context', function() {
    let childContextDataProvider = null
    let Child = (props, context) => { childContextDataProvider = context.dataProvider; return null }
    Child.contextTypes = {dataProvider: PropTypes.object};
    Child = sinon.spy(Child)
    
    ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <Child/>
      </ProviderRules>
    ))
    
    test.bool(Child.called).isTrue()
      .object(childContextDataProvider)
  })
})