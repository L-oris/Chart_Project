import React,{Component} from 'react'
import {browserHistory,Link} from 'react-router'
import {connect} from 'react-redux'

import {TableUploader} from '.'
import {updateUserProfilePic,getUserTables,getUserCharts,setTableUploaderIsVisible,setVisualizerTable} from '../actions'


class ProfileManager extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderProfileDetails = this.renderProfileDetails.bind(this)
    this.handleProfilePicUpload = this.handleProfilePicUpload.bind(this)
  }

  componentDidMount(){
    const {dispatch,userTables,userCharts} = this.props
    !userTables && dispatch(getUserTables())
    !userCharts && dispatch(getUserCharts())
  }

  handleProfilePicUpload(e){
    const {dispatch} = this.props
    //use built-in FormData API
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    dispatch(updateUserProfilePic(formData))
  }

  selectTable(tableId){
    const {dispatch} = this.props
    dispatch(setVisualizerTable(tableId))
    browserHistory.push('/tables')
  }

  renderProfileDetails(user){
    const {first,last,profilePicUrl} = user
    return (
      <div>
        <img className="small-img" src={profilePicUrl} alt={first + ' ' + last}/>
        <h4>{first} {last}</h4>
        <input type="file" onChange={this.handleProfilePicUpload}/>
      </div>
    )
  }

  renderUserTables(tablesList){
    return tablesList.map(table=>{
      const {id,name,description,timestamp} = table
      return (
        <li onClick={e=>this.selectTable(id)}>
          <h5>{name}</h5>
          <p>{description}</p>
          <h6>{timestamp}</h6>
        </li>
      )
    })
  }

  renderUserCharts(chartsList){
    return chartsList.map(chart=>{
      const {id,name,description,timestamp} = chart
      return (
        <li>
          <Link to={`/chart/${id}`}>
            <h5>{name}</h5>
            <p>{description}</p>
            <h6>{timestamp}</h6>
          </Link>
        </li>
      )
    })
  }

  render(){
    const {dispatch,user,userTables,userCharts,tableUploaderIsVisible} = this.props
    return (
      <div>

        {tableUploaderIsVisible && <TableUploader/>}

        <h1>Profile Manager here</h1>

        {user && this.renderProfileDetails(user)}

        <ul>
          <h4>Tables:</h4>
          <p onClick={e=>dispatch(setTableUploaderIsVisible())}>
            Upload a new table
          </p>

          {userTables && this.renderUserTables(userTables)}
        </ul>

        <ul>
          <h4>Charts:</h4>
          <Link to="/chart_creator">Create a new chart!</Link>
          {userCharts && this.renderUserCharts(userCharts)}
        </ul>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    user: reduxState.user,
    userTables: reduxState.userTables,
    userCharts: reduxState.userCharts,
    tableUploaderIsVisible: reduxState.tableUploaderIsVisible
  }
}

export default connect(mapStateToProps)(ProfileManager)
