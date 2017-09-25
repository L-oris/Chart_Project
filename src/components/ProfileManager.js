import React,{Component} from 'react'
import {connect} from 'react-redux'

import {updateUserProfilePic} from '../actions'


class ProfileManager extends Component {

  constructor(props){
    super(props)
    this.state={}
    this.renderProfileDetails = this.renderProfileDetails.bind(this)
    this.handleProfilePicUpload = this.handleProfilePicUpload.bind(this)
  }

  handleProfilePicUpload(e){
    const {dispatch} = this.props
    //use built-in FormData API
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    dispatch(updateUserProfilePic(formData))
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

  render(){
    const {user} = this.props
    return (
      <div>
        <h1>Profile Manager here</h1>

        {user && this.renderProfileDetails(user)}

      </div>
    )
  }
}


function mapStateToProps(reduxState){
  return {
    user: reduxState.user
  }
}

export default connect(mapStateToProps)(ProfileManager)
