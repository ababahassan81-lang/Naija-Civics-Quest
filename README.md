# Naija Civic Quest — 3MTT GD-01 Demo

A fast, playable 2D web quiz game prototype focused on Nigerian civic knowledge, PVCs, voting, government and responsible citizenship.

## Project Goal

Youth lack accessible and engaging civic knowledge. Naija Civic Quest turns basic civic education into a short game loop:

Choose a topic → answer questions → receive instant feedback → earn points → complete the quest.

## Technology

- Phaser 3.90.0
- HTML5
- CSS3
- JavaScript
- Web browser

## How to Run

### Fastest method
Open `index.html` in a modern browser.

If your browser blocks local JavaScript/CDN behavior, use a small local web server.

### Python local server

From this folder:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

### VS Code
Install the Live Server extension, right-click `index.html`, and choose "Open with Live Server".

## Controls

- Mouse/touch: click an answer button
- No keyboard controls are required

## Current Features

- Main menu
- How-to-play screen
- Topic selection
- 2D quiz interface
- 12 Nigerian civic questions
- Randomized question order
- Score system
- Correct/incorrect feedback
- Civic explanations
- Results screen
- Replay and main-menu navigation
- Responsive Phaser canvas

## Demo Video

For the 2–3 minute 3MTT demo:

1. Show the title screen.
2. Explain the civic-knowledge problem.
3. Start the quest.
4. Choose a topic.
5. Answer several questions, including one correct and one incorrect answer.
6. Show the instant explanation and score.
7. Complete the quiz and show the results screen.
8. Briefly explain the technology and possible future features.

## Future Improvements

- Character movement and interactive polling-unit environment
- More question packs
- Badges and achievements
- Sound effects and background music
- Local high-score storage
- Nigerian language support
- Android build
- Accessibility improvements
- Teacher/admin question management
- Online leaderboard

## 3MTT Submission Checklist

- [ ] Test the game in a browser
- [ ] Record 2–3 minute gameplay video
- [ ] Add team/member information
- [ ] Zip this project folder
- [ ] Submit runnable project/source code
- [ ] Include the README
