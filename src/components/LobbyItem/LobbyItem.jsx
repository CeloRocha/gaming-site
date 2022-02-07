import React from 'react';
import { Link } from 'react-router-dom';
import './LobbyItem.scss'

const LobbyItem = (props) => {

    

    return(
        <div className='lobbyItem'>
            <h3>Sala: {props.name}</h3>
            <h3>{props.game}</h3>
            <h3>Criador: {props.admin}</h3>
            <h3>{props.players}/6</h3>
            <Link to={`/lobby/${props.id}`}>Entrar na sala</Link>
        </div>
    )
};

export default LobbyItem;

// key={game[0]}
// id={game[0]}
// name={game[1].name}
// admin={game[1].adminName}
// game={game[1].game}
// players={game[1].players.length}
// password={game[1].password}