const express = require('express');
const fetch = require('superagent');

const { setup, checkRemaining, playCardResponse } = require('./gameFunctions');

const auth = require('../auth/middleware');

const newDeckUrl =
	'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

const { Router } = express;

const Game = require('./model');
const User = require('../user/model');

function factory(update) {
	const router = new Router();

	async function onGame(request, response) {
		const { name } = request.body;

		const deck = await fetch.get(newDeckUrl);
		const { deck_id } = deck.body;

		const game = await Game.create({ name, deck_id });

		await update();

		return response.send(game);
	}

	router.post('/game', onGame);

	router.put('/join/:gameId', auth, (req, res, next) => {
		const { gameId } = req.params;
		const { user } = req;

		// console.log('gameId', gameId);
		// console.log('user', user.id);

		User.findByPk(user.id)
			.then(async (user) => {
				if (user) {
					const newUser = await user.update({ gameId }).then();

					return newUser;
				} else {
					res.status(404).send();
				}
			})
			.then(() => update())
			.catch((err) => next(err));
	});

	router.put('/leave/:gameId', auth, (req, res, next) => {
		const { gameId } = req.params;
		const { user } = req;

		// console.log('gameId', gameId);
		// console.log('user', user.id);

		User.findByPk(user.id)
			.then(async (user) => {
				if (user) {
					const newUser = await user.update({ gameId: null }).then();

					return newUser;
				} else {
					res.status(404).send();
				}
			})
			.then(() => update())
			.catch((err) => next(err));
	});

	router.put('/start/:gameId/:deck_id', auth, async (req, res, next) => {
		const { gameId, deck_id } = req.params;
		const attributes = ['id', 'name'];
		const game = await Game.findByPk(gameId, {
			include: [{ model: User, attributes: attributes }]
		});
		if (game) {
			const updatedGame = await game.update({ game_status: 'playing' });
			// console.log(updatedGame)
			const { Users } = updatedGame;

			const players = Users.map((user) => user.dataValues);

			console.log('playersssssssss', players);

			const turnArray = await players.map(player => player.id)
			console.log(turnArray)
			const chance = Math.random()
			let turn = ''
			console.log(chance)
			if (chance > .5) {
				turn = turnArray[0]
			} else {
				turn = turnArray[1]
			}


			const cards = await setup(deck_id, players);
			// console.log('-------cards-----', cards);

			const remaining = await checkRemaining(deck_id)

			const updateGame = await game.update({
				game_info: {
					piles: cards,
					remaining
				},
				game_turn: turn
			});

			await update();
		} else {
			res.status(404).send();
		}
	});

	router.put('/draw/:gameId/:deckId', async (req, res, next) => {
		const { gameId, deckId } = req.params
		const attributes = ['id', 'name']
		const game = await Game.findByPk(gameId, {
			include: [{ model: User, attributes: attributes }]
		})
		if (game) {
			const { Users } = game;
			const players = Users.map((user) => user.dataValues)
			const cards = await setup(deckId, players)
			const remaining = await checkRemaining(deckId)

			await game.update({
				game_info: {
					piles: cards,
					remaining
				}
			})
			await update()
		} else {
			res.status(404).send()
		}
		res.send({ message: 'ok' })
	})

	router.put('/play-card/:gameId/:deckId', async (req, res, next) => {
		console.log('I can hear you---------------------------------------------------------')
		console.log('pile name:', req.body.pileName)
		console.log('card code:', req.body.code)
		console.log('playCard params:', req.params)
		// console.log('playcard deckId:', req.params.deckId)
		const { gameId, deckId } = req.params
		const { pileName, code} = req.body
		const attributes = ['id', 'name']
		const game = await Game.findByPk(gameId, {
			include: [{ model: User, attributes: attributes }]
		})
		if (game) {


			// const { Users } = game;
			// const players = Users.map((user) => user.dataValues)
			const cards = await playCardResponse(deckId, pileName, code)
			const remaining = await checkRemaining(deckId)

			await game.update({
				game_info: {
					piles: cards,
					remaining
				}
			})
			await update()
		} else {
			res.status(404).send()
		}
		res.send({ message: 'ok' })
	})

	return router;
}

module.exports = factory;
