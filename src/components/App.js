import React,{Component} from 'react'
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

        {this.props.children}
        
      </div>
    )
  }
}
