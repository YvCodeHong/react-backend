# react-backend
A framework which help fetch data from backends and provide them to 
[React](https://reactjs.org/) components.

## Motivations

React.js doesn't provide any core feature to interface with a database back-end 
nor with a REST API. At [Hextrakt](https://www.hextrakt.com/), we wanted a simple (and beautiful) solution, and didnt' want to learn a new language such as [GraphQL/Relay](https://facebook.github.io/relay/).  
[Redux](https://redux.js.org/) provides the frame to manage UI state, and respond to user actions, but doesn't help on the server side, where initial state is immutable.  
So we built this framework to :
* be able to render a complete DOM tree at the server side
* be able to specify which data are needed at each application path
* write code in a declarative way, in a "react-like" way, leveraging React Router API v4
* provide data at the server side as well as at the client side
* provide preloaded data (in a javascript variable) to initialize client side components

## Requirements

There is no specific requirement to use this framework. It is written in ES6, but the package is translated using Babel into plain javascript so that everybody might "require" it. You just need to use React Router API v4.

## Installation

To use the framework
```js
yarn add react-backend 
```
or 
```js
npm install react-backend
```

To test it, first clone the [Git repository](https://github.com/Hextrakt/react-backend). Then, run

```js
yarn install
yarn build
yarn test
```

To run the samples, do the three steps above, then
```js
cd src/samples
yarn install
yarn build-samples
yarn start-samples
```
and navigate to [http://localhost:3000](http://localhost:3000)

## Features and usage

Use the `NeedsData` component to **declare the application data needs**.
Example 1. Tell that *getUserInfo* is needed when navigating to `/user` :

```jsx
<Route path='/user' render={() => (
  <NeedsData needs="getUserInfo"/>
  )}/>
</Route>
```

Data **needs are additive**.
Example 2. Tell that both "getUserInfo" and "getUserProfile" are needed when navigating to `/user/profile`:
```jsx
<Route path='/user' render={() => (
  <NeedsData needs="getUserInfo">
)}/>
<Route path='/user/profile' render={() => (
  <NeedsData needs="getUserProfile"/>
)}/>
```

Data needs **can be nested**.
Example 3. This is the same as example 2, but written in a nested way:

```jsx
<Route path='/user' render={() => (
  <NeedsData needs="getUserInfo">
    <Route path='/user/profile' render={() => (
      <NeedsData needs="getUserProfile"/>
    )}/>
  </NeedsData>
  )}/>
</Route>
```

Write a `DataProvider` class to **resolve the needs** into Promise objects.
Your DataProvider might fetch data from the session, from the database, or from
REST services.

```js
class MyDataProvider extends DataProvider {
  getUserInfo() {
    return database.loadUserInfo(userId) // should return a Promise
  }
  getUserProfile() {
    return database.loadUserProfile(userId) // should return a Promise
  }
}
```

You can have a different DataProvider at the server side (to load data from database) and at the client side (to load data from REST services).

You can **declare dependencies** between your data using the `DataProvider.when()` function. For instance, if *getUserInfo* needs the session user id, you can write this in your DataProvider class:

```js
getUserInfo() {
  return when("getUserId").then(id => return database.loadUserInfo(id))
}
getUserId() {
  return Promise.resolve(session.getCurrentUserId()) // depending on your session implementation
}
```

Needs are **resolved once** and cached. If several needs share the same base need, the shared need will be loaded only one time. Use the `DataProvider.invalidate(someNeed)` function to tell the dataprovider that *someNeed* should be **reloaded at the next UI refresh**.

Wrap all your data needs with a `ProviderRules` component, and give it the dataProvider instance:

```jsx
<ProviderRules dataProvider={myDataProvider}>
  <Route path='/user' render={() => (
    <NeedsData needs="getUserInfo"/>
  )}/>
</ProviderRules>
```

The ProviderRules component will be responsible to collect all the data needs which are declared in its subtree.

Place all your **presentational components** within a `WithData` component. This will have two benefits:

* First, your presentation will not be rendered until the data needs are resolved
* Secondly, you can access the dataProvider instance, either from the React context or from the *dataProvider* prop when using the `withDataProvider` [HOC](https://reactjs.org/docs/higher-order-components.html).

Use either `DataProvider.getData()`, `DataProvider.getError()`, `DataProvider.hasErrors()` within your presentational componenents to access the resolved data or errors.

```jsx
<WithData dataProvider={dataProvider}>
  <UserForm/>
</WithData>
```

```js
class _UserForm extends React.Component {
  render() {
    const {dataProvider} = this.props
    if (!dataProvider.hasErrors()) {
      const userInfo = dataProvider.getData("getUserInfo")
      // add here your rendering logic
    }
    else if (dataProvider.getError("getUserInfo")) {
      // show specific error
    }
  }
}
const UserForm = withDataProvider(_UserForm)
```

In order to **render the complete DOM tree at the server side**, you can use the `ServerRenderer` class, this way:

```jsx
const context = {}
const myDataProvider = new MyDataProvider()

new ServerRenderer(serverProvider, 
  (<StaticRouter location={ req.url } context={ context }>
    <Fragment>
      <ProviderRules dataProvider={myDataProvider}>
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
```

The `Template` function can look like this (a bit simplified):

```js
export default ({ data, markup }) => {
    return `<!doctype html>
    <html>
    <head>
      <script>var data = ${JSON.stringify(data)}</script>
    </head>
    <body>
      <div id="root">${markup}</div>
      <script src="/js/client.js" async></script>
    </body>
    </html>`
}
```

## Samples

You can fin all the sample code in the [samples](https://github.com/Hextrakt/react-backend/tree/master/src/samples) 
directory of the [react-backend git repository](https://github.com/Hextrakt/react-backend).

* How to declare your data needs: [DataNeeds.jsx](https://github.com/Hextrakt/react-backend/blob/master/src/samples/common/DataNeeds.jsx)
* Write your server data provider: [ServerDataProvider.js](https://github.com/Hextrakt/react-backend/blob/master/src/samples/server/ServerDataProvider.js)
* Write your client data provider: [ClientDataProvider.js](https://github.com/Hextrakt/react-backend/blob/master/src/samples/client/ClientDataProvider.js)
* Write your react application: [App.jsx](https://github.com/Hextrakt/react-backend/blob/master/src/samples/common/App.jsx)
* Write your client bundle: [Client.jsx](https://github.com/Hextrakt/react-backend/blob/master/src/samples/client/Client.jsx)
* Write your server handler: [Server.jsx](https://github.com/Hextrakt/react-backend/blob/master/src/samples/server/Server.jsx)
