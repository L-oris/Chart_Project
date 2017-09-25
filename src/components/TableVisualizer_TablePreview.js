import React,{Component} from 'react'
import {connect} from 'react-redux'

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
      <li>
        {Object.keys(tableData[0]).map(column=>{
          return <p className="border--black">{column}</p>
        })}
      </li>
    )

  }

  renderTableData(tableData){
    return tableData.map(row=>{
      const rowHtml = Object.keys(row).map(column=>(
        <p className="border--black">{row[column]}</p>
      ))
      return (
        <li>
          {rowHtml}
        </li>
    )})
  }

  render(){
    const {visualizerTable:{name,description,timestamp},visualizerTablePreview} = this.props
    return (
      <div>
        <h4>Table Preview here</h4>
        <h3>Name: {name}</h3>
        <p>Description: {description}</p>
        <h6>Created: {timestamp}</h6>

        <ul>
          {visualizerTablePreview && this.renderTableHeaders(visualizerTablePreview)}
          {visualizerTablePreview && this.renderTableData(visualizerTablePreview)}
        </ul>

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
