import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import moment from 'moment'

import {SearchChart} from '.'
import {getCharts,getSearchChartResults,deleteSearchChartResults} from '../actions'


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
      const {id,name,description,chartPicUrl,timestamp,first,last,profilePicUrl} = chart
      return (
        <li>

          <header>
            <img className="profile-pic" src={profilePicUrl} alt={first + ' ' + last}/>
            <h5>A chart by {first} {last}</h5>
          </header>

          <Link to={`/chart/${id}`}>
            <main>
              <img className="chart-pic" src={chartPicUrl} alt={name}/>
              <aside>
                <h3>{name}</h3>
                <p>{description}</p>
              </aside>
            </main>
          </Link>

          <footer>
            <h5>{moment(timestamp).format("MMM Do, hh:mm")}</h5>
            <h4>
              <i className="fa fa-comments-o" aria-hidden="true"></i>
              13 comments
            </h4>
          </footer>
        </li>
      )
    })
  }

  render(){
    const {charts} = this.props
    return (
      <div className="latest">
        <h1>Latest charts</h1>

        <SearchChart/>

        <ul className="latest__charts">
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
