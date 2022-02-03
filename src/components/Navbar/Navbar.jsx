import React from 'react';
import './navbar.scss'
import logoImg from '../../assets/images/controlerLogo.svg'
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
const Navbar = () => {

  const navigate = useNavigate()

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
        <Button onClick={handleClick}>Sign Up</Button>
    </header>
  )
};

export default Navbar;
