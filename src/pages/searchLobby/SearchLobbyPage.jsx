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
const SearchLobbyPage = () => {

    const { user } = useAuth()
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


    async function handleCreateRoom(){
        const response = await push(ref(db, `/rooms`), {
            name: 'My New Room', admin: user.id, password: '', adminName: user.name, players: [user], game: 'Thanks'
        })
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
                players={game[1].players.length}
                password={game[1].password}
            />
        )
    })

    return(
        <div className='searchLobby-page'>
            <Navbar />
            <Button className='ready' onClick={handleCreateRoom}>Crie uma sala</Button>
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
                <section className='searchLobby-games'>
                    {games}
                </section>
            </div>
        </div>
    )
};

export default SearchLobbyPage;
