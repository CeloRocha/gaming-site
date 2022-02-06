import React from 'react';
import './Title.scss';
const Title = ({className, ...props}) => {
  return(
      <h2 className={`title ${className}`} {...props}></h2>
  )
};

export default Title;
