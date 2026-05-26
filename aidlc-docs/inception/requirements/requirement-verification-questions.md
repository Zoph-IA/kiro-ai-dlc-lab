# Requirements Verification Questions

Please answer the following questions to help clarify the requirements for Flappy Kiro.

## Question 1
What technology should be used to build the game?

A) HTML5 Canvas + vanilla JavaScript (simple, no dependencies)
B) HTML5 Canvas + TypeScript (type safety, no framework)
C) Phaser.js game framework (feature-rich, larger bundle)
D) p5.js creative coding library (beginner-friendly)
X) Other (please describe after [Answer]: tag below)

[Answer]:  B

## Question 2
What is the target platform for the game?

A) Desktop web browser only
B) Mobile web browser only
C) Both desktop and mobile (responsive)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Should the game use the existing assets in the workspace (ghosty.png, jump.wav, game_over.wav)?

A) Yes — use all existing assets as-is
B) Yes — use existing assets but I may add more later
C) No — I want to use different assets
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
What visual style should the game have?

A) Retro pixel art style (classic Flappy Bird feel)
B) Clean modern minimalist style
C) Colorful cartoon style
D) Dark/spooky theme (matching the ghost character)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
Should the game include any of these additional features beyond core gameplay?

A) Score only (no persistence) — simplest approach
B) Local high score (saved in browser localStorage)
C) Start screen + game over screen with restart button + local high score
D) Full experience: start screen, difficulty progression, high score, sound toggle
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 6
How should the game difficulty behave?

A) Constant difficulty throughout (fixed gap size and wall speed)
B) Gradual increase (walls speed up or gaps shrink over time)
C) Difficulty levels the player can choose before starting
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)
B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
