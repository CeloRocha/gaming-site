import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import ThanksRules from '../../components/ThanksRules/ThanksRules'
import Title from '../../components/Title/Title'
import './RulesPage.scss'
const RulesPage = () => {
  return (
    <div className='rulesPage'>
      <Navbar />
      <ThanksRules />
    </div>
  )
}

export default RulesPage