import React,{Component} from 'react'
import Chartjs from 'chart.js'

export default class Chart extends Component {

  componentWillReceiveProps(props){
    const {type,data,options} = props
    const ctx = this.refs.canvas.getContext('2d')
    const myChart = new Chartjs(ctx, {
      type: type,
      data: data,
      options: options
    })
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
