import React from 'react';
import { useState, useEffect } from 'react'
import { db } from '../../services/firebase'
import { ref, get, child} from "firebase/database";
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
            const sortedDataPlayers = dataPlayers.sort((playerA, playerB) =>{
                return playerB[1].victory - playerA[1].victory;
            })
            const finalPlayers = sortedDataPlayers.slice(0, 9)
            setLeaders(finalPlayers)
        }
        load()
    }, [])
    return(
        <section className='leaderboard'>
            <Title>Melhores Jogadores</Title>
            <div className='leaders'>
            {leaders?.map((leader, index) => {
                return(
                    <Player 
                        key={index}
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
