import React from 'react';
import './button.scss'

const Button = (props) => {
  return(
    <button className='button' {...props}></button>
  )
};

export default Button;
