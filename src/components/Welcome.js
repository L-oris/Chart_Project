import React from 'react'
import {Link} from 'react-router'


export default function Welcome(props){
  return (
    <div>

      <h1>Chart Project</h1>

      {props.children}

    </div>
  )

}
