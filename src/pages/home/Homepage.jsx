import React from 'react';
import './homepage.scss'
import Navbar from '../../components/Navbar/Navbar';
import Home from '../../components/Home/Home';

const Homepage = () => {
  return(
    <div className='homepage'>
        <Navbar />
        <Home />
    </div>
    )
};

export default Homepage;
