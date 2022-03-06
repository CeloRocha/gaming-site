import React from 'react';
import { db } from '../../services/firebase';
import { ref, set, get, push, child} from "firebase/database";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Title from '../../components/Title/Title'
import refreshImg from '../../assets/images/Refresh.svg'
import './SearchLobbyPage.scss'
import Button from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import LobbyItem from '../../components/LobbyItem/LobbyItem';
import {  useNavigate } from 'react-router';
const SearchLobbyPage = () => {

    const navigate = useNavigate()
    const { user } = useAuth()
    const [ newGameName, setNewGameName ] = useState('')
    const [ newGamePassword, setNewGamePassword ] = useState('')
    const [ search, setSearch ] = useState('')
    const [ gamesData, setGamesData ] = useState()

    async function getLobbys(){
        const dbRef = ref(db)
        const rooms = await get(child(dbRef, `/rooms`))
        const dataRooms = Object.entries(rooms.val())
        setGamesData(dataRooms)
    }

    useEffect(() => {
        getLobbys();
    }, [])

    async function handleCreateRoom(event){
        event.preventDefault()
        const { key } = await push(ref(db, `/rooms`), {
            name: newGameName,
            admin: user.id,
            password: newGamePassword,
            adminName: user.name,
            players: { [user.id]: {
                avatar: user.avatar,
                name: user.name,
                id: user.id,
                victory: user.victory,
                status: false
            }},
            game: 'Thanks'
        })
        navigate(`/lobby/${key}`)
    }

    const filteredGames = gamesData?.filter( game => {
        return game[1].name.toLowerCase().includes(search.toLowerCase())
    })

    const games = filteredGames?.map( game => {
        return(
            <LobbyItem
                key={game[0]}
                id={game[0]}
                name={game[1].name}
                admin={game[1].adminName}
                game={game[1].game}
                players={game[1]?.players ? Object.entries(game[1]?.players).length : 0}
                password={game[1].password}
            />
        )
    })

    return(
        <div className='searchLobby-page'>
            <Navbar />
            <Title className='ready'>Crie uma sala:</Title>
            <form onSubmit={handleCreateRoom}>
                <div>
                    <label htmlFor='roomName'>Sala:</label>
                    <input
                        type="text"
                        id='roomName'
                        placeholder='Nome da sala.'
                        onChange={ev => {setNewGameName(ev.target.value)}}
                        value={newGameName}
                    />
                </div>
                <div>
                    <label htmlFor="roomPassword">Senha:</label>
                    <input
                        type="password"
                        id='roomPassword'
                        placeholder='Senha (não obrigatório).'
                        onChange={ev => {setNewGamePassword(ev.target.value)}}
                        value={newGamePassword}
                    />
                </div>
                <Button className='ready' type='submit'>Crie uma sala</Button>
            </form>
            <span className='separator'>OU</span>
            <Title className='ready'>Encontre uma sala:</Title>
            
                <div className='searchLobby-div'>
                    <div className='searchLobby-top'>
                        <input
                            type="text"
                            onChange={event => setSearch(event.target.value)}
                            value={search}
                            placeholder='Digite o nome da sala.'
                        />
                        <button onClick={getLobbys}>
                            <img src={refreshImg} alt='Refresh' />
                        </button>
                    </div>
                    {games
                    ?
                        <section className='searchLobby-games'>
                            {games}
                        </section>
                    :
                        <div className='searchLobby-noRooms'>
                            <span>Ainda não há nenhuma sala.</span>
                        </div>
                    }
                </div>
        </div>
    )
};

export default SearchLobbyPage;
