const fetch = require('superagent');

async function setup(deck_id, players) {
	const promises = players.map(async (player) => {
		console.log('player');
		const card = await drawACard(deck_id, 1);
		console.log('drawing');
    const pile = await addCardToPile(deck_id, player.id, card);
    
    
  
		return pile
	});

	const bodies = await Promise.all(promises).then().catch(console.error);
	// console.log('bodies-------', bodies[0]);

	const pileArray = Object.keys(bodies[0].piles);
	// console.log('pileArray', pileArray);

	const pilesList = await pileArray.map((pileId) =>
		listPiles(deck_id, pileId)
	);

	const piles = await Promise.all(pilesList);

	// console.log('pilesList', piles);

  

	return piles
}

async function drawACard(deck_id, numberOfCards) {
	const fetchedCard = await fetch(
		`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numberOfCards}`
	);
	const card = await fetchedCard.body.cards[0].code;
	return card;
}

async function addCardToPile(deck_id, playerId, card) {
	const playerPile = await fetch(
		`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${playerId}/add/?cards=${card}`
	);
	return playerPile.body;
}

async function listPiles(deck_id, pileId) {
	const id = pileId;
	console.log(id);
	console.log(deck_id);

	const listedPile = await fetch(
		`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileId}/list/`
	);
	// console.log('-----test-',listedPile.body.piles[pileId].cards);
	return { pileId, ...listedPile.body.piles[pileId] };
}

async function checkRemaining(deck_id) {
	const fetchedCard = await fetch(
		`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=0`
	);
  const remaining = await fetchedCard.body.remaining;
	return remaining;
}

module.exports = { setup, checkRemaining };
