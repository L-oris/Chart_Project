import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from '../axios'


class ChartCreator extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    return (
      <div>

        <h1>1.Select a table</h1>

        <h1>2.Select what to display</h1>

        <h1>3.Preview the table</h1>

        <h1>4.Add description and share!</h1>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(ChartCreator)
