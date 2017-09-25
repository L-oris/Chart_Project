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
      <div>
        <h1>Here is my main app component!</h1>

        <Navbar/>

        {this.props.children}

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(App)
