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
      <div>

        <h1 onClick={this._deleteCreatorTableId}>1.Select a table</h1>
        <ChartCreator_TableSelector/>

        <h1 onClick={this._deleteCreatorFields}>2.Select what to display</h1>
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
