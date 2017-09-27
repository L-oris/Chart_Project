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
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteSearchChartResults())
  }

  handleRadioChange(e){
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
      const {id,name,first,last,profilePicUrl} = chart
      return (
        <li>
          <Link to={`/chart/${id}`}>
            <img src={profilePicUrl} alt={first + ' ' + last}/>
            <h6>{name}</h6>
          </Link>
        </li>
      )
    })
  }

  render(){
    const {searchChartResults} = this.props
    const {searchChartType} = this.state
    return (
      <div className="search-chart">

        <div className="search-chart__input">
          <input onChange={this.handleInputChange}/>
          <i className="fa fa-search" aria-hidden="true"></i>

          <ul>
            {searchChartResults && this.renderSearchChartResults(searchChartResults)}
          </ul>
          
        </div>

        <div className="search-chart__radio">
          <label for="search-chart--name">
            <input onChange={this.handleRadioChange} checked={searchChartType === 'name'} type="radio" id="search-chart--name" name="searchChartType" value="name"/>
            Name
          </label>
          <label for="search-chart--user">
            <input onChange={this.handleRadioChange} checked={searchChartType === 'user'} type="radio" id="search-chart--user" name="searchChartType" value="user"/>
            User
          </label>
          <label for="search-chart--type">
            <input onChange={this.handleRadioChange} checked={searchChartType === 'type'} type="radio" id="search-chart--type" name="searchChartType" value="type"/>
            Type
          </label>
        </div>


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
