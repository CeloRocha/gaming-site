import React from 'react';
import './Loading.scss'
import Title from '../Title/Title'
const Loading = () => {
  return(
        <div className='loading-animation'>
            <Title className='loading-title'>Loading</Title>
            <div className='loading-dots'>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
            </div>
        </div>  
    )
};

export default Loading;
