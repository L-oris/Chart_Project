import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory,Router,Route,IndexRoute} from 'react-router'

//React Components
import App from './components/App'

//Redux
import {createStore,applyMiddleware} from 'redux'
import reduxPromise from 'redux-promise'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'
import reducer from './reducer'

const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxPromise)))

//client-side routing for logged-in users
const router = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}></Route>
    </Router>
  </Provider>
)

ReactDOM.render(
  router,
  document.querySelector('main')
)
