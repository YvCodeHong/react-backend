import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { ProviderRules, WithData } from 'react-backend'
import ClientDataProvider from './ClientDataProvider'
import DataNeeds from '../common/DataNeeds'
import App from '../common/App'

let dataProvider = new ClientDataProvider()
  
ReactDOM.render((
  <BrowserRouter>
    <Fragment>
      <ProviderRules dataProvider={dataProvider}>
        <DataNeeds/>
      </ProviderRules>
      <WithData dataProvider={dataProvider}>
        <App/>
      </WithData>  
    </Fragment>
  </BrowserRouter>
), document.getElementById('root'))
