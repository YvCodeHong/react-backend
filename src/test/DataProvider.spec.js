import test from 'unit.js'
import sinon, { stub, spy } from 'sinon'

import DataProvider from '../DataProvider'

describe('DataProvider component', function() {  
  
  before(() => {
  })
  after(() => { 
  })
  
  it('pushNeeds will call promises only once', function() {
    // 1- init
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2 = spy(() => Promise.resolve("need2"))
    
    // 2- test
    dataProvider.pushNeeds("need1")
    dataProvider.pushNeeds("need2")
    dataProvider.pushNeeds("need1")
    
    // 3- assert
    test.array(Object.keys(dataProvider.promises)).hasLength(2)
      .bool(dataProvider.need1.calledOnce).isTrue()
      .bool(dataProvider.need2.calledOnce).isTrue()
  })
  
  it('resolveNeeds will retrieve all the data', function(done) {
    // 1- init
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2 = spy(() => Promise.resolve("need2"))
    
    // 2- test
    dataProvider.pushNeeds("need1")
    dataProvider.pushNeeds("need2")
    dataProvider.resolveNeeds().then(function(values) {
      // 3- assert
      test.string(dataProvider.getData("need1")).is("need1")
        .string(dataProvider.getData("need2")).is("need2")
      
      // pushing needs again will resolve immediately
      dataProvider.pushNeeds("need1")
      dataProvider.pushNeeds("need2")
      dataProvider.resolveNeeds().then(function(values) {
        test.string(dataProvider.getData("need1")).is("need1")
          .string(dataProvider.getData("need2")).is("need2")
          .bool(dataProvider.hasErrors()).isFalse()
          .bool(dataProvider.need1.calledOnce).isTrue()
          .bool(dataProvider.need2.calledOnce).isTrue()
        done()
      })
    })
  })

  it('values will contain all the data', function(done) {
    // 1- init
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2 = spy(() => Promise.resolve("need2"))
    
    // 2- test
    dataProvider.pushNeeds("need1")
    dataProvider.pushNeeds("need2")
    dataProvider.resolveNeeds().then(function(values) {
      // 3- assert
      test.object(dataProvider.values).is({need1: 'need1', need2: 'need2'})
      done()
    })
  })
  
  it('at client side, window.data will initialize the values', function(done) {
    // 1- init
    global.window = { data : { need1: "preload1", need2: "preload2" } }
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2 = spy(() => Promise.resolve("need2"))
    
    // 2- test
    dataProvider.pushNeeds("need1")
    dataProvider.pushNeeds("need2")
    dataProvider.resolveNeeds().then(function(values) {
      // 3- assert
      test.object(dataProvider.values).is({need1: 'preload1', need2: 'preload2'})
        .string(dataProvider.getData("need1")).is('preload1')
        .string(dataProvider.getData("need2")).is('preload2')
        .bool(dataProvider.need1.called).isFalse()
        .bool(dataProvider.need2.called).isFalse()
      delete global.window
      done()
    })
  })
  
  it('getData and getError returns undefined if data was not needed', function(done) {
    let dataProvider = new DataProvider()
    
    // we push no need, and we resolve
    dataProvider.resolveNeeds().then(function(values) {
      test.undefined(dataProvider.getData("need1"))
        .undefined(dataProvider.getError("need1"))
        .bool(dataProvider.hasErrors()).isFalse()
      done()
    })
  })
  
  it('hasErrors will be true if some promise is rejected', function(done) {
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => new Promise(function(resolve, reject) { reject("need1-Error") }))
    
    dataProvider.pushNeeds("need1")
    dataProvider.resolveNeeds().then(function(values) {
      test.string(dataProvider.getError("need1")).is("need1-Error")
        .undefined(dataProvider.getData("need1"))
        .bool(dataProvider.hasErrors()).isTrue()
      done()
    })
  })
  
  it('a data promise will be resolved again after invalidate is called', function(done) {
    let dataProvider = new DataProvider()
    let counter = 1
    dataProvider.need1 = spy(() => Promise.resolve("need" + counter++))
    
    dataProvider.pushNeeds("need1")
    dataProvider.resolveNeeds().then(function(values) {
      test.string(dataProvider.getData("need1")).is("need1")
        .when(() => dataProvider.invalidate("need1"))
        .then(function() {
          test.undefined(dataProvider.getData("need1"))
            .undefined(dataProvider.getError("need1"))
          dataProvider.pushNeeds("need1")
          dataProvider.resolveNeeds().then(function(values) {
          test.string(dataProvider.getData("need1")).is("need2")
            .bool(dataProvider.need1.calledTwice).isTrue()
            done()
          })
        })
    })
  })
  
  it('data promises will be resolved again after invalidateAll is called', function(done) {
    let dataProvider = new DataProvider()
    let counter = 1
    dataProvider.need1 = spy(() => Promise.resolve("need" + counter++))
    
    dataProvider.pushNeeds("need1")
    dataProvider.resolveNeeds().then(function(values) {
      test.string(dataProvider.getData("need1")).is("need1")
        .when(() => dataProvider.invalidateAll())
        .then(function() {
          test.undefined(dataProvider.getData("need1"))
            .undefined(dataProvider.getError("need1"))
          dataProvider.pushNeeds("need1")
          dataProvider.resolveNeeds().then(function(values) {
          test.string(dataProvider.getData("need1")).is("need2")
            .bool(dataProvider.need1.calledTwice).isTrue()
            done()
          })
        })
    })
  })
  
  it('use "when()" to express dependencies between data', function(done) {
    let dataProvider = new DataProvider()
    dataProvider.need1 = spy(() => Promise.resolve("need1"))
    dataProvider.need2 = spy(() => 
      dataProvider.when("need1").then(() => Promise.resolve("need2"))
    )
    
    // pushing only need2 will also get need1
    dataProvider.pushNeeds("need2")
    dataProvider.resolveNeeds().then(function(values) {
      test.string(dataProvider.getData("need1")).is("need1")
        .string(dataProvider.getData("need2")).is("need2")
        .bool(dataProvider.hasErrors()).isFalse()
      done()
    })
  })
})