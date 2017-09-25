import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import axios from '../axios'

import {Chart, ChartVisualizer_Comments} from '.'

import {setVisualizerChart,setVisualizerChartData,setVisualizerChartComments,deleteVisualizerChart} from '../actions'


class ChartVisualizer extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderChart = this.renderChart.bind(this)
  }

  componentDidMount(){
    const {dispatch, params:{id:chartId}} = this.props
    dispatch(setVisualizerChart(chartId))
    dispatch(setVisualizerChartData(chartId))
    dispatch(setVisualizerChartComments(chartId))
  }

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteVisualizerChart())
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

  render(){
    const {visualizerChart,visualizerChartData} = this.props
    return (
      <div>
        <h3>Chart Visualizer</h3>

        {visualizerChart && visualizerChartData && this.renderChart(visualizerChart,visualizerChartData)}

        {visualizerChart && visualizerChartData && <ChartVisualizer_Comments/>}

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    visualizerChart: reduxState.visualizerChart,
    visualizerChartData: reduxState.visualizerChartData,
  }
}

export default connect(mapStateToProps)(ChartVisualizer)
