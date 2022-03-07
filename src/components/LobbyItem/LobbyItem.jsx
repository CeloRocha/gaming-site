import React from 'react';
import { db } from '../../services/firebase';
import { set, ref } from '@firebase/database';
import { useNavigate } from 'react-router-dom';
import './LobbyItem.scss'
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button/Button';

import lockImg from '../../assets/images/Lock.svg'
const LobbyItem = (props) => {

    const navigate = useNavigate()
    const { user } = useAuth();
    console.log(props.players)

    async function enterRoom(){
        await set(ref(db, `/rooms/${props.id}/players/${user.id}`), {
            avatar: user.avatar,
            name: user.name,
            id: user.id,
            victory: user.victory,
            status: false
        })
        navigate(`/lobby/${props.id}`)
    }
    async function handleEnterRoom(){
        if(props.password != ''){

        }else{
            enterRoom()
        }
        
    }

    return(
        <div className='lobbyItem'>
            <h3>Sala: {props.name}</h3>
            <h3>Jogo: {props.game}</h3>
            <h3>Criador: {props.admin}</h3>
            <h3 className='small'>{props.players}/6</h3>
            <div className='limiter'>
                <Button className='options' onClick={handleEnterRoom}>
                    Entrar na sala
                    {props.password != '' &&
                    <img className='lock' src={lockImg} alt="Senha" />
                    }
                </Button>
            </div>
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