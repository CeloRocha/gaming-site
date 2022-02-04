import React from 'react';
import { useState } from 'react';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
const SignIn = (props) => {

    const navigate = useNavigate()
    const { register } = useAuth();
    const [ email, setEmail ] = useState('');
    const [ userName, setUserName ] = useState('');
    const [ userPassword, setUserPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    async function handleRegister(event){
        event.preventDefault();
        if( userPassword !== confirmPassword) return console.log('Senhas erradas')
        await register(userName, email, userPassword)
        navigate('/')
    }

    return(
        <>
            <form className='form-login' onSubmit={handleRegister}>
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
