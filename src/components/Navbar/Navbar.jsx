import React from 'react';
import './navbar.scss'
import logoImg from '../../assets/images/controlerLogo.svg'
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';
const Navbar = () => {

  const navigate = useNavigate()
  const { user, handleSignOut } = useAuth();

  function handleClick(){
    navigate('login')
  }
  return(
    <header className='header'>
        <div className='logo'>
            <img src={logoImg} alt='Logo' />
            <h1>Crams Games</h1>
        </div>
        <nav>
            <a href='#'>Home</a>
            <a href='#'>About</a>
            <a href='#'>Games</a>
            <a href='#'>Me</a>

        </nav>
        { user 
        ?
        <div className='user'>
          <img src={user.avatar} alt="this" referrerPolicy='no-referrer' />
          <h1>{user.name}</h1>
          {user.verified ? <h1>Verificado</h1> : <h1>Não</h1>}
          <Button  onClick={handleSignOut}>Sign Out</Button>
        </div>
        :
        <Button onClick={handleClick}>Sign Up</Button>
        }
    </header>
  )
};

export default Navbar;
