const superagent = require('superagent');

async function get(url) {
	return superagent(url).timeout({ deadline: 2000 }).catch(console.error)
}

async function setup(deck_id, players) {
	console.log('I am inside setup function')
	const promises = players.map(async (player) => {

		console.log('player');


		const card = await drawACard(deck_id, 4);
		console.log('drawing------------------------------');

		const pile = await addCardToPile(deck_id, player.id, card);
		console.log('setup adding-to-pile-----------------------');

		return pile

	});
	console.log('promises-----0------', promises)
	const bodies = await Promise.all(promises).then().catch(console.error);
	console.log('bodies-------', bodies[0]);


	const pileArray = Object.keys(bodies[0].piles);
	// console.log('pileArray', pileArray);

	const pilesList = await pileArray.map((pileId) =>
		listPiles(deck_id, pileId)
	);

	const piles = await Promise.all(pilesList);

	// console.log('pilesList', piles);
	console.log('piles_________', piles)
	return piles
}

async function playCardResponse(deck_id, pileName, cardCode) {
	console.log('I am inside playCardResponse')
	const discardPileResponse = await playCard(deck_id, pileName, cardCode)
	console.log('playcardresponse drawing------------------------------');
	const pileArray = Object.keys(discardPileResponse.piles)
	const pilesList = await pileArray.map((pileId) =>
		listPiles(deck_id, pileId)
	);
	console.log('listallcards listing------------------------------');


	const piles = await Promise.all(pilesList)
	console.log('pcresponse aftr promiseall------------------------------');


	return piles;
}

async function drawACardForPlayer(deck_id, playerId, players) {
	console.log('I am inside draw card for player')
	// console.log('players-----', players)
	const card = await drawACard(deck_id, 1);

	console.log('drawacard drawing------------------------------');
	const pile = await addCardToPile(deck_id, playerId, card);
	console.log('add to pile adding------------------------------');

	const lister = ['discard', ...players]
	const pilesList = await lister.map((pileId) =>
		listPiles(deck_id, pileId)
	);

	const piles = await Promise.all(pilesList);
	console.log('pcrdraw a card aftr promiseall------------------------------');


	console.log('pilesList', piles);

	return piles;


}

async function takeDiscardResponse(deckId, pileName, discardPileRemaining) {
	console.log('I am inside takeDiscardResponse')
	const discardedCards = await drawCardsFromDiscard(deckId, discardPileRemaining)
	console.log('discarded cards:', discardedCards)
	const cards = discardedCards.cards
	const cardsArray = cards.map(card => card.code)
	const cardString = cardsArray.toString()
	const cardsMoved = await addCardToPile(deckId, pileName, cardString)

	const pileArray = Object.keys(cardsMoved.piles)

	const pilesList = await pileArray.map((pileId) =>
		listPiles(deckId, pileId)
	);
	const piles = await Promise.all(pilesList)
	return piles;
}

async function drawACard(deck_id, numberOfCards) {
	const fetchedCard = await get(
		`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numberOfCards}`
	);
	const cards = fetchedCard.body.cards
	const cardsArray = cards.map(card => card.code)
	console.log('cardsArray', cardsArray)

	const cardString = cardsArray.toString()
	console.log('string', cardString)
	return cardString;
}

async function addCardToPile(deck_id, playerId, card) {
	const playerPile = await get(
		`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${playerId}/add/?cards=${card}`
	);
	return playerPile.body;
}

async function listPiles(deck_id, pileId) {
	const id = pileId;
	console.log(id);
	// console.log(deck_id);

	const listedPile = await get(
		`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileId}/list/`
	);
	// console.log('-----test-',listedPile.body.piles[pileId].cards);
	return { pileId, ...listedPile.body.piles[pileId] };
}

async function checkRemaining(deck_id) {
	const fetchedCard = await get(
		`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=0`
	);
	const remaining = fetchedCard.body.remaining;
	return remaining;
}


async function playCard(deck_id, pileId, cardCode) {
	console.log('cardcode', cardCode)
	console.log('I am inside playCard function')
	const drawFromHand = await get(
		`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileId}/draw/?cards=${cardCode}`
	)
	console.log('draw------------', drawFromHand.body, '--------------')
	const discardPile = await addCardToPile(deck_id, 'discard', cardCode)
	console.log('add---------', discardPile, '----------')
	// console.log('cardcode', cardCode)
	return discardPile
}

async function drawCardsFromDiscard(deckId, discardPileRemaining) {
	console.log('I am inside drawCardFromDiscard')
	// console.log('discardPileRemaining', discardPileRemaining)
	const discardedCards = await get(
		`https://deckofcardsapi.com/api/deck/${deckId}/pile/discard/draw/?count=${discardPileRemaining}`
	)
	return discardedCards.body
}


module.exports = { setup, checkRemaining, drawACardForPlayer, playCardResponse, takeDiscardResponse };

