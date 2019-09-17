const express = require('express');

const auth = require('../auth/middleware');

const { Router } = express;

const Game = require('./model');
const User = require('../user/model');

function factory(update) {
	const router = new Router();

	async function onGame(request, response) {
		const { name } = request.body;

		const game = await Game.create({ name });

		await update();

		return response.send(game);
	}

	router.post('/game', onGame);

	router.put('/join/:gameId', auth, (req, res, next) => {
		const { gameId } = req.params;
		const { user } = req;

		console.log('gameId', gameId);
		console.log('user', user.id);

		User.findByPk(user.id)
			.then(async (user) => {
				if (user) {
					const newUser = await user.update({gameId}).then();

					return newUser;
				} else {
					res.status(404).send();
				}
			})
			.catch((err) => next(err));
	});

	return router;
}

module.exports = factory;
