import test from 'unit.js'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import NoDataNeed from '../NoDataNeed'

describe('NoDataNeed component', function() {
  it("will render a null element", function() {
    let rendered = ReactDOMServer.renderToString((<NoDataNeed/>))
    test.string(rendered).is('')
  })
})