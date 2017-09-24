import React,{Component} from 'react'
import {connect} from 'react-redux'

import {getCharts} from '../actions'


class Latest extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderCharts = this.renderCharts.bind(this)
  }

  componentDidMount(){
    const {dispatch} = this.props
    dispatch(getCharts())
  }

  renderCharts(chartsList){
    console.log('now charts has come',chartsList);
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
