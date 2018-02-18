import React, { Fragment } from 'react';
import { StaticRouter, Switch, Route, Link } from 'react-router-dom'
import { NeedsData, NoDataNeed } from 'react-backend'

function DataNeeds() {
  return(
    <Fragment>

      <Route exact path='/' component={ NoDataNeed } />          

      <Route path='/params' render={() => (
        <NeedsData needs="getUserId">
          <Route path='/params/account' render={() => (
            <NeedsData needs="getUser"/>
          )}/>
          <Route path='/params/profile' component={ NoDataNeed } />          
        </NeedsData>
      )}/>
      
    </Fragment>
  )
}

export default DataNeeds