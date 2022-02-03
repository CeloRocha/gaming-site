import React from 'react';
import './navbar.scss'
import logoImg from '../../assets/images/controlerLogo.svg'

import Button from '../Button/Button';
const Navbar = () => {
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
        <Button>Sign Up</Button>
    </header>
  )
};

export default Navbar;
