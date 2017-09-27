import React,{Component} from 'react'
import {connect} from 'react-redux'

import {TableVisualizer_TablePreview,TableUploader,SearchTable} from '.'
import {getTables,setVisualizerTable,setTableUploaderIsVisible,deleteVisualizerTable} from '../actions'


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

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteVisualizerTable())
  }

  renderTables(tablesList){
    return tablesList.map(table=>(
      <li onClick={e=>this.selectTable(table.id)}>
        <h3>{table.name}</h3>
      </li>
    ))
  }

  selectTable(tableId){
    const {dispatch} = this.props
    dispatch(setVisualizerTable(tableId))
  }

  render(){
    const {dispatch,tables,visualizerTable,tableUploaderIsVisible} = this.props

    return (
      <div className="table-visualizer">

        {tableUploaderIsVisible && <TableUploader/>}

        <h1>Table Visualizer</h1>

        <SearchTable/>

        <h2>Latest Uploaded</h2>
        <ul className="table-visualizer__tables">
          {tables && this.renderTables(tables)}
        </ul>

        <div className="table-visualizer__upload-btn" onClick={e=>dispatch(setTableUploaderIsVisible())}>
          Upload your table!
        </div>

        <h2>Preview</h2>
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
