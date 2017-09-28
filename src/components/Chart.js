import React,{Component} from 'react'
import Chartjs from 'chart.js'
import randomcolor from 'randomcolor'

function hexToRGB(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")"
  }
}

export default class Chart extends Component {

  componentDidMount(){
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(props){
    let {type,XData,YData,YLabel,options} = props

    const color = randomcolor()
    const bgLightColor = hexToRGB(color,.3)
    const bgDarkColor = hexToRGB(color,.7)
    const colors = YData.map(()=>randomcolor())
    const bgLightColors = colors.map(color=>hexToRGB(color,.3))
    const bgDarkColors = colors.map(color=>hexToRGB(color,.7))

    let displayOptions
    if(type==='line'){
      displayOptions = {
        borderColor: color,
        backgroundColor: bgLightColor
      }
      options = {
        layout: {
          padding: {left: 5}
        }
      }
    } else if (type === 'bar'){
      displayOptions = {
        backgroundColor: bgLightColors,
        borderColor: colors,
        borderWidth: 3
      }
      options = {
        legend: {display: false},
        layout: {padding: {left: 5}}
      }
    } else if (type === 'radar'){
      displayOptions = {
        borderColor: color,
        backgroundColor: bgLightColor
      }
    } else if (type === 'doughnut' || type === 'polarArea'){
      displayOptions = {
        backgroundColor: bgDarkColors,
        borderColor: colors,
      }
    }



    if(type && XData && YData && YLabel){
      const ctx = this.refs.canvas.getContext('2d')
      const color = randomcolor()
      const bgColor = hexToRGB(color,.3)
      const colors = YData.map(()=>randomcolor())
      const bgColors = colors.map(color=>hexToRGB(color,.3))
      const myChart = new Chartjs(ctx, {
        type: type,
        data: {
          labels: XData,
          datasets: [Object.assign(displayOptions,{
            label: YLabel,
            data: YData
          })]
        },
        options: options || {}
      })
    }
  }

  render(){
    return (
      <div>
        <canvas ref="canvas" width="400" height="400"></canvas>
      </div>
    )
  }
}
