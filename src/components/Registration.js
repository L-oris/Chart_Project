import React from 'react'
import {Link} from 'react-router'

import FormWrapper from './FormWrapper'


function RegistrationForm ({error,handleInputChange,handleSubmit}){
  return (
    <form onSubmit={handleSubmit}>

      <h5 className="scale">REGISTER</h5>
      <Link to='/login'><h5>LOGIN</h5></Link>

      <h4 className="text-error">{error}</h4>

      <section className="registration">
        <div className="welcome__field">
          <h6>First Name</h6>
          <input required name="first" onChange={handleInputChange} placeholder=""/>
        </div>

        <div className="welcome__field">
          <h6>Last Name</h6>
          <input required name="last" onChange={handleInputChange} placeholder=""/>
        </div>

        <div className="welcome__field">
          <h6>Email</h6>
          <input required type="email" name="email" onChange={handleInputChange} placeholder=""/>
        </div>

        <div className="welcome__field">
          <h6>Password</h6>
          <input required type="password" name="password" onChange={handleInputChange} placeholder=""/>
        </div>
      </section>

      <button type="submit">Submit</button>


    </form>
  )
}

export default FormWrapper(RegistrationForm,'/api/register')
