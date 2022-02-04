import React from 'react';
import './AuthPage.scss';
import { Link } from 'react-router-dom';
import googleImg from '../../assets/images/Google.svg'
import goBackImg from '../../assets/images/BackArrow.svg'
import Login from '../../components/Login/Login';
import { useState } from 'react';
import SignIn from '../../components/SignIn/SignIn';
import controllerColoredImg from '../../assets/images/controllercolored.svg'
import controllerNintendoImg from '../../assets/images/controllerNintendo.svg'
const AuthPage = () => {

    const [ signUp, setSignUp ] = useState(false);

    function handleSignStateChange (){
        setSignUp(prevSignUp => !prevSignUp)
    }

    return(
        <div className='auth-page'>
            <div className='login'>
                <header>
                    <Link to='/'>
                        <img className='arrow' src={goBackImg} alt='Voltar' />
                    </Link>
                    <h1>
                        {signUp ? 'Registrar-se' : 'Logar'}
                    </h1>
                </header>
                {  signUp
                ?
                <SignIn handleClick={handleSignStateChange}/>
                :
                <Login handleClick={handleSignStateChange}/>
                }
                <div className='separator'>Ou</div>
                <button className='googleLogin'>
                    <img src={googleImg} />
                    <span>Login with Google</span>
                </button>
            </div>
            <img className='auth-img-1' src={controllerColoredImg} alt=''/>
            <img className='auth-img-2' src={controllerNintendoImg} alt="" />
        </div>   
      )
};

export default AuthPage;
