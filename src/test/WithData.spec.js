import test from 'unit.js'
import sinon, { stub, spy } from 'sinon'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import WithData from '../WithData'

describe('WithData component', function() {  
  let dataProvider = null
  
  before(() => {
    // we catch console.error to trigger Errors
    stub(console, 'error').callsFake((warning) => { throw new Error(warning) })
  })
  after(() => { 
    console.error.restore() 
  })
  
  beforeEach(() => {
    // we stub the dataprovider
    dataProvider = { }
    dataProvider.pushNeeds = stub()
    dataProvider.resolveNeeds = spy(() => Promise.resolve({ }))
    dataProvider.getUserId = stub().resolves(1)
    dataProvider.getProductId = stub().resolves(2)
  })
  
  it('"dataProvider" prop is required', function() {
    let rendered = function() {
      ReactDOMServer.renderToString((
        <WithData />
      ))
    }
    test.error(rendered)
  })
  
  it('provides a "dataProvider" context', function() {
    let childContextDataProvider = null
    let Child = (props, context) => { childContextDataProvider = context.dataProvider; return null }
    Child.contextTypes = {dataProvider: PropTypes.object};
    Child = sinon.spy(Child)
    let context = {}
    ReactDOMServer.renderToString((
      <StaticRouter context={context}>
        <WithData dataProvider={dataProvider}>
          <Child/>
        </WithData>
      </StaticRouter>
    ))
    
    test.bool(Child.called).isTrue()
      .object(childContextDataProvider)
  })
  
  it('at server side, renders its children immediately ', function() {
    let Child = () => null
    Child = sinon.spy(Child)
    let context = {}
    ReactDOMServer.renderToString((
      <StaticRouter context={context}>
        <WithData dataProvider={dataProvider}>
          <Child/>
          <Child/>
        </WithData>
      </StaticRouter>
    ))
    
    test.bool(Child.calledTwice).isTrue()
  })
  
  it('SCU will return false when loading data', function() {
    let wd = new WithData({dataProvider})
    dataProvider.shouldReload = stub().returns(true)
    test.bool(wd.shouldComponentUpdate()).isFalse()
  })
  
  it('dataProvider.resolveNeeds will be called', function() {
    let wd = new WithData({dataProvider})
    dataProvider.shouldReload = stub().returns(true)
      
    test.when(() => wd.shouldComponentUpdate())
      .bool(dataProvider.resolveNeeds.called).isTrue()
  })
  
})