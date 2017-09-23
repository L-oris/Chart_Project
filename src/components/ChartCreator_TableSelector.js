import React,{Component} from 'react'
import {connect} from 'react-redux'

import {store} from '../start'
import {getTables} from '../actions'

class ChartCreator_TableSelector extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderTables = this.renderTables.bind(this)
  }

  componentDidMount(){
    store.dispatch(getTables())
  }

  renderTables(tablesList){
    console.log('new tables are',tablesList);
  }

  render(){
    const {tables} = this.props
    return (
      <div>
        {tables && this.renderTables(tables)}
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    tables: reduxState.tables
  }
}

export default connect(mapStateToProps)(ChartCreator_TableSelector)
