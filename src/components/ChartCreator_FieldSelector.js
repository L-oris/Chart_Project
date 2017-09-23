import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from '../axios'

import {store} from '../start'
import {getCreatorTableFields} from '../actions'

class ChartCreator_FieldSelector extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderFields = this.renderFields.bind(this)
  }

  componentWillUpdate(nextProps,nextState){
    const {creatorTableId} = nextProps
    creatorTableId && store.dispatch(getCreatorTableFields(creatorTableId))
  }

  renderFields(fieldsList){
    console.log('fields are',fieldsList);
    // return fieldsList.map(field=>(
    //   <li onClick={e=>this.selectFields(field.name)}>field.name</li>
    // ))
  }

  selectFields(fieldName){
    //do something
  }


  render(){
    const {creatorTableFields} = this.props
    return (
      <div>
        {creatorTableFields && this.renderFields(creatorTableFields)}
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
