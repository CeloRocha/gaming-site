import React from 'react';
import './player.scss';
import readyImg from '../../assets/images/Check.svg';
import notReadyImg from '../../assets/images/Cross.svg';
import googleImg from '../../assets/images/Google.svg'
const Player = (props) => {

    return(
        <div className='player'>
            <img className='player-icon' src={props.avatar} alt="Player Icon" referrerPolicy='no-referrer'/>
            <h3>{props.name}</h3>
            <span>Vitórias: {props.wins}</span>
            {props.status !== undefined && 
            <img src={props?.status ? readyImg : notReadyImg} alt='Ready' />
            }

        </div>
    );
};

export default Player;
