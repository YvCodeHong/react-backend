import React, { Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom'

import { withDataProvider } from '../../'

const HomePage = withDataProvider(props => {
  return (
    <div>
    <h1>Home Page</h1>
    <p>There is no data associated to this route</p>
    </div>
  )
})

const ParamsPage = withDataProvider(props => {
  return (
    <div>
    <h1>Params Page</h1>
    <p>We can read getUserId from the dataprovider : {props.dataProvider.getData('getUserId')}</p>
    </div>
  )
})

const AccountPage = withDataProvider(props => {
  return (
    <div>
    <h1>Account Page</h1>
    <p>We can read getUser from the dataprovider : {JSON.stringify(props.dataProvider.getData('getUser'))}</p>
    <p>As well as getUserId : {props.dataProvider.getData('getUserId')}</p>
    </div>
  )
})

const ProfilePage = withDataProvider(props => {
  return (
    <div>
    <h1>Profile Page</h1>
    <p>We can only read getUserId from the dataprovider : {props.dataProvider.getData('getUserId')}</p>
    </div>
  )
})

class App extends React.Component {

  render() {
    return (
      <div>
      <Link to="/">Home</Link><br/>
      <Link to="/params">Params</Link><br/>
      <Link to="/params/account">Account</Link><br/>
      <Link to="/params/profile">Profile</Link><br/>
      
      <Switch>
        <Route exact path='/' component={ HomePage } />          
        <Route exact path='/params' component={ ParamsPage }/>
        <Route path='/params/account' component={ AccountPage }/>
        <Route path='/params/profile' component={ ProfilePage }/>  
      </Switch>
      </div>
    );
  }
}

export default App