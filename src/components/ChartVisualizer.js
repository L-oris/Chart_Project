import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import axios from '../axios'
import moment from 'moment'

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
    const {type,YAxis,name,description,chartPicUrl,timestamp,first,last} = chart
    const {XData,YData} = chartData
    return (
      <div className="chart-visualizer__main">

        <header>
          <img src={chartPicUrl} alt="chart picture"/>
          <h2>{name}</h2>
          <h6>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</h6>
        </header>

        <section>
          <p>{description}</p>
          <Chart type={type} XData={XData} YData={YData} YLabel={YAxis}/>
          <h5>A chart by {first} {last}</h5>
        </section>

      </div>
    )
  }

  render(){
    const {visualizerChart,visualizerChartData} = this.props
    return (
      <div className="chart-visualizer">
        <h1>Chart Visualizer</h1>

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
