import React, { useState, useEffect} from 'react';
import './Thanks.scss'
import './ThanksFinish.scss'
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { onValue, ref, get, child, remove, update } from '@firebase/database';
import { db } from '../../../services/firebase';
import { useGame } from '../../../hooks/useGame';
import Button from '../../../components/Button/Button'
import Title from '../../../components/Title/Title';
import Loading from '../../../components/Loading/Loading';
import Card from '../../../components/Card/Card';
import Cards from '../../../components/Cards/Cards';
import coinImg from '../../../assets/images/coinImg.svg'
import PlayerInGame from '../../../components/PlayerInGame/PlayerInGame';

const Thanks = () => {

    const navigate = useNavigate()
    const { room } = useParams();
    const { user, addVictory } = useAuth();
    const [ admin, setAdmin ] = useState();
    const { players, currentPlayer, cards, cardOnTable, finish, nextCard, putCoin, pickCard} = useGame();

    useEffect(()=>{
        if(finish && isAdmin()){
            handleFinish()
        }
        if(finish && isWinner()){
            addVictory(room)
        }
    }, [finish])


    async function getInfo(){
        const roomRef = ref(db, `/games`);
        const admin = await get(child(roomRef, `/${room}`))
        setAdmin(admin.val().admin)
    }

    useEffect(()=>{
        getInfo()
    }, [])

    function isYourTurn(){
        return user.id === currentPlayer
    }

    async function handleNextCard(){
        await nextCard()
    }

    async function handlePutCoin(){
        if(isYourTurn()){
            await putCoin(currentPlayer)
        }
    }

    async function handlePickCard(){
        if(isYourTurn()){
            await pickCard(currentPlayer)
        }
    }

    function isAdmin(){
        return admin === user.id ? true : false
    }

    function isWinner(){
        const finalPlayers = players.sort((playerA, playerB) => {
            return playerA[1].points - playerB[1].points
        })
        if(finalPlayers[0][0] === user.id){
            return true
        }
        return false
    }

    async function quitGame(){
        if(isAdmin()){
            await remove(ref(db, `/games/${room}`))
        }
        navigate(`/lobby/${room}`)
    }

    async function handleFinish(){
        const updates = {}
        players.forEach( player => {
            updates[`/players/${player[0]}/status`] = false
        });
        updates['/inGame'] = false
        await update(ref(db, `/rooms/${room}`), updates)
    }


    const showCurrentPlayer = players?.find( player => {
        return player[0] === currentPlayer
    })

    const userPlayer = players?.find( (player, index) => {
        return player[0] === user.id
    })
    const userIndex = players?.findIndex( (player, index) => {
        return player[0] === user.id
    })

    const coins = []
    for(let i=1; i<=cardOnTable.coins; i++){
        coins.push(<img key={i} src={coinImg} alt={i}/>)
    }

    return(
        <div className='thanks-game-page'>
            {finish
            ?
            <div className='finish'>
                <div className='finish-positions'>
                {players.sort((playerA, playerB) => {
                    return playerA[1].points - playerB[1].points
                })
                .map((player, index) => {
                    return(
                        <div className={`finish-player p${index}`}>
                            {index === 0 && <Title>Winner:</Title>}
                            <img src={player[1].avatar} alt={player[1].name} />
                            <h1>{player[1].name}</h1>
                            <span>Pontos: {player[1].points}.</span>
                        </div>
                    )
                })}
                </div>
                <Button onClick={quitGame}>Go back to lobby</Button>
            </div>
            :
                !players 
                ?
                    <Loading />
                :
                    <>
                    <div className='current-card'>
                        <Card number={cardOnTable.card}/>
                        <div className="coins">{coins}</div>
                    </div>
                    {players
                    .map( (player, index, players) => {
                        let position = -1;
                        if(index >= userIndex){
                            position = index - userIndex
                        }else{
                            position = players.length + index - userIndex
                        }
                        return(
                            <PlayerInGame
                                avatar={player[1].avatar}
                                name={player[1].name}
                                cards={player[1].cards}
                                current={player[0]===currentPlayer}
                                position={position}
                                coins={player[1].coins}
                            />
                        )
                    })}
                    
                        <div className="options">
                            {isYourTurn() &&
                            <>
                            {userPlayer[1].coins>0 &&
                            <Button onClick={handlePutCoin} >Put Coin</Button>
                            }
                            <Button onClick={handlePickCard} >Pick Card</Button>
                            </>
                            }   
                        </div>
                    </>
                
            }
        </div>  
    )
};

export default Thanks;
            