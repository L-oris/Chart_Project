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
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectTable = this.selectTable.bind(this)
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
      const {id,name} = table
      return (
        <li onClick={e=>this.selectTable(id)}>
          <h6>{name}</h6>
        </li>
      )
    })
  }

  render(){
    const {searchTableResults} = this.props
    const {searchTableText} = this.state
    return (
      <div>

        <input name="searchTableText" value={searchTableText} onChange={this.handleInputChange}/>
        <select name="searchTableType" onChange={this.handleSelectChange}>
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
