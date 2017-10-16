import React from 'react'
import {Link} from 'react-router'


export default function Welcome(props){
  return (
    <div className="welcome">
      <p className="hidden"></p>

      <h3 className="title">Data visualization describes any effort to help people understand the significance of data by placing it in a visual context</h3>

      {props.children}

      <p className="hidden"></p>
    </div>
  )

}
