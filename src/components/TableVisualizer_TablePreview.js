import React,{Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {getVisualizerTablePreview} from '../actions'


class TableVisualizer_TablePreview extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderTableHeaders = this.renderTableHeaders.bind(this)
    this.renderTableData = this.renderTableData.bind(this)
  }

  componentDidMount(){
    const {dispatch,visualizerTable} = this.props
    dispatch(getVisualizerTablePreview(visualizerTable.id))
  }

  componentWillReceiveProps(nextProps){
    const {dispatch,visualizerTable} = nextProps
    if(visualizerTable !== this.props.visualizerTable){
      dispatch(getVisualizerTablePreview(visualizerTable.id))
    }
  }

  renderTableHeaders(tableData){
    return (
      <tr>
        {Object.keys(tableData[0]).map(column=>{
          return <th>{column}</th>
        })}
      </tr>
    )

  }

  renderTableData(tableData){
    return tableData.map(row=>{
      const rowHtml = Object.keys(row).map(column=>(
        <td>{row[column]}</td>
      ))
      return (
        <tr>
          {rowHtml}
        </tr>
    )})
  }

  render(){
    const {visualizerTable:{name,description,timestamp,first,last},visualizerTablePreview} = this.props
    return (
      <div className="table-preview">
        <header>
          <h5>Uploaded by {first} {last}</h5>
          <h6>{moment(timestamp).format("MMM Do, hh:mm")}</h6>
        </header>
        <h3>{name}</h3>
        <p>{description}</p>

        <table>
          {visualizerTablePreview && this.renderTableHeaders(visualizerTablePreview)}
          {visualizerTablePreview && this.renderTableData(visualizerTablePreview)}
        </table>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    visualizerTable: reduxState.visualizerTable,
    visualizerTablePreview: reduxState.visualizerTablePreview
  }
}

export default connect(mapStateToProps)(TableVisualizer_TablePreview)
