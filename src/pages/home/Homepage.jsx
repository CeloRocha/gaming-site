import React from 'react';
import './homepage.scss'
import Navbar from '../../components/Navbar/Navbar';
import Home from '../../components/Home/Home';
import Leaderboard from '../../components/Leaderboard/Leaderboard';
import Footer from '../../components/Footer/Footer';

const Homepage = () => {

  return(
    <div className='homepage'>
        <Navbar />
        <Home />
        <Leaderboard />
        <Footer />
    </div>
    )
};

export default Homepage;
