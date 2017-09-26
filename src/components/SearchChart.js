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
    const {dispatch} = this.props
    const {searchChartType} = this.state
    if(e.target.value.length>0){
      dispatch(getSearchChartResults(searchChartType,e.target.value))
    } else {
      dispatch(deleteSearchChartResults())
    }
  }

  // handleInputChange(e){
  //   const {dispatch} = this.props
  //   const {searchChartManner} = this.state
  //   if(e.target.value.length>0){
  //     clearTimeout(this.ajaxTimer)
  //     this.ajaxTimer = setTimeout(()=>{
  //       dispatch(getSearchChartResults(searchChartManner,e.target.value))
  //     },1000)
  //   } else {
  //     dispatch(deleteSearchChartResults())
  //   }
  // }

  renderSearchChartResults(chartsList){
    console.log('results inside Latest component are',chartsList);
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
