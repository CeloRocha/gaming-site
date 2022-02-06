import React from 'react';
import { useState, useEffect } from 'react'
import { db } from '../../services/firebase'
import { ref, set, get, child} from "firebase/database";
import Player from '../Player/Player';
import './leaderboard.scss'
import Title from '../Title/Title';
const Leaderboard = () => {

    const [ leaders, setLeaders ] = useState()

    useEffect(() => {

        async function load(){
            const dbRef = ref(db)
            const roomRef = await get(child(dbRef, `users`))
            const dataPlayers = Object.entries(roomRef.val())
            console.log(dataPlayers, 'dP')
            const sortedDataPlayers = dataPlayers.sort((playerA, playerB) =>{
                return playerB[1].victory - playerA[1].victory;
            })
            console.log(sortedDataPlayers, 'sdp')
            const finalPlayers = sortedDataPlayers.slice(0, 9)
            setLeaders(finalPlayers)
        }
        load()
    }, [])
    return(
        <section className='leaderboard'>
            <Title>Melhores Jogadores:</Title>
            <div className='leaders'>
            {leaders?.map((leader) => {
                return(
                    <Player 
                        avatar={leader[1].avatar}
                        name={leader[1].name}
                        wins={leader[1].victory}
                    />
                )
            })}
            </div>
        </section>
    )
};

export default Leaderboard;
