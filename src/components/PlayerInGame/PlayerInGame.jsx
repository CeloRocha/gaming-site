import React from 'react'
import Cards from '../Cards/Cards'
import './PlayerInGame.scss'
import coinImg from '../../assets/images/coinImg.svg'

const PlayerInGame = (props) => {
  return (
    <div className={`player-inGame ${props.current && 'current'}`} style={{gridArea: `player${props.position}`}}>
        <div className="head">
            <div className="info">
                <img src={props.avatar} alt="" />
                <h2>{props.name}</h2>
            </div>
            {props.position === 0 &&
            <div className="coins">
                <img src={coinImg} alt="Coins:" />
                <span>{props.coins}</span>
            </div>
            }
        </div>
        <div className='cards'>
            <Cards cards={props.cards} />
        </div>
    </div>
  )
}

export default PlayerInGame