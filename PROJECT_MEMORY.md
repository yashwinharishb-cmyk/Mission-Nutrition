# Mission Nutrition Project Memory

Use this file at the start and end of each work session so Codex has durable project context.

## How To Use This File

At the start of a session, say:

```text
Read PROJECT_MEMORY.md first, then continue from there.
```

At the end of a session, say:

```text
Update PROJECT_MEMORY.md with what changed, current issues, and next steps.
```

Keep this file short, factual, and current. It should capture the project state, not every small detail.

## Project Overview

Mission Nutrition is a static educational website for a health assignment. The site teaches students how to spot food marketing tricks, read labels, understand food groups, and make balanced nutrition choices.

The project currently uses plain HTML, CSS, and JavaScript. There is no build step or framework.

## Main Files

- `index.html`: Home page.
- `challenge.html`: Food-group challenge page.
- `ad-tricks.html`: Marketing/ad tricks page.
- `quiz.html`: Quiz page shell. Quiz questions are rendered by JavaScript.
- `label-check.html`: Label checking page.
- `food-guide.html`: Food guide page.
- `tracker.html`: Tracker page.
- `missions.html`: Mission/progress page.
- `ideas.html`: Ideas page.
- `script.js`: Shared interactivity, quiz rendering/scoring, tracker logic, mission progress.
- `style.css`: Shared visual styling.
- `Eat (1).png`: Logo/favicon image.

## Current Quiz State

The quiz is rendered from `quizQuestionSets` in `script.js`.

The quiz is no longer one long page. It now works like quiz pages/sets:

- A themed dropdown in the top header bar lets the user choose a quiz set.
- The dropdown is attached to the `Quiz` nav item and only appears on hover or keyboard focus.
- A sticky side panel lists all quiz sets and shows progress for each one.
- Only the selected set is displayed at one time.
- The on-page top box is an info/status panel, not a dropdown menu.
- Answers are saved across sets with `localStorage` using `missionNutritionQuizAnswers`.
- Overall score is still saved with `missionNutritionQuizScore` for the missions page.

Current structure:

- Warm-up Set: 3 original easier questions.
- Set 1: Label Traps.
- Set 2: Serving Size Tricks.
- Set 3: Ingredient Detective.
- Set 4: Ad Logic.
- Set 5: Balanced Choice Challenges.
- Set 6: Food Plate Power.
- Set 7: Food Group Detective.
- Set 8: Label Math Boss.
- Set 9: Drink Check.
- Set 10: Meal Builder Challenge.

Current total: 88 questions.

The score updates automatically by counting `.quiz-card` elements, so adding or removing questions should update the total without changing the score code.

Quiz questions can now use custom multiple-choice answers through a `choices` array on each question. Questions without `choices` still fall back to the old real/trick buttons.

## Current Features

- Static multi-page website.
- Navigation across all pages.
- Quiz with immediate feedback and score tracking.
- Food-group tracker using `localStorage`.
- Mission progress page that combines quiz score and tracker progress.
- Mission progress page now includes mission badges/achievements based on quiz and tracker progress.
- My Mission profile section where the user can type a name and choose a space-themed emoji logo.
- Chosen profile logo appears in the top bar on every page. The name appears only when hovering/focusing the logo, and clicking the logo opens `missions.html#mission-profile`.
- Food Guide page uses the official Canada's Food Guide plate image from `food-guide.canada.ca` and overlays custom labels for vegetables/fruits, whole grains, protein foods, and water.
- My Mission planets use compressed relative sizing so larger planets look larger and smaller planets look smaller. Planet images are cropped into circles so Saturn no longer appears as a rectangle.
- Reset buttons for tracker and mission progress.
- Responsive CSS styling.

## Known Issues / Risks

- PowerShell file reads and `node --check script.js` were unreliable/slow in the OneDrive-backed folder during the latest work.
- The in-app browser was unavailable during the latest verification attempt (`iab` was not available), so visual browser QA was not completed.
- `script.js` was module-loaded through the Node-backed tool and parsed successfully; it stopped at expected browser-only `document` access.
- The site uses `localStorage`, so old saved quiz totals may remain in a user's browser after question-count changes unless mission progress is reset.
- Quiz questions are now easier to maintain, but `script.js` is growing and may eventually need splitting if more features are added.

## Suggested Next Steps

- Add a `Reset Quiz` button on the quiz page.
- Add difficulty labels for question sets: Easy, Medium, Hard.
- Add final result messages based on score ranges.
- Add a review mode for wrong answers.
- Add a timer or challenge mode if the assignment needs more interactivity.
- Visually test `quiz.html`, `missions.html`, and `tracker.html` in a browser after changes.
- Visually test the new mission badges and scaled/circular planet row on desktop and mobile.
- Consider moving quiz question data into a separate file if the quiz grows beyond this size.

## Session Log

### 2026-06-01

- Created `PROJECT_MEMORY.md`.
- Purpose: preserve project context between sessions and give the user a simple file to invoke at session start/end.
- Recent previous work: expanded quiz from 3 questions to 53 questions and grouped the harder questions into numbered sets.

### 2026-06-01 Update

- Changed quiz from one long scrolling page into a set-based quiz view.
- Added themed quiz dropdown menu.
- Added sticky side panel called `Quiz Pages` so users can jump between sets.
- Kept overall score/progress across all 53 questions.
- Added styling for `.quiz-controls`, `.quiz-select`, `.quiz-layout`, `.quiz-side-panel`, `.quiz-tab`, and `.quiz-stage`.

### 2026-06-01 Update 2

- Moved the quiz set dropdown from the page content box into the top header bar.
- Replaced the page content dropdown box with a status/info panel showing current set, answered count, total questions, and correct count.
- Added styles for `.top-quiz-select-wrap`, `.top-quiz-select`, and `.quiz-info-grid`.

### 2026-06-01 Update 3

- Changed the top quiz dropdown so it is hidden by default.
- The dropdown now appears only when hovering over or focusing the `Quiz` item in the top nav.
- Added floating neon menu styling through `.quiz-nav-menu` and updated `.top-quiz-select-wrap`.

### 2026-06-01 Update 4

- Added 35 more questions, bringing the quiz from 53 to 88 questions.
- Added Sets 6-10 about food plate balance, food groups, label math, drinks, and meal building.
- Updated the quiz renderer so questions can have custom answer choices instead of only the same two real/trick buttons.
- Changed 20 older questions to use more specific answer choices.

### 2026-06-01 Update 5

- Renamed visible `My Missions` labels to `My Mission`.
- Added `mission-profile` section on `missions.html`.
- Added profile storage with `missionNutritionProfile`.
- Added top-bar profile badge that displays the selected space emoji logo on all pages.
- The profile name appears only when hovering/focusing the top-bar logo.
- Clicking the top-bar logo navigates to `missions.html#mission-profile`.

### 2026-06-01 Update 6

- Food Guide page now uses the official Canada's Food Guide plate image from the website again.
- Added custom overlay labels on top of the image so the food groups are clear even if the image itself has no labels.

### 2026-06-01 Update 7

- Updated the My Mission level-up section to say "Recommendations and to do" and generate clearer to-do items based on remaining quiz questions and tracker checks.
- Added a Mission badges section on `missions.html`.
- Added badge unlock logic in `script.js` for First Launch, Quiz Cadet, Ad Detective, Snack Builder, Meal Builder, Tracker Master, Label Legend, and Pluto Pilot.
- Added compressed relative planet sizing on the My Mission page.
- Changed planet image styling to circular crops so Saturn and the other planets appear as circles.
- Browser visual QA could not be completed because the in-app browser was unavailable.
