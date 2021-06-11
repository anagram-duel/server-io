# anagram-duel-server

- This app is can only by played by 2 people in each room.
- Only Host room that can be starting the game when there is any challenger.
- User need to create room again if want to play again.
- There is no time limit when in gameplay.

## Project setup

```
npm install
```

### Run server

# Development

```
npm run dev
```

# Production

```
npm start
```

### Deployment

Frontend: https://duel-anagram.web.app/
Backend: https://anagram-duel.herokuapp.com/

### ** SOCKET **

# createRoom

emit roomsRefresh with [{
hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,
}, hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,]

# roomsFetch

emit roomsRefresh with [{
hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,
}, hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,]

# joinRoom

emit roomsRefresh with [{
hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,
}, hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,]

emit roomsDetailRefresh with {
hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,
}

# gameStart

emit roomsDetailRefresh with {
hostid: socket.id,
hostname: payload,
number: roomNumber,
scrambleWord,
available: true,
gameEnd: false,
gameStart: false,
}

# submitAnswer

emit gameCheck with {
message: < message >
gameEnd: < game status >
}
