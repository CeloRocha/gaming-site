
/*
    players =
        [
            {
                [
                    uid, 
                    {
                        info: {avatar: avatar, name: nome},
                        game: {cards: [...card], coins: value}
                    }
                ]
            }
        ]
*/

import { child, get, onValue, ref, set, update, off } from "@firebase/database";
import { useParams } from "react-router";
import { db } from "../services/firebase";
import { useState, useEffect } from "react";

export function useGame(){

    const { room } = useParams();
    const [ cards, setCards ] = useState([])
    const [ cardOnTable, setCardOnTable ] = useState({card: '', coins: 0})
    const [ players, setPlayers ] = useState()
    const [ currentPlayer, setCurrentPlayer ] = useState('')
    const [ finish, setFinish ] = useState(false)
    const [ quit, setQuit ] = useState(false)

    useEffect(() => {
        const roomRef = ref(db, `/games/${room}`);
        const unmount = onValue(roomRef, (res) => {
            if(!finish){
                const roomData = res.val();
                setPlayers(Object.entries(roomData.players))
                setCurrentPlayer(roomData?.currentPlayer)
                setCardOnTable(roomData?.cardOnTable)
                setCards(roomData?.cards)
                if(roomData?.finishGame){
                    setFinish(roomData.finishGame)
                }
                if(roomData?.quit){
                    setQuit(roomData.quit)
                }
            }
        })
        return(()=>off(roomRef))
    }, [])

    async function initializeGame(admin, players){
        let cards = []
        for (let i = 3; i<=35; i++){
            cards.push(i);
        }
        while(cards.length > 24){
            cards.splice(Math.floor(Math.random()*cards.length), 1)
        }
        cards = cards
            .map(value => ({value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value)

        await set(ref(db, `/games/${room}`), {
            admin: admin,
            cards: cards,
            players: Object.fromEntries(players.map(player =>{
                return [player[0], { avatar: player[1].avatar, name: player[1].name, coins: 11, cards: [] }]
                })),
            cardOnTable: {card: '', coins: 0},
            currentPlayer: admin
        })
        await set(ref(db, `/rooms/${room}/inGame`), true )
    }

    async function nextCard(){
        const cardsCopy = cards.slice()
        const newCardOnTable = cardsCopy.pop()
        await set(ref(db, `/games/${room}/cards`), cardsCopy)
        await set(ref(db, `/games/${room}/cardOnTable`), {card: newCardOnTable, coins: 0})
        return cardOnTable
    }

    async function putCoin(playerId){
        const player = players.find(player => {
            return player[0] === playerId
        })
        const newCoins = player[1].coins - 1
        const updates = {}
        updates['/cardOnTable'] = {card: cardOnTable.card, coins: cardOnTable.coins+1}
        updates[`/players/${playerId}/coins`] = newCoins
        updates['/currentPlayer'] = await nextPlayer()
        await update(ref(db, `/games/${room}`), updates)
        return cardOnTable
    }

    async function pickCard(playerId){
        if(cardOnTable.card === '') { return false}

        const player = players.find(player => {
            return player[0] === playerId
        })
        player[1].coins += cardOnTable.coins
        const cards = []
        if(player[1]?.cards){
            cards.push(...player[1].cards)
        }
        cards.push(cardOnTable.card)
        player[1]['cards'] = cards
        cards.sort((a,b) => {
            return a-b
        })
        const updates = {}
        updates['/cardOnTable'] = { card: '', coins: 0 }
        updates[`/players/${playerId}`] = player[1]
        await update(ref(db, `/games/${room}`), updates)
        if(continueGame()){
            await nextCard()
        }
        return
    }
    
    async function nextPlayer(){
        let actualIndex = -1;
        players.forEach((player, index) => {
            if(player[0] === currentPlayer){
                actualIndex = index
            }
        });
        let newCurrentPlayer = ''
        if(actualIndex < players.length-1){
            newCurrentPlayer = players[actualIndex+1][0]
        }else{
            newCurrentPlayer = players[0][0]
        }
        return newCurrentPlayer
    }

    async function continueGame(){
        if(!cards){
            const finalPlayers = Object.fromEntries(players.map(player => {
                const points = countPoints(player)
                return [player[0], {...player[1], points: points}]
            }))
            const updates = {}
            updates['/finishGame'] = true
            updates[`/players`] = finalPlayers
            await update(ref(db, `/games/${room}`), updates)
            return false
        }else{
            return true
        }
    }

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

    function countPoints(player){
        const formatedCards = joinCards(player[1]?.cards)
        const points = formatedCards.reduce(
            (previousValue, currentValue) => previousValue + currentValue[0],
            0
        );
        const finalPoints = points - player[1].coins
        return finalPoints
    }

    return {
        cards,
        cardOnTable,
        players,
        currentPlayer,
        finish,
        quit,
        nextCard,
        putCoin,
        pickCard,
        joinCards
    }
}