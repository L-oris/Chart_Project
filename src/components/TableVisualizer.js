import React,{Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {TableVisualizer_TablePreview,TableUploader,SearchTable} from '.'
import {getTables,setVisualizerTable,deleteVisualizerTable,setTableUploaderIsVisible} from '../actions'


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
    const {user} = this.props
    return tablesList.slice(0,6).map(table=>(
      <li onClick={e=>this.selectTable(table.id)}>
        <h5>{moment(table.timestamp).format('MM/YY')} - </h5>
        <h4>{table.name}</h4>
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

        <SearchTable selectedTableAction={setVisualizerTable}/>

        <div className="table-visualizer__latest">
          <h2>Latest Uploaded</h2>

          <div className="table-visualizer__upload-btn" onClick={e=>dispatch(setTableUploaderIsVisible())}>
            Upload your table!
          </div>

          <ul>
            {tables && this.renderTables(tables)}
          </ul>
        </div>

        {visualizerTable && <TableVisualizer_TablePreview/>}

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    user: reduxState.user,
    tables: reduxState.tables,
    visualizerTable: reduxState.visualizerTable,
    tableUploaderIsVisible: reduxState.tableUploaderIsVisible
  }
}

export default connect(mapStateToProps)(TableVisualizer)
