/**
 * Very simple react server side rendering
 */
import React, { Fragment } from 'react';
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import path from 'path'

import { ProviderRules, WithData } from '../../'
import ServerDataProvider from './ServerDataProvider'
import ServerRenderer from '../../ServerRenderer'

import DataNeeds from '../common/DataNeeds'
import App from '../common/App'
import Template from './template';
import {public_js_dir} from '../config/config'

function Server(req, res, next) {
  
  const context = {}
  const serverProvider = new ServerDataProvider()

  new ServerRenderer(serverProvider, 
    (<StaticRouter location={ req.url } context={ context }>
      <Fragment>
        <ProviderRules dataProvider={serverProvider}>
          <DataNeeds/>
        </ProviderRules>
        <WithData dataProvider={serverProvider}>
          <App/>
        </WithData>  
      </Fragment>
    </StaticRouter>)
  )
  .render()
  .then(markup => {
    let data = serverProvider.values
    res.status(200).send(Template({data, markup}))
  })
  .catch (function (error) {
    console.log("There was a problem : ", error)
  })
}

const app = express()
app.use('/js', express.static('dist/public/js'));
app.use(Server)
app.listen(3000)
console.log("App is now listening to port HTTP 3000.")