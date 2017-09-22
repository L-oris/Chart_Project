import React,{Component} from 'react'
import axios from '../axios'

//React Components
import Chart from './Chart'


export default class App extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  componentDidMount(){
    //FETCH DATA FROM RESTful server, mock data now
    const type = 'bar'
    const data = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    }
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }

    this.setState({
      type, data, options
    })
  }

  render(){
    const {type,data,options} = this.state
    return (
      <div>
        <h1>Here is my main app component!</h1>

        <Chart type={type} data={data} options={options}/>

        {this.props.children}

      </div>
    )
  }
}
