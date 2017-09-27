import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {getSearchTableResults,deleteSearchTableResults,setVisualizerTable} from '../actions'


class SearchTable extends Component {

  constructor(props){
    super(props)
    this.state={
      searchTableType: 'name'
    }
    this.ajaxTimer
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectTable = this.selectTable.bind(this)
  }

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteSearchTableResults())
  }

  handleRadioChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleInputChange(e){
    clearTimeout(this.ajaxTimer)
    const {dispatch} = this.props
    const searchTableText = e.target.value
    this.setState({
      searchTableText
    })
    if(searchTableText.length>0){
      //prevent fast-typing users to make too many ajax calls --> set a timer
      const {searchTableType} = this.state
      this.ajaxTimer = setTimeout(()=>{
        dispatch(getSearchTableResults(searchTableType,searchTableText))
      },250)
    } else {
      dispatch(deleteSearchTableResults())
    }
  }

  selectTable(tableId){
    const {dispatch} = this.props
    dispatch(setVisualizerTable(tableId))
    dispatch(deleteSearchTableResults())
    this.setState({
      searchTableText: ''
    })
  }

  renderSearchTableResults(tablesList){
    return tablesList.map(table=>{
      const {id,name,profilePicUrl,first,last} = table
      return (
        <li onClick={e=>this.selectTable(id)}>
          <img src={profilePicUrl} alt={first + ' ' + last}/>
          <h6>{name}</h6>
        </li>
      )
    })
  }

  render(){
    const {searchTableResults} = this.props
    const {searchTableText,searchTableType} = this.state
    return (
      <div className="search-chart">

        <div className="search-chart__input">
          <input name="searchTableText" value={searchTableText} onChange={this.handleInputChange}/>
          <i className="fa fa-search" aria-hidden="true"></i>

          <ul>
            {searchTableResults && this.renderSearchTableResults(searchTableResults)}
          </ul>
        </div>

        <div className="search-chart__radio">
          <label for="search-chart--name">
            <input onChange={this.handleRadioChange} checked={searchTableType === 'name'} type="radio" id="search-chart--name" name="searchTableType" value="name"/>
            Name
          </label>
          <label for="search-chart--user">
            <input onChange={this.handleRadioChange} checked={searchTableType === 'user'} type="radio" id="search-chart--user" name="searchTableType" value="user"/>
            User
          </label>
        </div>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    searchTableResults: reduxState.searchTableResults
  }
}

export default connect(mapStateToProps)(SearchTable)
