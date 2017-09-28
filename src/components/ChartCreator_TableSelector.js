import React,{Component} from 'react'
import {connect} from 'react-redux'

import {ChartCreator_SearchTable} from '.'
import {getTables,setCreatorTableId} from '../actions'

class ChartCreator_TableSelector extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderTables = this.renderTables.bind(this)
    this.selectTable = this.selectTable.bind(this)
  }

  componentDidMount(){
    const {tables} = this.props
    if(!tables || tables.length===0){
      const {dispatch} = this.props
      dispatch(getTables())
    }
  }

  renderTables(tablesList){
    return tablesList.map(table=>(
      <li onClick={e=>this.selectTable(table.id)} className="border--black">{table.name}</li>
    ))
  }

  selectTable(tableId){
    const {dispatch} = this.props
    dispatch(setCreatorTableId(tableId))
  }

  render(){
    const {tables} = this.props
    return (
      <div>

        <ChartCreator_SearchTable/>

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
