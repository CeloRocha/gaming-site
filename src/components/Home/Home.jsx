import React from 'react';
import { useNavigate } from 'react-router';
import './home.scss'
import Button from '../Button/Button';
import backgroundImg from '../../assets/images/controler.svg'
const Home = () => {

  const navigate = useNavigate();

  function goToLobby () {
    navigate('/lobby')
  }

  return(
    <section className='home'>
            <main className='content'>
                <h2>Jogue online com seus amigos!</h2>
                <Button onClick={goToLobby}>Jogue agora</Button>
            </main>
            <aside>
                <img src={backgroundImg} alt='Controller'/>
            </aside>
    </section>
  )
};

export default Home;
