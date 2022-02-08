import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Message.scss'
const Message = (props) => {

    const { user } = useAuth()

    return(
        <div className={`message ${user.id === props.id ? 'send' : 'received'}`}>
            <p>{props.content}</p>
            <div>
                <img src={props.avatar} alt="" referrerPolicy='no-referrer'/>
                <span>{props.name}</span>
            </div>
        </div>
  )
};

export default Message;
