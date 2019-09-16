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