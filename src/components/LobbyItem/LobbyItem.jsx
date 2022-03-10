import { useState } from 'react';
import { db } from '../../services/firebase';
import { set, ref } from '@firebase/database';
import { useNavigate } from 'react-router-dom';
import './LobbyItem.scss'
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button/Button';
import lockImg from '../../assets/images/Lock.svg'
import closeImg from '../../assets/images/Cross.svg'
import Modal from 'react-modal';

Modal.setAppElement('#root')

const LobbyItem = (props) => {

    const navigate = useNavigate()
    const { user } = useAuth();
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ inputPassword, setInputPassword ] = useState('');
    const [ showPasswordSpan, setShowPasswordSpan ] = useState(false);

    function handleClick(){
        navigate('/login')
    }

    function openModal(){
        setModalIsOpen(true)
    }

    function closeModal(){
        setModalIsOpen(false)
    }

    function afterOpenModal() {
        setShowPasswordSpan(false)
    }


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
        if(!user){
            navigate('/login')
        }else{
            if(props.players < 6){
                if(props.password != ''){
                    openModal()
                }else{
                    enterRoom()
                }
            }
        }
    }

    function testPassword(event){
        event.preventDefault()
        if(inputPassword === props.password){
            enterRoom()
        }else{
            setShowPasswordSpan(true)
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
                <h3>Sala: {props.name}</h3>
                <form onSubmit={testPassword}>
                    <input
                        placeholder='Digite a senha.'
                        onChange={ev => setInputPassword(ev.target.value)}
                        value={inputPassword}
                    />
                    {showPasswordSpan && <span>Senha errada, verifique novamente.</span>}
                    <Button className='options'>Entrar</Button>
                </form>
            </Modal>
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