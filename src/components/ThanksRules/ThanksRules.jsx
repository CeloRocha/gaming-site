import React from 'react'
import Title from '../Title/Title'
import './ThanksRules.scss'
const ThanksRules = () => {
  return (
    <section className='thanksRules'>
        <Title className='style'>No, Thanks!</Title>

        <h3>Visão geral</h3>
        <p>
          Neste jogo, você deve ganhar o mínimo de pontos possível. Cada carta vale seu valor de face.
          Você começa com uma mão de moedas. Essas moedas são subtraídas de sua pontuação total final,
          mas você precisa delas para evitar pegar cartas de alta pontuação que não deseje.
        </p>
        <p>
          Você inicia sua vez com uma carta revelada do baralho. Se pegar a carta, a carta irá para a
          sua área de jogo com todas as moedas colocadas na mesa e outra carta é revelada para substituí-la.
          Se não quiser a carta, apenas coloque uma ficha sobre ela e a vez passa para o próximo jogador.
          Quando decidir pegar cartas, tente formar sequências numéricas. Cada sequência é pontuada apenas pela
          carta de menor valor nela presente.
        </p>

        <h3>Componentes</h3>
        <ul>
          <li>
            São 33 cartas (numeradas de 3 a 35), das quais 9 serão retiradas aleatóriamente
            antes do jogo começar.
          </li>
          <li>
            Moedas serão distribuidas no começo do jogo para todos, o número depende da
            quantidadede jogadores (você poderá apenas ver quantas moedas apenas você tem).
          </li>
        </ul>

        <h3>Como jogar</h3>
        <p>
          Em sua vez, você pode escolher entre:
          <ol>
            <li>
              Colocar uma moeda sobre a carta ativa e passar ao próximo jogador.
              Você não pode passar se não tiver uma moeda para colocar.
            </li>
            <li>
              Pegar a carta ativa e colocá-la em sua área de jogo. Além disto, pegue as moedas
              sobre a carta. Uma nova carta será revelada e será sua vez novamente, para escolher
              sua ação.
            </li>
          </ol>
        </p>

        <h3>Fim do jogo</h3>
        <p>
          O jogo terminar quando a última carta for pega e não sobrar nenhuma no baralho.
        </p>

        <h3>Dicas</h3>
        <ul>
          <li>
            É muito raro um jogador terminar o jogo sem pegar nenhuma carta.
            Geralmente é melhor pegar uma carta com algumas moedas, do que ser obrigado
            a pegar uma carta por não ter mais fichas restantes.
          </li>
          <li>
            Jogadores experientes saberão quando passar uma carta que eles qurem, sabendo que os
            outros não a quererão. Passar uma carta ao redor da mesa uma ou duas vezes, rapidamente,
            aumentará a quantidade de moedas que você pode, então, coletar. Mas cuidado, outros jogadores
            poder querer ou serem obrigados a pegar sua carta e você desejará tê-la pego quando teve a chance.
          </li>
          <li>
            Não se esqueça que há 9 cartas que são removidas do jogo antes do início. Tentar completar uma
            lacuna de uma carta pode ser impossível, mas a chance de não conseguir aumenta quando maior a
            lacuna. Nunca se sabe quais cartas estão fora.
          </li>
        </ul>
        <p>
          Cada carta em sua área de jogo vale seu valor de face em pontos. Mas não vale nada
          se a carta fizer parte de uma sequência. Montar conjuntos de sequências de cartas
          possibilita uma substancial redução dos pontos
        </p>
      </section>
  )
}

export default ThanksRules