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
    axios.get('/api/get_data')
    .then(serverResponse=>{
      const {XData, YData} = serverResponse.data
      const type = 'bar'
      const data = {
        labels: XData,
        datasets: [{
          label: 'Life Expectancy Italy',
          data: YData
        }]
      }
      const options = {}

      this.setState({
        type, data, options
      })
    })
    .catch(err=>{
      console.log('Error getting data from server',err);
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
