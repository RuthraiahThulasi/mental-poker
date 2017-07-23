/* eslint-disable no-console */

import Benchmark from 'benchmark';
import { Game, Player } from '../lib';

const PLAYER_COUNT = 4;

const players = Array.from(new Array(PLAYER_COUNT), () => new Player());
const game = new Game({ players });

const suite = new Benchmark.Suite();

// Output results to the console
suite.on('cycle', (event) => {
  console.log(event.target.toString());
});

suite.add('distributed points generation', () => {
  players.map(player => player.generatePoints());
  game.generateInitialDeck();
});

suite.add('secrets generation', () => {
  players.map(player => player.generateSecrets());
});

suite.add('cascaded shuffling', () => {
  game.players.forEach(player => game.shuffleDeck(player));
});

suite.add('locking the deck', () => {
  game.players.forEach(player => game.lockDeck(player));
});

suite.add('picking a card', () => {
  const cardIndex = game.getRandomPickableCardIndex();

  // This should always measure the worst case scenario where no card can be
  // returned, because the deck was shuffled and locked multiple times
  game.pickCard(cardIndex);
});

console.log(`Started a benchmark simulating a game of ${PLAYER_COUNT} players`);
suite.run();
