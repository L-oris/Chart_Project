import React,{Component} from 'react'
import {connect} from 'react-redux'

import {
  ChartCreator_TableSelector,
  ChartCreator_FieldSelector,
  ChartCreator_ChartPreview
} from '.'
import {deleteCreatorTableId,deleteCreatorFields} from '../actions'


class ChartCreator extends Component {

  constructor(props){
    super(props)
    this.state={}
    this._deleteCreatorTableId = this._deleteCreatorTableId.bind(this)
    this._deleteCreatorFields = this._deleteCreatorFields.bind(this)
  }

  _deleteCreatorTableId(){
    const {dispatch} = this.props
    dispatch(deleteCreatorTableId())
  }

  _deleteCreatorFields(){
    const {dispatch} = this.props
    dispatch(deleteCreatorFields())
  }

  render(){
    return (
      <div className="chart-creator">

        <h1 onClick={this._deleteCreatorTableId}>1. Find a table</h1>
        <ChartCreator_TableSelector/>

        <h1 onClick={this._deleteCreatorFields}>2. Choose the options</h1>
        <ChartCreator_FieldSelector/>

        <h1>3.Preview & Share!</h1>
        <ChartCreator_ChartPreview/>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {}
}

export default connect(mapStateToProps)(ChartCreator)
