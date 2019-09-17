const fetch = require('superagent')


 async function drawACard (deck_id, players)  {
  const promises = players.map(async (player) => {
    console.log("playerrrrr", player)
    const fetchedCard = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
    const card = await fetchedCard.body.cards[0].code
    const playerPile = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player.id}/add/?cards=${card}`)
    console.log('playerPile',playerPile.body)
    return playerPile.body
  })

  const bodies = Promise.all(promises)
  return bodies 

  


  // for (player in players){
  //   console.log("playerrrrr", player)
  //   const fetchedCard = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
  //   const card = await fetchedCard.body.cards[0].code
  //   const playerPile = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player.id}/add/?cards=${card}`)
  //   console.log('playerPile',playerPile.body)
  //   array.push(playerPile.body)
  // }
    return console.log(array)
  
  // return console.log("array------------------------",array)
}



module.exports = {drawACard}