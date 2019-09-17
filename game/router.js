const express = require('express');

const { Router } = express;

const Game = require('./model');

function factory(update) {
	const router = new Router();

	async function onGame(request, response) {
		const { name } = request.body;

		const game = await Game.create({ name });

		await update();

		return response.send(game);
	}

	router.post('/game', onGame);

	router.put('/join/:gameId', (req, res, next) => {
    const { gameId } = req.params;
    console.log('gameId', gameId)
		// User.findByPk(gameId)
		// 	.then((game) => {
		// 		if (game) {
		// 			console.log('game:',game)
		// 		}
		// 		res.status(404).send();
		// 	})
		// 	.catch((err) => next(err));
	});

	return router;
}

module.exports = factory;
