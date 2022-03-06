import React from 'react'
import './Cards.scss'
import Card from '../Card/Card'

const Cards = (props) => {
    const cards = joinCards(props.cards)

    function joinCards(cards){
        const cardsMatrix = []
        let cardsLine = []
        for(let i = 0; i<cards?.length; i++){
            cardsLine.push(cards[i])
            if(i === cards.length-1 || cards[i] !== cards[i+1]-1){
                cardsMatrix.push(cardsLine)
                cardsLine = []
            }
        }
        return cardsMatrix
    }

    

    return (
        <div className='cards'>
            {cards?.map( cardSet => {
                return(
                    <div className={`card-set ${cardSet.length > 4 ? 'minimize-space' : ''}`}>
                        {cardSet.map((card, i, cardSet) => {
                            return(
                                <div className={`position-Card ${cardSet.length > 4 ? 'minimize-space' : ''}`}>
                                    <Card number={card} size='small'/>
                                </div>
                            )
                        }).reverse()}
                    </div>
                )
            })}
        </div>
    )
}

export default Cards