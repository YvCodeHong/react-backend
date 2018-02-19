import React, { Fragment } from 'react'
import { StaticRouter } from 'react-router-dom'

import test from 'unit.js'
import sinon, { stub, spy } from 'sinon'

import DataProvider from '../DataProvider'
import NeedsData from '../NeedsData'
import ProviderRules from '../ProviderRules'
import WithData from '../WithData'
import withDataProvider from '../withDataProvider'
import ServerRenderer from '../ServerRenderer'

describe('ServerRenderer component', function() {  
  let dataProvider = null
  let app = null
  let render = null
  let renderPresentation = null
  
  /** initialize all the local vars */
  beforeEach(() => {
    dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2Failed = spy(() => Promise.reject("need2Failed"))
    spy(dataProvider, 'getData')
    spy(dataProvider, 'resolveNeeds')
    
    renderPresentation = ({dataProvider}) => (
      <div><span>Need1 is {dataProvider.getData('need1')}</span>
      <span>Need2 is {dataProvider.getError('need2Failed')}</span></div>)
    renderPresentation = spy(renderPresentation)
    const Presentation = withDataProvider(renderPresentation)
    
    app = (
      <StaticRouter location='http://localhost/' context={{}}>
      <Fragment>
        <ProviderRules dataProvider={dataProvider}>
          <NeedsData needs="need1"/>
          <NeedsData needs="need2Failed"/>
        </ProviderRules>
        <WithData dataProvider={dataProvider}>
          <Presentation/>
        </WithData>
      </Fragment>
      </StaticRouter>
    )
  
    render = new ServerRenderer(dataProvider, app)
  })
  afterEach(() => { 
  })
  
  it('will collect data needs', function(done) {
    render.render().then(function() {
      test.bool(dataProvider.need1.calledOnce).isTrue()
      test.bool(dataProvider.need2Failed.calledOnce).isTrue()
      done()
    }).catch(function() {
      test.undefined("Test should not come here")
    })
  })
  
  it('will resolve data', function(done) {
    render.render().then(function(markup) {
      test
        .bool(dataProvider.resolveNeeds.calledOnce).isTrue()
        .bool(dataProvider.getData.calledOnce).isTrue()
      done()
    }).catch(function() {
      test.undefined("Test should not come here")
    })
  })
    
  it('will render the presentation only once', function(done) {
    render.render().then(function(markup) {
      test
        .bool(renderPresentation.calledOnce).isTrue()
        .string(markup).contains('need1')
        .string(markup).contains('need2Failed')
      done()
    }).catch(function() {
      test.undefined("Test should not come here")
    })
  })
  
  it('will provide errors', function(done) {
    render.render().then(function(markup) {
      test
        .bool(dataProvider.hasErrors()).isTrue()
        .string(markup).contains('need2Failed')
      done()
    }).catch(function() {
      test.undefined("Test should not come here")
    })
  })
})