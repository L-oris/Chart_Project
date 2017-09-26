import React,{Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {getSearchTableResults,deleteSearchTableResults} from '../actions'


class SearchTable extends Component {

  constructor(props){
    super(props)
    this.state={
      searchTableType: 'name'
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentWillUnmount(){
    const {dispatch} = this.props
    dispatch(deleteSearchTableResults())
  }

  handleSelectChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleInputChange(e){
    clearTimeout(this.ajaxTimer)
    const {dispatch} = this.props
    const {searchTableType} = this.state
    const searchTableText = e.target.value
    if(searchTableText.length>0){
      //prevent fast-typing users to make too many ajax calls --> set a timer
      this.ajaxTimer = setTimeout(()=>{
        dispatch(getSearchTableResults(searchTableType,searchTableText))
      },250)
    } else {
      dispatch(deleteSearchTableResults())
    }
  }

  renderSearchTableResults(tablesList){
    return tablesList.map(table=>{
      const {name} = table
      return (
        <li>
          <h6>{name}</h6>
        </li>
      )
    })
  }

  render(){
    const {searchTableResults} = this.props
    return (
      <div>

        <input onChange={this.handleInputChange}/>
        <select name="searchChartType" onChange={this.handleSelectChange}>
          <option value="name">Name</option>
          <option value="user">User</option>
        </select>

        <ul>
          {searchTableResults && this.renderSearchTableResults(searchTableResults)}
        </ul>

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
