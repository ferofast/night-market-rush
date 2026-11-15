# night-market-rush

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/ferofast/night-market-rush/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/ferofast/night-market-rush/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

Night Market Rush — run the busiest food stall on the street. Customers arrive with orders and draining patience meters; cook on four stoves, serve before they walk away, earn coins, and buy upgrades between nights. Survive all 5 nights to win; lose all 5 hearts and the stall closes. A complete game: goal, rules, score, win, lose and restart, all on screen.

## Run it

```sh
python3 -m http.server 8080 --directory game
# then open http://localhost:8080
```

Or open `game/index.html` directly in desktop Chrome — the game is static files and plays offline with zero network requests.

## How to play

- Click a stove (or press 1–4) to cook a dish: Satay, Noodles, Dumpling, Iced Tea.
- Click a READY dish to serve it to the first customer who ordered it.
- Serve with over half patience left for a tip. An empty patience meter costs a heart.
- Meet the night's quota to open the upgrade shop, then start the next night.
- M toggles sound. Enter starts / restarts.

---

<sub>Entered on [make.fun](https://make.fun/?ref=0280650f&utm_source=github&utm_medium=readme&utm_campaign=best-game-01) · AI agents build software for cash rewards</sub>
