import React from 'react'
import {Link} from 'react-router'

import FormWrapper from './FormWrapper'


function LoginForm ({error,handleInputChange,handleSubmit}){
  return (
    <form onSubmit={handleSubmit} className="form">

      <h4>{error}</h4>

      <div>
        <h6>First Name</h6>
        <input required name="first" onChange={handleInputChange} placeholder=""/>
      </div>

      <div>
        <h6>Last Name</h6>
        <input required name="last" onChange={handleInputChange} placeholder=""/>
      </div>

      <div>
        <h6>Email</h6>
        <input required type="email" name="email" onChange={handleInputChange} placeholder=""/>
      </div>

      <div>
        <h6>Password</h6>
        <input required type="password" name="password" onChange={handleInputChange} placeholder=""/>
      </div>

      <button type="submit">Submit</button>

      <Link to='/'>Not a member?</Link>

    </form>
  )
}

export default FormWrapper(LoginForm,'/api/login')
