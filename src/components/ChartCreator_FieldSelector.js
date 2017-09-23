import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from '../axios'

import {store} from '../start'
import {getCreatorTableFields,setCreatorFields} from '../actions'


class ChartCreator_FieldSelector extends Component {

  constructor(props){
    super(props)
    this.state={
      chartTypes: ['line','bar','radar','doughnut','polarArea','bubble']
    }
    this.renderFields = this.renderFields.bind(this)
    this.chooseField = this.chooseField.bind(this)
    this.saveFields = this.saveFields.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const {creatorTableId} = nextProps
    //make sure action is dispatched only once
    creatorTableId && !this.props.creatorTableId && store.dispatch(getCreatorTableFields(creatorTableId))
  }

  renderFields(selectedAxis,fieldsList){
    return fieldsList.map(field=>(
      <li onClick={e=>this.chooseField(selectedAxis,field)}>{field}</li>
    ))
  }

  chooseField(selectedAxis,fieldName){
    this.setState({
      [selectedAxis]: fieldName
    })
  }

  saveFields(){
    const {XAxis,YAxis,type} = this.state
    if(XAxis && YAxis && type){
      store.dispatch(setCreatorFields({XAxis,YAxis,type}))
    }
  }

  render(){
    const {creatorTableFields} = this.props
    const {chartTypes} = this.state
    return (
      <div>

        <ul>
          <h4>Select X Axis</h4>
          {creatorTableFields && this.renderFields('XAxis',creatorTableFields)}
        </ul>

        <ul>
          <h4>Select Y Axis</h4>
          {creatorTableFields && this.renderFields('YAxis',creatorTableFields)}
        </ul>

        <ul>
          <h4>Select Chart Type</h4>
          {creatorTableFields && this.renderFields('type',chartTypes)}
        </ul>

        <button onClick={this.saveFields}>Go</button>
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    creatorTableId: reduxState.creatorTableId,
    creatorTableFields: reduxState.creatorTableFields
  }
}

export default connect(mapStateToProps)(ChartCreator_FieldSelector)
