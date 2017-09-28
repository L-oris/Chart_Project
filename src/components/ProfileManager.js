import React,{Component} from 'react'
import {browserHistory,Link} from 'react-router'
import {connect} from 'react-redux'
import moment from 'moment'

import {updateUserProfilePic,getUserTables,getUserCharts,setVisualizerTable} from '../actions'


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
      <div className="profile__details">
        <img className="details--background" src="/images/profile-bg.jpg" alt="user background"/>
        <input type="text" id="profile-pic--file" type="file" onChange={this.handleProfilePicUpload}/>
        <label htmlFor="profile-pic--file">
          <img className="details--profile-pic" src={profilePicUrl} alt={first + ' ' + last}/>
        </label>
        <h4>{first} {last}</h4>
      </div>
    )
  }

  renderUserTables(tablesList){
    return tablesList.map(table=>{
      const {id,name,timestamp} = table
      return (
        <li onClick={e=>this.selectTable(id)}>
          <h5><span>{moment(timestamp).format('MM/YY')}</span> - {name}</h5>
        </li>
      )
    })
  }

  renderUserCharts(chartsList){
    return chartsList.map(chart=>{
      const {id,name,timestamp} = chart
      return (
        <li>
          <Link to={`/chart/${id}`}>
            <h5><span>{moment(timestamp).format('MM/YY')}</span> - {name}</h5>
          </Link>
        </li>
      )
    })
  }

  render(){
    const {user,userTables,userCharts} = this.props
    return (
      <div className="profile">

        {user && this.renderProfileDetails(user)}

        <div className="profile__list">
          <h3>TABLES</h3>
          <ul>
            {userTables && this.renderUserTables(userTables)}
          </ul>
        </div>

        <div className="profile__list">
          <h3>CHARTS</h3>
          <ul>
            {userCharts && this.renderUserCharts(userCharts)}
          </ul>
        </div>

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    user: reduxState.user,
    userTables: reduxState.userTables,
    userCharts: reduxState.userCharts,
  }
}

export default connect(mapStateToProps)(ProfileManager)
