import React,{Component} from 'react'
import Chartjs from 'chart.js'

export default class Chart extends Component {

  componentDidMount(){
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(props){
    const {type,XData,YData,YLabel,options} = props
    if(type && XData && YData && YLabel){
      const ctx = this.refs.canvas.getContext('2d')
      const myChart = new Chartjs(ctx, {
        type: type,
        data: {
          labels: XData,
          datasets: [{
            label: YLabel,
            data: YData
          }]
        },
        options: options || {}
      })
    }
  }

  render(){
    return (
      <div>
        <h4>Canvas here</h4>
        <canvas ref="canvas" width="400" height="400"></canvas>
      </div>
    )
  }
}
