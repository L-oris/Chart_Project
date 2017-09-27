import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {Navbar} from '.'
import {getUser} from '../actions'

class App extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  componentDidMount(){
    const {dispatch} = this.props
    dispatch(getUser())
  }

  render(){
    return (
      <div className="app">

        <Navbar/>

        <div className="app__children">
          {this.props.children}
        </div>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(App)
