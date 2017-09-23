import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from '../axios'

import {
  ChartCreator_TableSelector,
  ChartCreator_FieldSelector,
  ChartCreator_ChartPreview
} from '.'


class ChartCreator extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    return (
      <div>

        <h1>1.Select a table</h1>
        <ChartCreator_TableSelector/>

        <h1>2.Select what to display</h1>
        <ChartCreator_FieldSelector/>

        <h1>3.Preview the table, Describe and Share!</h1>
        <ChartCreator_ChartPreview/>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(ChartCreator)
