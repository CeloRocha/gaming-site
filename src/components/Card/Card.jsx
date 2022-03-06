import React from 'react'
import './Card.scss'

const Card = (props) => {
  return (
    <div className={`card ${props?.size}`}>
        <div className='middle'>
            <span>{props.number}</span>
        </div>
        <span className='top-left'>{props.number}</span>
        <span className='top-right'>{props.number}</span>
        <span className='bottom-left'>{props.number}</span>
        <span className='bottom-right'>{props.number}</span>
    </div>
  )
}

export default Card