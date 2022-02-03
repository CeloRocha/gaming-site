import React from 'react';
import { useState } from 'react';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

const SignIn = (props) => {

    const [ email, setEmail ] = useState('');
    const [ userName, setUserName ] = useState('');
    const [ userPassword, setUserPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    return(
        <>
            <form className='form-login'>
                <input
                    type="email"
                    placeholder='Digite um email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
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
                <input
                    type="password"
                    placeholder='Confirme sua senha'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}

                />
                <Button type='submit'>Registrar-se</Button>
            </form>
            <p className='auth-switch'>Já tem uma conta? <button onClick={props.handleClick}>Faça login</button></p>
        </>
    )
};

export default SignIn;