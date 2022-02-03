import React from 'react';
import { useState } from 'react';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

const Login = (props) => {

    const [ userName, setUserName ] = useState('');
    const [ userPassword, setUserPassword ] = useState('');

    return(
        <>
            <form className='form-login'>
                <input
                    type="text"
                    placeholder='Nome de usuário'
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
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
