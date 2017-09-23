import React,{Component} from 'react'
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'

import {Chart} from '.'
import {store} from '../start'
import {getCreatorData,createChart} from '../actions'

class ChartCreator_ChartPreview extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.handleInputChange = this.handleInputChange.bind(this)
    this.createChart = this.createChart.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const {creatorTableId,creatorFields} = nextProps
    //make sure action is dispatched only once
    creatorTableId && creatorFields && !this.props.creatorFields && store.dispatch(getCreatorData(creatorTableId,creatorFields))
  }

  handleInputChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  createChart(e){
    e.preventDefault()
    const {creatorTableId,creatorFields,creatorData} = this.props
    const {name,description} = this.state
    if(creatorData && name && description){

      store.dispatch(createChart({
        tableId: creatorTableId,
        XAxis: creatorFields.XAxis,
        YAxis: creatorFields.YAxis,
        type: creatorFields.type,
        name,
        description
      }))

      browserHistory.push('/')
    }
  }

  render(){
    const {creatorFields,creatorData} = this.props
    return (
      <div>

        {creatorData && <Chart type={creatorFields.type} XData={creatorData.XData} YData={creatorData.YData} YLabel={creatorFields.YAxis}/>}

        <form onSubmit={this.createChart}>
          Name:
          <input required name="name" onChange={this.handleInputChange}/>
          Description:
          <textarea required name="description" onChange={this.handleInputChange}></textarea>
          <button type="submit">Create it!</button>
        </form>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    creatorTableId: reduxState.creatorTableId,
    creatorFields: reduxState.creatorFields,
    creatorData: reduxState.creatorData
  }
}

export default connect(mapStateToProps)(ChartCreator_ChartPreview)
