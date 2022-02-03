import React from 'react';
import './homepage.scss'
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/Button/Button';
import backgroundImg from '../../assets/images/controler.svg'

const Homepage = () => {
  return(
    <div className='homepage'>
        <Navbar />
        <div className='aside'>
            <main className='content'>
                <h2>Jogue online com seus amigos!</h2>
                <Button>Jogue agora</Button>
            </main>
            <aside>
                <img src={backgroundImg} alt='Controller'/>
            </aside>
        </div>
    </div>
    )
};

export default Homepage;
