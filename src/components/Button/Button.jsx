import React from 'react';
import './button.scss'

const Button = ({className, ...props}) => {
  return(
    <button className={`button ${className}`} {...props}></button>
  )
};

export default Button;
