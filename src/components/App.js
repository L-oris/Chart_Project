import React,{Component} from 'react'
import {Link} from 'react-router'
import axios from '../axios'


export default class App extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    return (
      <div>
        <h1>Here is my main app component!</h1>
        <Link to="/">Home</Link>
        <Link to="/chart_creator">Chart creator</Link>
        <Link to="/table_uploader">Table Uploader</Link>
        <a href="/api/logout">Logout</a>

        {this.props.children}

      </div>
    )
  }
}
