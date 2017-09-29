import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

function Navbar (props){
  const {user} = props
  return (
    <nav>

      <header>
        <Link to="/">
          <img className="logo" src="/images/logo.png" alt="logo"/>
        </Link>
        <img className="profile-pic" src={user && user.profilePicUrl}/>
      </header>

      <main>
        <Link activeClassName="current-link" to="/tables">
          <i className="fa fa-table" aria-hidden="true"></i>
          <h6>Tables</h6>
        </Link>
        <Link activeClassName="current-link" to="/chart_creator">
          <i className="fa fa-pie-chart" aria-hidden="true"></i>
          <h6>Creator</h6>
        </Link>
        <Link activeClassName="current-link" to="/user">
          <i className="fa fa-user" aria-hidden="true"></i>
          <h6>Profile</h6>
        </Link>
        <a href="/api/logout">
          <i className="fa fa-sign-out" aria-hidden="true"></i>
          <h6>Logout</h6>
        </a>
      </main>

    </nav>
  )
}

function mapStateToProps(reduxState){
  return {
    user: reduxState.user
  }
}

export default connect(mapStateToProps)(Navbar)
