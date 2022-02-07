import React from 'react';
import './Footer.scss'
import githubImg from '../../assets/images/githubIcon.png'

const Footer = () => {

    return(
        <div className='footer'>
            <a href="https://github.com/CeloRocha" target='_blank' className='hover-background-standard' rel='noreferrer'>
                <img src={githubImg} alt="Github:" />
                <span>Marcelo Rocha</span>
            </a>
        </div>
    )
};

export default Footer;
