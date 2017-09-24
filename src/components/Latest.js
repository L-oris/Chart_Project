import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {getCharts} from '../actions'


class Latest extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderCharts = this.renderCharts.bind(this)
  }

  componentDidMount(){
    const {dispatch,charts} = this.props
    if(!charts){
      dispatch(getCharts())
    }
  }

  renderCharts(chartsList){
    return chartsList.map(chart=>{
      const {id,name,description,timestamp,first,last,profilePicUrl} = chart
      return (
        <li className="border--black">
          <Link to={`/chart/${id}`}>
            <img className="small-img" src={profilePicUrl} alt={first + ' ' + last}/>
            <h4>{name}</h4>
            <h6>By {first + ' ' + last}</h6>
            <p>{timestamp}</p>
          </Link>
        </li>
      )
    })
  }

  render(){
    const {charts} = this.props

    return (
      <div>
        <h3>Latest charts here!</h3>

        <ul>
          {charts && this.renderCharts(charts)}
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

export default connect(mapStateToProps)(Latest)
