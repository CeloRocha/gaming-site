import React, { useRef, useState, useEffect } from 'react';
import { onValue, ref, set, push, remove, update } from '@firebase/database';
import { db } from '../../services/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import './lobbypage.scss'
import Player from '../../components/Player/Player';
import Button from '../../components/Button/Button';
import gameImg from '../../assets/images/controlerLogo.svg';
import swithGameImg from '../../assets/images/Apps.svg';
import backgroundMessagesImg from '../../assets/images/controler.svg'
import { useAuth } from '../../hooks/useAuth';
import Message from '../../components/Message/Message';
import Loading from '../../components/Loading/Loading';

import closeImg from '../../assets/images/Cross.svg'
import Modal from 'react-modal';
import ThanksRules from '../../components/ThanksRules/ThanksRules';

Modal.setAppElement('#root')

const Lobbypage = () => {

    const navigate = useNavigate()
    const { room } = useParams();
    const { user } = useAuth();
    const [ players, setPlayers ] = useState();
    const [ messages, setMessages ] = useState();
    const [ admin, setAdmin ] = useState();
    const [ game, setGame ] = useState('')
    const [ status, setStatus ] = useState(false)
    const [ start, setStart ] = useState(false)
    const [ endRoom, setEndRoom ] = useState(false)

    const [ modalIsOpen, setModalIsOpen ] = useState(false);

    const dummy = useRef()
    const [ sendMessage, setSendMessage ] = useState('')

    useEffect(() => {
        const roomRef = ref(db, `/rooms/${room}`);
        const unmount = onValue(roomRef, (res) => {
            const roomData = res.val();
            setGame(roomData?.game)
            setAdmin(roomData?.admin)
            setPlayers(Object.entries(roomData?.players))
            if(roomData?.inGame){
                setStart(roomData?.inGame)
            }
            if(roomData?.endRoom){
                setEndRoom(roomData?.endRoom)
            }
            if(roomData?.messages){
                setMessages(Object.entries(roomData?.messages))
            }
        })
        return(()=>{unmount()})
    }, [])

    useEffect(()=>{
        window.addEventListener('beforeunload', handleQuitRoom)

        return () => window.removeEventListener('beforeunload', handleQuitRoom)
    }, [user, admin, room])



    function openModal(){
        setModalIsOpen(true)
    }

    function closeModal(){
        setModalIsOpen(false)
    }

    function afterOpenModal() {
    }

    function protectRoom(){
        if(players.some(player => user.id === player[0])){
            return true
        }else{
            return false
        }
    }

    async function removeRoom(){
        await remove(ref(db, `/rooms/${room}`));
    }

    async function handleQuitRoomWithConfirm() {
        if(window.confirm('Tem certeza que deseja sair da sala?')){
            handleQuitRoom()
        }
    }

    async function handleQuitRoom() {
        if(isAdmin()){
            await set(ref(db, `/rooms/${room}/endRoom`), true)
            await removeRoom()
        }else{
            await remove(ref(db, `/rooms/${room}/players/${user.id}`));
        }
        navigate('/search') 
    }

    async function handleState(){
        setStatus(prevStatus => !prevStatus)
        await update(ref(db, `/rooms/${room}/players/${user.id}`), ({ status: status}))

    }

    async function handleSendMessage(event){
        event.preventDefault()
        await push(ref(db, `/rooms/${room}/messages`), {
            avatar: user.avatar,
            name: user.name,
            id: user.id,
            content: sendMessage
        })
        setSendMessage('')
        dummy.current.scrollIntoView({ behavior: 'smooth'});
    }

    function isAdmin(){
        return admin === user.id ? true : false
    }
    
    function everyoneIsReady(){
        return players?.every(player => {
            return player[1].status
        })
    }

    async function initializeGame(){
        let cards = []
        for (let i = 3; i<=35; i++){
            cards.push(i);
        }
        while(cards.length > 24){
            cards.splice(Math.floor(Math.random()*cards.length), 1)
        }
        cards = cards
            .map(value => ({value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)
        const cardOnTable = cards.pop()

        await set(ref(db, `/games/${room}`), {
            admin: admin,
            cards: cards,
            players: Object.fromEntries(players.map(player =>{
                return [player[0], { avatar: player[1].avatar, name: player[1].name, coins: 11, cards: [] }]
                })),
            cardOnTable: {card: cardOnTable, coins: 0},
            currentPlayer: admin
        })
        await set(ref(db, `/rooms/${room}/inGame`), true )
    }

    async function startGame(){
        await initializeGame();
        navigate(`/thanks/${room}`)
    }

    if(isAdmin){
        if(everyoneIsReady()){
            startGame()
        }
    }else{
        if(start){
            navigate(`/thanks/${room}`)
        }
    }

    if(endRoom){
        removeRoom()
    }

    return(
        <div className='lobby-page' >
            {!endRoom ?
                !players
                ?
                    <Loading />
                :
                    protectRoom()
                    ?
                    <> 
                    <div className='lobby-left'>
                        <div className='lobby-left-upper'>
                            <button onClick={handleQuitRoomWithConfirm} className='lobby-quitLink'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.25 19C11.25 18.5858 11.5858 18.25 12 18.25H18C18.1381 18.25 18.25 18.1381 18.25 18L18.25 6C18.25 5.86193 18.1381 5.75 18 5.75L12 5.75C11.5858 5.75 11.25 5.41421 11.25 5C11.25 4.58579 11.5858 4.25 12 4.25H18C18.9665 4.25 19.75 5.0335 19.75 6V18C19.75 18.9665 18.9665 19.75 18 19.75H12C11.5858 19.75 11.25 19.4142 11.25 19Z" fill="white"/>
                                    <path d="M15.6116 13.1152C15.6116 13.6675 15.1639 14.1152 14.6116 14.1152H9.75562C9.73269 14.4706 9.70399 14.8258 9.66951 15.1805L9.63985 15.4857C9.59162 15.982 9.06466 16.2791 8.61504 16.0637C6.78712 15.1876 5.13234 13.9889 3.73028 12.525L3.70032 12.4937C3.43323 12.2148 3.43323 11.7751 3.70032 11.4962L3.73028 11.4649C5.13234 10.001 6.78712 8.80226 8.61504 7.92625C9.06466 7.71077 9.59162 8.00796 9.63985 8.5042L9.66951 8.8094C9.70399 9.16413 9.73269 9.51928 9.75562 9.8747L14.6116 9.87471C15.1639 9.87471 15.6116 10.3224 15.6116 10.8747V13.1152Z" fill="white"/>
                                </svg>
                                <span>Quit</span>
                            </button>
                            <div className='jogo'>
                                <img src={gameImg} alt="Jogo:" />
                                <h1>{game}</h1>
                            </div>
                        </div>
                        <div className='players'>
                            {players?.map(player => {
                                return(
                                    <Player
                                        avatar={player[1].avatar}
                                        name={player[1].name}
                                        wins={player[1].victory}
                                        status={player[1].status}
                                    />
                                )
                            })}
                        </div>
                        <div className='buttons'>
                            <Button className='options' onClick={openModal}>
                                <img src={swithGameImg} alt="" />
                                <span>Ver regras</span>
                            </Button>
                            
                            <Button onClick={handleState} className='ready ready-button'>Pronto</Button>
                        </div>
                    </div>
                    <div className='lobby-chat'>
                        <img src={backgroundMessagesImg} alt="" className='backgroundMessagesImg'/>
                        <div className='lobby-messages'>
                            {messages?.map((message, index) => {
                                return(
                                    <Message
                                        id={message[1].id}
                                        content={message[1].content}
                                        avatar={message[1].avatar}
                                        name={message[1].name}
                                    />
                                )
                            })}
                            <div ref={dummy}></div>
                        </div>
                        <form onSubmit={handleSendMessage}  className='send-message'>
                            <input
                                type="text"
                                placeholder='Envie uma mensagem.'
                                onChange={ev => setSendMessage(ev.target.value)}
                                value={sendMessage}
                            />
                            
                            <button>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.2428 12.4371C21.4016 12.3489 21.5 12.1816 21.5 12C21.5 11.8184 21.4016 11.6511 21.2428 11.5629L18.9605 10.295C14.464 7.79689 9.72391 5.76488 4.81421 4.2306L4.14914 4.02276C3.99732 3.97532 3.83198 4.00294 3.70383 4.09716C3.57568 4.19138 3.5 4.34094 3.5 4.5V10.25C3.5 10.5159 3.70816 10.7353 3.97372 10.7493L4.98336 10.8025C7.44497 10.932 9.89156 11.2659 12.2979 11.8006L12.5362 11.8536C12.5892 11.8654 12.6122 11.887 12.625 11.9042C12.6411 11.926 12.6536 11.9594 12.6536 12C12.6536 12.0406 12.6411 12.0741 12.625 12.0958C12.6122 12.113 12.5892 12.1347 12.5362 12.1464L12.2979 12.1994C9.89157 12.7341 7.44496 13.068 4.98334 13.1976L3.97372 13.2507C3.70816 13.2647 3.5 13.4841 3.5 13.75V19.5C3.5 19.6591 3.57568 19.8086 3.70383 19.9029C3.83198 19.9971 3.99732 20.0247 4.14914 19.9772L4.81422 19.7694C9.72391 18.2351 14.464 16.2031 18.9605 13.705L21.2428 12.4371Z"/>
                            </svg>
                            </button>
                        </form>
                    </div>
                    </>
                    :
                    <div className='warning'>
                        <h1>Entre na sala da forma correta</h1>
                        <Button onClick={() => navigate('/search')}>Voltar</Button>
                    </div>
            :
            <div className='warning'>
                <h1>O administrador encerrou a sala.</h1>
                <Button onClick={() => navigate('/search')}>Voltar</Button>
            </div>
        }
        <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="Modal"
                overlayClassName="Overlay"
            >
                <button className='closeModal' onClick={closeModal}>
                    <img src={closeImg} alt="Fechar" />
                </button>
                <ThanksRules />
            </Modal>
        </div>
  )
};

export default Lobbypage;
