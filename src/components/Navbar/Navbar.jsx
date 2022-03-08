import './navbar.scss'
import logoImg from '../../assets/images/controlerLogo.svg'
import { useNavigate, Link } from 'react-router-dom';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';


const Navbar = () => {
  const { uploadImg } = useAuth();
  const navigate = useNavigate();
  const { user, handleSignOut } = useAuth();

  function handleClick(){
    navigate('/login')
  }

  return(
    <header className='header'>
        <div className='logo'>
            <img src={logoImg} alt='Logo' />
            <h1>Crams Games</h1>
        </div>
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/search'>Salas</Link>
            <Link to='/rules'>Regras</Link>
        </nav>
        { user 
        ?
        <div className={`user ${!user.verified ? 'needVerify' : 'verified'}`}>
          <img src={user.avatar} alt="this" referrerPolicy='no-referrer' />
          <h1>{user.name}</h1>
          <Button  onClick={handleSignOut}>Sign Out</Button>
          <div className='user-info'>
            <span>Vitórias: {user.victory}</span>
            <label htmlFor="changeAvatar">
              Troque sua imagem
            </label>
            <input
                type='file'
                accept='image/jpg'
                onChange={event => uploadImg(event.target.files[0])}
                id='changeAvatar'
            />
          </div>
        </div>
        :
        <Button onClick={handleClick}>Sign Up</Button>
        }
    </header>
  )
};

export default Navbar;
