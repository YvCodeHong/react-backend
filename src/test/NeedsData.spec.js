import test from 'unit.js'
import sinon, { stub, spy } from 'sinon'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import NeedsData from '../NeedsData'
import ProviderRules from '../ProviderRules'

describe('NeedsData component', function() {  
  let dataProvider = null
  
  before(() => {
    // we catch console.error to trigger Errors
    stub(console, 'error').callsFake((warning) => { throw new Error(warning) })
    
    // we stub the dataprovider
    dataProvider = { }
    dataProvider.pushNeeds = stub()
    dataProvider.getUserId = stub().resolves(1)
    dataProvider.getProductId = stub().resolves(2)
  })
  after(() => { 
    console.error.restore() 
  })
  
  it('"needs" prop is required', function() {
    let rendered = function() {
      ReactDOMServer.renderToString((
        <NeedsData />
      ))
    }
    test.error(rendered)
  })

  it('ProviderRules must be at a higher level in the tree', function() {
    let rendered = function() {
      ReactDOMServer.renderToString((
        <NeedsData needs="getUserId"/>
      ))
    }
    test.error(rendered)
  })
  
  it('"needs" prop can be a string', function() {
    let rendered = ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <NeedsData needs="getUserId"/>
      </ProviderRules>
    ))
    test.string(rendered)
  })

  it('"needs" prop can be an array', function() {
    let rendered = ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <NeedsData needs={ [ "getUserId", "getProductId" ] }/>
      </ProviderRules>
    ))
    test.string(rendered)
  })

  it('renders its children', function() {
    let Child = (props) => (<div>{props.children}</div>)
    Child = sinon.spy(Child)
    
    ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <NeedsData needs="getUserId">
        <Child>
          <Child/>
        </Child>
        </NeedsData>
      </ProviderRules>
    ))
    
    test.number(Child.callCount).is(2)
  })

  it('will push needs into dataProvider', function() {
    dataProvider.pushNeeds = sinon.spy()
    
    ReactDOMServer.renderToString((
      <ProviderRules dataProvider={dataProvider}>
        <NeedsData needs={ [ "getUserId", "getProductId" ] }/>
        <NeedsData needs="getUserId"/>
      </ProviderRules>
    ))
  
    test.number(dataProvider.pushNeeds.callCount).is(2)
      .bool(dataProvider.pushNeeds.calledWith("getUserId")).isTrue()
      .bool(dataProvider.pushNeeds.calledWith([ "getUserId", "getProductId" ])).isTrue()
  })
  
  
})