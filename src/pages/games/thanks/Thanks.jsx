import React, { useState, useEffect} from 'react';
import './Thanks.scss'
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { onValue, ref, get, child, remove, update } from '@firebase/database';
import { db } from '../../../services/firebase';
import { useGame } from '../../../hooks/useGame';
import Button from '../../../components/Button/Button'
import Title from '../../../components/Title/Title';
import Loading from '../../../components/Loading/Loading';
const Thanks = () => {

    const navigate = useNavigate()
    const { room } = useParams();
    const { user } = useAuth();
    const [ admin, setAdmin ] = useState();
    const { players, currentPlayer, cards, cardOnTable, finish, nextCard, putCoin, pickCard} = useGame();

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

    if(finish && isAdmin()){
        handleFinish()
        console.log('passing')
    }else{
        console.log('not')
    }

    const showCurrentPlayer = players?.find( player => {
        return player[0] === currentPlayer
    })


    return(
        <div className='thanks-game-page'>
            {finish
            ?
            <>
            {players.sort((playerA, playerB) => {
                return playerA[1].points - playerB[1].points
            })
            .map((player, index) => {
                return(
                    <div>
                        {index === 0 && <Title>Winner:</Title>}
                        <h1>{player[1].name}, with {player[1].points}</h1>
                    </div>
                )
            })}
            <Button onClick={quitGame}>Go back to lobby</Button>
            </>
            :
                !players 
                ?
                    <Loading />
                :
                    <>
                    <h1>Card: {cardOnTable.card}</h1>
                    <h1>Coins: {cardOnTable.coins}</h1>
                    {showCurrentPlayer && <Title>{showCurrentPlayer[1].name}</Title> }
                    <Button onClick={handleNextCard}>Next Cards</Button>
                    <Button onClick={handlePutCoin} >Put Coin</Button>
                    <Button onClick={handlePickCard} >Pick Card</Button>
                    {players.map(player => {
                        return(
                            <h1>{player[1].name}: {player[1].coins} coins</h1>
                            )
                        })}
                    </>
                
            }
        </div>  
    )
};

export default Thanks;
            