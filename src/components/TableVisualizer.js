import React,{Component} from 'react'
import {connect} from 'react-redux'

import {TableVisualizer_TablePreview,TableUploader} from '.'
import {getTables,setVisualizerTable,setTableUploaderIsVisible} from '../actions'


class TableVisualizer extends Component {

  constructor(props){
    super(props)
    this.state={
      tableUploaderIsVisible: false
    }
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
    dispatch(setVisualizerTable(tableId))
  }

  render(){
    const {dispatch,tables,visualizerTable,tableUploaderIsVisible} = this.props

    return (
      <div>

        {tableUploaderIsVisible && <TableUploader/>}

        <h3>Table Visualizer</h3>

        <ul>
          <li onClick={e=>dispatch(setTableUploaderIsVisible())}>
            Upload your table!
          </li>
          {tables && this.renderTables(tables)}
        </ul>

        {visualizerTable && <TableVisualizer_TablePreview/>}

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    tables: reduxState.tables,
    visualizerTable: reduxState.visualizerTable,
    tableUploaderIsVisible: reduxState.tableUploaderIsVisible
  }
}

export default connect(mapStateToProps)(TableVisualizer)
