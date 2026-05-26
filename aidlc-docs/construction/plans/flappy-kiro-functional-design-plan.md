# Functional Design Plan — Flappy Kiro

## Functional Design Questions

Please answer the following questions to guide the detailed business logic design.

### Question 1
What canvas size should the game use?

A) 480 x 640 (portrait, mobile-inspired)
B) 800 x 600 (landscape, classic desktop)
C) 960 x 540 (16:9 widescreen)
D) Responsive — fill the browser window
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 2
How should Ghosty's physics feel?

A) Floaty — slow gravity, gentle flap (forgiving, casual feel)
B) Snappy — strong gravity, strong flap (responsive, arcade feel like original Flappy Bird)
C) Balanced — moderate gravity and flap (middle ground)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 3
How should the difficulty progression curve work?

A) Linear — constant increase per point scored (e.g., +2% speed per point)
B) Stepped — difficulty jumps at milestones (e.g., every 5 points)
C) Logarithmic — fast early increase that plateaus (hard quickly, then stabilizes)
D) Exponential — slow early increase that ramps up later (easy start, punishing later)
X) Other (please describe after [Answer]: tag below)

[Answer]: L

---

## Functional Design Execution Plan

Once questions are answered, the following steps will be executed:

- [ ] Step 1: Define game physics model (gravity, flap force, velocity caps, collision boxes)
- [ ] Step 2: Define wall generation rules (spacing, gap sizing, randomization bounds)
- [ ] Step 3: Define difficulty progression formulas (speed curve, gap curve, spawn rate)
- [ ] Step 4: Define state machine transitions and business rules
- [ ] Step 5: Define scoring rules and persistence logic
- [ ] Step 6: Define audio trigger rules
- [ ] Step 7: Identify testable properties for PBT (PBT-01 compliance)
- [ ] Step 8: Generate functional design artifacts
