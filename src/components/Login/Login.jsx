import React from 'react';
import { useState } from 'react';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const Login = (props) => {

    const navigate = useNavigate();
    const [ userEmail, setUserEmail ] = useState('');
    const [ userPassword, setUserPassword ] = useState('');
    const { signInNormally } = useAuth()

    async function handleSignIn(event){
        event.preventDefault();
        await signInNormally(userEmail, userPassword)
        navigate('/')
    }

    return(
        <>
            <form className='form-login' onSubmit={handleSignIn}>
                <input
                    type="text"
                    placeholder='Digite seu email'
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)}
                />
                <input
                    type="password"
                    placeholder='Senha'
                    value={userPassword}
                    onChange={(event) => setUserPassword(event.target.value)}

                />
                <Button type='submit'>Login</Button>
            </form>
            <p className='auth-switch'>Ainda não tem uma conta? <button onClick={props.handleClick}>Crie Agora</button></p>
        </>
    )
};

export default Login;
