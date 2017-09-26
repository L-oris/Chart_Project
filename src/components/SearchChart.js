import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {getSearchChartResults,deleteSearchChartResults} from '../actions'


class SearchChart extends Component {

  constructor(props){
    super(props)
    this.state={
      searchChartType: 'name'
    }
    this.ajaxTimer
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteSearchChartResults())
  }

  handleSelectChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleInputChange(e){
    clearTimeout(this.ajaxTimer)
    const {dispatch} = this.props
    const {searchChartType} = this.state
    const searchChartText = e.target.value
    if(searchChartText.length>0){
      //prevent fast-typing users to make too many ajax calls --> set a timer
      this.ajaxTimer = setTimeout(()=>{
        dispatch(getSearchChartResults(searchChartType,searchChartText))
      },250)
    } else {
      dispatch(deleteSearchChartResults())
    }
  }

  renderSearchChartResults(chartsList){
    return chartsList.map(chart=>{
      const {name,first,last,profilePicUrl} = chart
      return (
        <li>
          <img className="small-img" src={profilePicUrl} alt={first + ' ' + last}/>
          <h6>{name}</h6>
        </li>
      )
    })
  }

  render(){
    const {searchChartResults} = this.props
    return (
      <div>

        <input onChange={this.handleInputChange}/>
        <select name="searchChartType" onChange={this.handleSelectChange}>
          <option value="name">Name</option>
          <option value="user">User</option>
          <option value="type">Type</option>
        </select>

        <ul>
          {searchChartResults && this.renderSearchChartResults(searchChartResults)}
        </ul>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    searchChartResults: reduxState.searchChartResults
  }
}

export default connect(mapStateToProps)(SearchChart)
