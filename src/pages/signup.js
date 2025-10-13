import React from 'react'
import Header from '../components/Header';
// import SignupSignin from '../components/SignupSignin';
import SignupSigninComponent from '../components/SignupSignin';

function signup() {
  return (
    <div>
      <Header />
      <div className='wrapper'>
        <SignupSigninComponent/>
      </div>
      {/* <SignupSignin /> */}
    </div>
  )
}

export default signup