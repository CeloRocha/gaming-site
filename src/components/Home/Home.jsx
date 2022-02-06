import React from 'react';
import { useNavigate } from 'react-router';
import './home.scss'
import Button from '../Button/Button';
import backgroundImg from '../../assets/images/controler.svg'
import { useAuth } from '../../hooks/useAuth';
import Title from '../Title/Title';
const Home = () => {

  const navigate = useNavigate();
  const { handleAuthorization } = useAuth();



  async function goToLobby () {
    if(await handleAuthorization()){
      navigate('/lobby')
    }
  }

  return(
    <section className='home'>
            <main className='content'>
                <Title>Jogue online com seus amigos!</Title>
                <Button onClick={goToLobby}>Jogue agora</Button>
            </main>
            <aside>
                <img src={backgroundImg} alt='Controller'/>
            </aside>
    </section>
  )
};

export default Home;
