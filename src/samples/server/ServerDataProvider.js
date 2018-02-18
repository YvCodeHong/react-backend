import DataProvider from 'react-backend'

class ServerDataProvider extends DataProvider {
  
  getUserId() {
    // in a real application, you should get the user id from the session data
    // here we just hardcode the value 1 for the example
    return Promise.resolve(1)
  }

  getUser() { 
    // getUser() depends on "getUserId", so we use "when-then"
    return this.when("getUserId").then(
      // from the user id we get the user data
      // you could call your database here
      id => Promise.resolve({
        userId : id,
        userName: "Paul Dupond", 
        userAddress: "1 rue des Champs-Elysées, Paris"})
    )
  }
}

export default ServerDataProvider
