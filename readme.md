front-end ROUTES:

users/:id ?
users/

lobby/id
lobby

login/
sign-up/

BACKEND ROUTES:

create a game_session
delete a game_session
get all game_sessions
get a game_session by ID

create a user / sign-up

login





game session keeps track of:

deck-pile
discard pile 
destroyed-pile

player->
facedown_pile
face-up_pile
hand_pile



user {
  id: int
  name: string
  password: string 
  game_session__id

}

game_session {
  id: int
  deck_id: int 
}

Schema
User
name - string
password - string

Game
deck_id - string
status - 'joining', 'playing', 'done'

Relations
User.belongsTo(Game)
Game.hasMany(User)

Frontend

/ - list of games, login form, signup form, create game

/game/:id
game details
if (game.status === 'joining') join game
if (game.status === 'joining' && game.users.length > 1) start game

Backend

POST /signup
User.create

POST /login
User.find

GET /stream

POST /game
Game.create

PUT /join/:gameId
const { gameId } = req.params
const game = await Game.findByPk(gameId)
if (game.status === 'joining') {
  const user = await User.findByPk(req.userId)
  await user.update({ gameId })
}

PUT /start/:gameId
const { gameId } = req.params
const game = await Game.findByPk(gameId)
if (game.status === 'joining') {
  await game.update({ status: 'playing' })
  const { deck_id } = await request.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
')
  await game.update({ deck_id })

  await https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/discard/add/?cards=AS,2S

  const users = User.find({ where: { gameId } })
  const promises = user.map(async user => {
    const cards = await request.get('https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
')

    const hand = cards.slice(0, 3).join(',')
    const up = cards.slice(3, 6)
    const down = cards.slice(6, 9)

    const handId = `hand${user.id}`
    const upId = `up${user.id}`
    const downId = `down${user.id}`

    await request.get('https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=<hand>
')
  })

  Promise.all(promises)
}

PUT /play/:cards/:pile
const { cards, pile } = req.params
const { userId } = req
const pileId = `${userId}${pile}`

// Take out of user's pile
await request.get(https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/draw/?cards=<cards>
)

const card = cards.slice(0, 2)

if (card === '10' || cards.length === 11) {
  // destroy
  // 1. List decks contents
  // 2. Remove as many cards as are remaining
} else {
  // Put into discard pile
  await https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/discard/add/?cards=<cards>
}

async function update () {
  const games = await Game.findAll()

  const data = []

  const promises = games.map(async game => {
    const game.discard = await request.get('https://deckofcardsapi.com/api/deck/<game.id>/pile/discard/list')
    game.users = []

    const users = User.find({ where: { gameId: game.id }})
    const promises = users.map(async user => {
      const handId = ....
      user.hand = await request.get('https://deckofcardsapi.com/api/deck/<game.id>/pile/<handId>/list')

      const upId = ....
      const downId = ....

      game.users.push(user)
    })

    Promise.all(promises)

    data.push(game)
  })
  Promise.all(promises)

  stream.send(data)
}

Reducers
games - stream data
user = { jwt, userId }