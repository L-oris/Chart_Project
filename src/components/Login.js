import React from 'react'
import {Link} from 'react-router'

import FormWrapper from './FormWrapper'


function LoginForm ({error,handleInputChange,handleSubmit}){
  return (
    <form onSubmit={handleSubmit} className="form">

      <Link to='/'><h5>REGISTER</h5></Link>
      <h5 className="scale">LOGIN</h5>

      <h4 className="text-error">{error}</h4>

      <a href="/auth/github" className="welcome__service">
        <i className="fa fa-github" aria-hidden="true"></i>
        <h6>GitHub</h6>
      </a>

      <div className="welcome__separator">
        <p>OR</p>
      </div>

      <div className="login">

        <div className="welcome__field">
          <h6>Email</h6>
          <input required type="email" name="email" onChange={handleInputChange} placeholder=""/>
        </div>

        <div className="welcome__field">
          <h6>Password</h6>
          <input required type="password" name="password" onChange={handleInputChange} placeholder=""/>
        </div>
      </div>

      <button type="submit">Submit</button>

    </form>
  )
}

export default FormWrapper(LoginForm,'/api/login')
