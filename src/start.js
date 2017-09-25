import React from 'react'
import ReactDOM from 'react-dom'
import {hashHistory,browserHistory,Router,Route,IndexRoute} from 'react-router'

//React Components
import {
  App,
  Welcome,
  Registration,
  Login,
  ChartCreator,
  Latest,
  ChartVisualizer,
  TableVisualizer,
  ProfileManager
} from './components'

//Redux
import {createStore,applyMiddleware} from 'redux'
import reduxPromise from 'redux-promise'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'
import reducer from './reducer'

export const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxPromise)))

//client-side routing for non-registered users
const welcomeRouter = (
  <Router history={hashHistory}>
    <Route path="/" component={Welcome}>
      <IndexRoute component={Registration}/>
      <Route path="login" component={Login}/>
    </Route>
  </Router>
)

//client-side routing for logged-in users
const loggedInRouter = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Latest}/>
        <Route path='chart/:id' component={ChartVisualizer}/>
        <Route path='chart_creator' component={ChartCreator}/>
        <Route path='tables' component={TableVisualizer}/>
        <Route path='user' component={ProfileManager}/>
      </Route>
    </Router>
  </Provider>
)

//rely on server-side session to know if user is registered-logged in, and display React components based on that
let routerToRender
location.pathname === '/welcome' ? routerToRender = welcomeRouter : routerToRender = loggedInRouter

ReactDOM.render(
  routerToRender,
  document.querySelector('main')
)
