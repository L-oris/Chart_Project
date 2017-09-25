import React from 'react'
import {Link} from 'react-router'

export default function Navbar (props){
  return (
    <nav>
      Navbar component
      <Link to="/">Home</Link>
      <Link to="/chart_creator">Chart creator</Link>
      <Link to="/tables">Table Visualizer</Link>
      <Link to="/user">Profile Manager</Link>
      <a href="/api/logout">Logout</a>
    </nav>
  )
}
