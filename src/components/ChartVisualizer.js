import React,{Component} from 'react'
import {connect} from 'react-redux'
import axios from '../axios'

import {Chart} from '.'


class ChartVisualizer extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderChart = this.renderChart.bind(this)
    this.renderComments = this.renderComments.bind(this)
  }

  componentDidMount(){
    const {charts} = this.props
    const currentChart = charts && charts.find(chart=>chart.id==this.props.params.id)
    this.setState({
      chart: currentChart
    })

    const {id,tableId,XAxis,YAxis} = currentChart

    //get data for current chart
    axios.post('/api/get_chart_data',{
      tableId, XAxis, YAxis
    })
    .then(serverResponse=>{
      this.setState({
        chartData: serverResponse.data
      })
    })

    //get comments for current chart
    axios.post('/api/get_chart_comments',{chartId:id})
    .then(serverResponse=>{
      this.setState({
        chartComments: serverResponse.data
      })
    })
  }

  renderChart(chart,chartData){
    const {type,YAxis,name,description,first,last} = chart
    const {XData,YData} = chartData
    return (
      <div>
        <h4>{name}</h4>
        <h6>A chart by {first} {last}</h6>

        <Chart type={type} XData={XData} YData={YData} YLabel={YAxis}/>

        <p>{description}</p>
      </div>
    )
  }

  renderComments(comments){
    return comments.map(_comment=>{
      const {comment,first,last,profilePicUrl,timestamp} = _comment
      return (
        <li>
          <h6>{first} {last}</h6>
          <img className="small-img" src={profilePicUrl} alt={first + ' ' + last}/>
          <p>{comment}</p>
        </li>
      )
    })
  }

  render(){
    const {chart,chartData,chartComments} = this.state
    return (
      <div>
        <h3>Chart Visualizer</h3>

        {chart && chartData && this.renderChart(chart,chartData)}

        <ul>
          <h2>Comments</h2>
          {chartComments && this.renderComments(chartComments)}
        </ul>
      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    charts: reduxState.charts
  }
}

export default connect(mapStateToProps)(ChartVisualizer)
