import React,{Component} from 'react'
import {connect} from 'react-redux'

import {store} from '../start'
import {getTableFields} from '../actions'

class ChartCreator_FieldSelector extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderFields = this.renderFields.bind(this)
  }

  componentDidMount(){
    store.dispatch(getTableFields())
  }

  renderFields(fieldsList){
    console.log('new tables are',fieldsList);
  }

  render(){
    const {creatorFields} = this.props
    return (
      <div>
        {creatorFields && this.renderFields(creatorFields)}
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    creatorFields: reduxState.creatorFields
  }
}

export default connect(mapStateToProps)(ChartCreator_FieldSelector)
