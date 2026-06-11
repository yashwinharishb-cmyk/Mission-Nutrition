const trackerRows = document.querySelectorAll(".check-row");
const trackerMessage = document.getElementById("tracker-message");
const resetButton = document.getElementById("reset-tracker");
const quiz = document.getElementById("quiz");
let quizScore = document.getElementById("quiz-score");
const topQuizSelect = document.getElementById("top-quiz-select");
const topQuizList = document.getElementById("top-quiz-list");
const missionPage = document.querySelector(".missions-page");
const resetMissionsButton = document.getElementById("reset-missions");
const storageKey = "challenge234FoodGroupsProgress";
const quizStorageKey = "missionNutritionQuizScore";
const quizAnswersStorageKey = "missionNutritionQuizAnswers";
const profileStorageKey = "missionNutritionProfile";
const adLabStorageKey = "missionNutritionAdLab";
const messages = [
  "Start with one food group.",
  "Nice start. Food groups tell you more than slogans.",
  "You are halfway there.",
  "Great progress. You are choosing balance over brand hype.",
  "Challenge complete for today."
];

function getProfile() {
  return {
    logo: "🚀",
    name: "Mission pilot",
    ...loadJson(profileStorageKey)
  };
}

function saveProfile(profile) {
  saveJson(profileStorageKey, profile);
}

function renderTopProfile() {
  const header = document.querySelector(".site-header");
  if (!header || document.querySelector(".user-badge")) return;

  const profile = getProfile();
  const badge = document.createElement("a");
  badge.className = "user-badge";
  badge.href = "missions.html#mission-profile";
  badge.setAttribute("aria-label", "Open My Mission profile settings");
  const icon = document.createElement("span");
  icon.className = "user-badge__icon";
  icon.textContent = profile.logo;
  const name = document.createElement("span");
  name.className = "user-badge__name";
  name.textContent = profile.name;
  badge.append(icon, name);
  header.appendChild(badge);
}

function updateTopProfile() {
  const profile = getProfile();
  document.querySelectorAll(".user-badge__icon").forEach((item) => item.textContent = profile.logo);
  document.querySelectorAll(".user-badge__name").forEach((item) => item.textContent = profile.name);
  const previewIcon = document.getElementById("profile-preview-icon");
  const previewName = document.getElementById("profile-preview-name");
  const profileNameInput = document.getElementById("profile-name");
  if (previewIcon) previewIcon.textContent = profile.logo;
  if (previewName) previewName.textContent = profile.name;
  if (profileNameInput) profileNameInput.value = profile.name === "Mission pilot" ? "" : profile.name;
  document.querySelectorAll(".logo-picker button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.logo === profile.logo);
  });
}

function setupProfileEditor() {
  const profileForm = document.getElementById("profile-form");
  if (!profileForm) return;

  const profileNameInput = document.getElementById("profile-name");
  const logoButtons = document.querySelectorAll(".logo-picker button");

  logoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const profile = getProfile();
      profile.logo = button.dataset.logo;
      saveProfile(profile);
      updateTopProfile();
    });
  });

  if (profileNameInput) {
    profileNameInput.addEventListener("input", () => {
      const profile = getProfile();
      profile.name = profileNameInput.value.trim() ? profileNameInput.value : "Mission pilot";
      saveProfile(profile);
      updateTopProfile();
    });
  }
}

function updateMissionLabels() {
  document.querySelectorAll('a[href="missions.html"]').forEach((link) => {
    if (link.textContent.trim() === "My Missions") link.textContent = "My Mission";
    if (link.textContent.trim() === "Next: My Missions") link.textContent = "Next: My Mission";
  });
  if (document.title && document.title.includes("My Missions")) {
    document.title = document.title.replace("My Missions", "My Mission");
  }
}

function setupMissionNavMenu() {
  document.querySelectorAll('.nav a[href="missions.html"]').forEach((link) => {
    if (link.closest(".mission-nav-menu")) return;

    const menu = document.createElement("span");
    menu.className = "mission-nav-menu";
    link.parentNode.insertBefore(menu, link);
    menu.appendChild(link);

    const dropdown = document.createElement("span");
    dropdown.className = "mission-nav-dropdown";
    dropdown.innerHTML = `
      <a href="mission-logo.html"><strong>Logo</strong><small>Change your pilot name and icon</small></a>
      <a href="mission-badges.html"><strong>Badges</strong><small>See what you unlocked</small></a>
      <a href="mission-planets.html"><strong>Planets</strong><small>Check your space map</small></a>
      <a href="mission-recommendations.html"><strong>Recommendations</strong><small>Find what to do next</small></a>
    `;
    menu.appendChild(dropdown);
  });
}

function loadJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch (error) {
    localStorage.removeItem(key);
    return {};
  }
}

updateMissionLabels();
setupMissionNavMenu();
renderTopProfile();
setupProfileEditor();
updateTopProfile();

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProgress() {
  return loadJson(storageKey);
}

function saveProgress(progress) {
  saveJson(storageKey, progress);
}

function countChecked() {
  return document.querySelectorAll(".check-row button.is-checked").length;
}

function countTrackerProgress(progress = loadProgress()) {
  const goals = { snack: 2, breakfast: 3, lunchdinner: 4 };
  const checked = Object.entries(goals).reduce((total, [goal, max]) => {
    const saved = Array.isArray(progress[goal]) ? progress[goal] : [];
    return total + Math.min(saved.length, max);
  }, 0);
  return { checked, total: 9 };
}

function updateMessage() {
  if (!trackerMessage) return;
  const checked = countChecked();
  const total = document.querySelectorAll(".check-row button").length;
  const messageIndex = Math.min(messages.length - 1, Math.floor((checked / total) * (messages.length - 1)));
  trackerMessage.textContent = checked === total
    ? "Challenge complete for today. Balanced meals mean more energy and better focus."
    : messages[messageIndex];
}

trackerRows.forEach((row) => {
  const goal = row.dataset.goal;
  const count = Number(row.dataset.count);
  const saved = loadProgress()[goal] || [];

  for (let index = 0; index < count; index += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "OK";
    button.setAttribute("aria-label", `${goal} ${index + 1}`);
    if (saved.includes(index)) button.classList.add("is-checked");
    button.addEventListener("click", () => {
      const progress = loadProgress();
      const nextSaved = new Set(progress[goal] || []);
      button.classList.toggle("is-checked") ? nextSaved.add(index) : nextSaved.delete(index);
      progress[goal] = Array.from(nextSaved);
      saveProgress(progress);
      updateMessage();
    });
    row.appendChild(button);
  }
});

if (trackerRows.length) updateMessage();

if (resetButton) {
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    document.querySelectorAll(".check-row button").forEach((button) => button.classList.remove("is-checked"));
    updateMessage();
  });
}

const quizQuestionSets = [
  {
    title: "Warm-up Set",
    questions: [
      { claim: "\"Made with real fruit flavour\"", answer: "trick", feedback: "Flavour is not the same as a full fruit serving." },
      { claim: "\"Only 90 calories per serving\"", answer: "trick", feedback: "Calories are one clue. Check serving size, sugar, sodium, and fibre too." },
      { claim: "Snack: apple + yogurt", answer: "real", feedback: "This matches the 2-group snack idea." }
    ]
  },
  {
    title: "Set 1: Label Traps",
    questions: [
      { claim: "\"No sugar added\" on fruit juice", answer: "trick", feedback: "Juice can still contain a lot of natural sugar and less fibre than whole fruit." },
      { claim: "\"0 g trans fat\" but the ingredient list says partially hydrogenated oil", answer: "trick", feedback: "Small amounts per serving can round down. Ingredients can reveal what the front label hides." },
      { claim: "\"Whole grain oats\" is the first ingredient and the cereal has 5 g fibre", answer: "real", feedback: "First ingredient plus higher fibre gives stronger evidence than a front-of-box slogan." },
      { claim: "\"Lightly sweetened\" with 18 g sugar per small serving", answer: "trick", feedback: "Words like lightly are not enough. The number on the Nutrition Facts table matters." },
      { claim: "\"Multi-grain\" crackers made mostly from enriched wheat flour", answer: "trick", feedback: "Multi-grain means more than one grain, not automatically whole grain." },
      { claim: "Unsweetened plain yogurt with milk and bacterial culture as the main ingredients", answer: "real", feedback: "Plain yogurt gives protein and calcium without relying on added sugar for taste." },
      { claim: "\"Cholesterol free\" on a bag of candy", answer: "trick", feedback: "Many plant-based or sugary foods have no cholesterol anyway. That claim does not make candy balanced." },
      { claim: "\"Made with vegetables\" on chips where potato starch and oil come first", answer: "trick", feedback: "A tiny amount of vegetable powder is not the same as eating vegetables." },
      { claim: "\"Low sodium\" soup with 130 mg sodium per serving", answer: "real", feedback: "The sodium number supports the claim better than the front label alone." },
      { claim: "\"Protein bar\" with more sugar than protein", answer: "trick", feedback: "Protein does not erase high added sugar. Compare both numbers." }
    ]
  },
  {
    title: "Set 2: Serving Size Tricks",
    questions: [
      { claim: "A drink bottle lists nutrition for half the bottle, but most people drink it all", answer: "trick", feedback: "If you drink the whole bottle, double the calories, sugar, and sodium." },
      { claim: "Snack bag says 140 calories, but the bag has 3 servings", answer: "trick", feedback: "The whole bag would be 420 calories if you eat all three servings." },
      { claim: "A label clearly says \"per 1 container\" and the container is one snack-sized yogurt", answer: "real", feedback: "When the serving matches what you actually eat, the numbers are easier to trust." },
      { claim: "Cereal uses a tiny 30 g serving size, but your bowl is closer to 60 g", answer: "trick", feedback: "Your real bowl has about twice the listed nutrition numbers." },
      { claim: "\"Only 5 g sugar\" on a sauce label, but the serving is one tablespoon", answer: "trick", feedback: "Small serving sizes can make sugar or sodium look lower than your real amount." },
      { claim: "You compare two granola bars using the same serving weight in grams", answer: "real", feedback: "Using the same weight makes the comparison fairer." },
      { claim: "\"Family size\" package uses a smaller serving than the regular package", answer: "trick", feedback: "Serving sizes can change how healthy the numbers look." },
      { claim: "Nutrition numbers look good because the serving is only five chips", answer: "trick", feedback: "Ask whether the serving size matches how much people actually eat." },
      { claim: "You check the serving size before judging the calories and sugar", answer: "real", feedback: "Serving size is the starting point for reading the whole label." },
      { claim: "A muffin is sold as one item but the label calls it two servings", answer: "trick", feedback: "If you eat the whole muffin, count both servings." }
    ]
  },
  {
    title: "Set 3: Ingredient Detective",
    questions: [
      { claim: "Ingredient list starts with sugar, glucose, and corn syrup", answer: "trick", feedback: "Several sugar names near the front suggest sugar is a major part of the food." },
      { claim: "Ingredients are oats, raisins, nuts, cinnamon, and no added syrup", answer: "real", feedback: "Simple ingredients from food groups are a stronger clue than flashy packaging." },
      { claim: "\"Fruit snacks\" list corn syrup before fruit puree", answer: "trick", feedback: "Ingredients are listed by weight, so syrup before fruit is an important warning sign." },
      { claim: "\"Honey wheat\" bread where enriched flour is first and whole wheat is later", answer: "trick", feedback: "The name can sound wholesome even when whole grain is not the main ingredient." },
      { claim: "Peanut butter ingredients: peanuts and a little salt", answer: "real", feedback: "A short ingredient list can make it easier to know what you are eating." },
      { claim: "\"Naturally flavoured\" gummies with sugar as the first ingredient", answer: "trick", feedback: "Natural flavour does not make a sugary food the same as fruit." },
      { claim: "\"Veggie pasta\" with vegetable powder after salt in the ingredient list", answer: "trick", feedback: "If vegetable powder appears late, there may not be much of it." },
      { claim: "Canned beans with beans, water, and no salt added", answer: "real", feedback: "Beans give protein and fibre, and no salt added helps lower sodium." },
      { claim: "\"Ancient grains\" snack with refined flour, oil, and sugar first", answer: "trick", feedback: "Trendy grain names do not matter much if the main ingredients are refined flour, oil, and sugar." },
      { claim: "Frozen vegetables with only vegetables listed as ingredients", answer: "real", feedback: "Plain frozen vegetables can be a solid choice without added sauces or salt." }
    ]
  },
  {
    title: "Set 4: Ad Logic",
    questions: [
      { claim: "An ad says \"athletes eat this candy before games\"", answer: "trick", feedback: "A celebrity or athlete does not prove a food is balanced or needed." },
      { claim: "\"Limited edition\" packaging makes a sugary drink seem exciting", answer: "trick", feedback: "Scarcity is an ad strategy. It does not change nutrition." },
      { claim: "You ignore the cartoon character and read the Nutrition Facts table", answer: "real", feedback: "Checking evidence beats trusting a mascot or package design." },
      { claim: "\"Mom approved\" appears on the box with no explanation or evidence", answer: "trick", feedback: "Approval claims can be vague. Look for nutrition evidence instead." },
      { claim: "A package uses green leaves and farm pictures, but the food is mostly sugar", answer: "trick", feedback: "Nature-themed design can create a healthy feeling without healthy ingredients." },
      { claim: "You compare the ad claim to the ingredient list before deciding", answer: "real", feedback: "A claim should match the evidence on the package." },
      { claim: "\"Energy\" drink means it gives long-lasting balanced fuel", answer: "trick", feedback: "Energy can just mean calories, sugar, or caffeine. It does not guarantee balance." },
      { claim: "A game app rewards you for choosing a branded snack", answer: "trick", feedback: "Games can advertise too. Rewards do not prove the snack is healthy." },
      { claim: "You ask, \"What is this ad trying to make me feel?\" before buying", answer: "real", feedback: "Spotting the feeling target helps you separate marketing from facts." },
      { claim: "\"Doctor recommended\" is printed with no named source or clear reason", answer: "trick", feedback: "Authority claims need clear evidence. Vague wording is not enough." }
    ]
  },
  {
    title: "Set 5: Balanced Choice Challenges",
    questions: [
      { claim: "Breakfast: whole grain toast, egg, and orange slices", answer: "real", feedback: "This combines grain, protein food, and fruit." },
      { claim: "Breakfast: fruit-flavoured drink and a frosted pastry", answer: "trick", feedback: "It sounds fruity, but it is low on whole foods and likely high in sugar." },
      { claim: "Lunch: rice, beans, vegetables, and water", answer: "real", feedback: "This has grain, protein food, vegetables, fibre, and a simple drink." },
      { claim: "Lunch: \"sports\" drink, chips, and a candy bar after sitting all morning", answer: "trick", feedback: "The word sports does not make the meal balanced or necessary." },
      { claim: "Snack: carrots, hummus, and whole grain pita", answer: "real", feedback: "This snack includes vegetables, protein food, and grain." },
      { claim: "Snack: granola with chocolate coating and candy pieces every day", answer: "trick", feedback: "Granola can sound healthy, but candy-style add-ins can shift it toward dessert." },
      { claim: "Dinner: salmon, potato, broccoli, and milk or fortified soy drink", answer: "real", feedback: "This gives protein, vegetables, starch, and a calcium-rich drink." },
      { claim: "Dinner: instant noodles with the full seasoning packet and no vegetables", answer: "trick", feedback: "This is often high in sodium and missing vegetables and protein." },
      { claim: "You choose water most often and save sugary drinks for sometimes", answer: "real", feedback: "Choosing water most often is a strong everyday habit." },
      { claim: "You judge a meal only by calories and ignore food groups", answer: "trick", feedback: "Calories are only one clue. Food groups, fibre, protein, sodium, and sugar also matter." }
    ]
  },
  {
    title: "Set 6: Food Plate Power",
    questions: [
      { claim: "On a balanced food plate, what should fill about half the plate?", answer: "vegetables-fruit", choices: [{ id: "vegetables-fruit", text: "Vegetables and fruit" }, { id: "protein", text: "Only protein foods" }, { id: "treats", text: "Desserts and candy" }], feedback: "A strong plate usually gives the most space to vegetables and fruit." },
      { claim: "Which plate is the most balanced?", answer: "balanced-plate", choices: [{ id: "all-grain", text: "Pasta, bread, and crackers" }, { id: "balanced-plate", text: "Rice, chicken, broccoli, and berries" }, { id: "only-protein", text: "Eggs, meat, and cheese only" }], feedback: "The balanced plate includes grain, protein, vegetables, and fruit." },
      { claim: "What is missing from a plate with chicken, rice, and milk?", answer: "vegetables-fruit", choices: [{ id: "protein", text: "Protein foods" }, { id: "vegetables-fruit", text: "Vegetables or fruit" }, { id: "drink", text: "A drink" }], feedback: "Chicken gives protein, rice gives grain, and milk gives dairy. Add vegetables or fruit." },
      { claim: "Which choice best adds colour and fibre to a meal?", answer: "side-salad", choices: [{ id: "side-salad", text: "Side salad or carrots" }, { id: "extra-soda", text: "Extra soda" }, { id: "larger-fries", text: "Larger fries" }], feedback: "Vegetables add colour, fibre, and nutrients." },
      { claim: "A plate has fries, white bread, and pop. What is the biggest issue?", answer: "low-variety", choices: [{ id: "low-variety", text: "Low variety and few food groups" }, { id: "too-much-fruit", text: "Too much fruit" }, { id: "too-much-water", text: "Too much water" }], feedback: "That plate is heavy on refined grains/starches and sugary drink, with little variety." },
      { claim: "Which plate change would improve instant noodles?", answer: "add-protein-veg", choices: [{ id: "add-protein-veg", text: "Add egg and vegetables" }, { id: "more-seasoning", text: "Add extra seasoning packet" }, { id: "add-candy", text: "Add candy for energy" }], feedback: "Protein and vegetables make the meal more balanced." },
      { claim: "Which snack works like a mini food plate?", answer: "apple-peanut", choices: [{ id: "chips-pop", text: "Chips and pop" }, { id: "apple-peanut", text: "Apple slices and peanut butter" }, { id: "candy-juice", text: "Candy and juice" }], feedback: "Fruit plus protein food makes a stronger snack." }
    ]
  },
  {
    title: "Set 7: Food Group Detective",
    questions: [
      { claim: "Which food is mostly a grain food?", answer: "brown-rice", choices: [{ id: "brown-rice", text: "Brown rice" }, { id: "beans", text: "Beans" }, { id: "spinach", text: "Spinach" }], feedback: "Brown rice belongs with grain foods." },
      { claim: "Which food is a protein food?", answer: "lentils", choices: [{ id: "orange", text: "Orange" }, { id: "lentils", text: "Lentils" }, { id: "bread", text: "Bread" }], feedback: "Lentils are a plant-based protein food." },
      { claim: "Which food best fits the vegetables and fruit group?", answer: "peppers", choices: [{ id: "peppers", text: "Bell peppers" }, { id: "yogurt", text: "Yogurt" }, { id: "oats", text: "Oats" }], feedback: "Bell peppers are vegetables." },
      { claim: "Which choice is a calcium-rich drink option?", answer: "milk-soy", choices: [{ id: "sports-drink", text: "Sports drink" }, { id: "milk-soy", text: "Milk or fortified soy drink" }, { id: "fruit-punch", text: "Fruit punch" }], feedback: "Milk and fortified soy drink can support calcium intake." },
      { claim: "Which meal has at least three food groups?", answer: "wrap-meal", choices: [{ id: "wrap-meal", text: "Whole wheat wrap with turkey and lettuce" }, { id: "plain-candy", text: "Candy only" }, { id: "popcorn-only", text: "Plain popcorn only" }], feedback: "The wrap has grain, protein, and vegetables." },
      { claim: "What group do chickpeas fit best?", answer: "protein", choices: [{ id: "fruit", text: "Fruit" }, { id: "protein", text: "Protein foods" }, { id: "drink", text: "Drink" }], feedback: "Chickpeas are a protein food and also give fibre." },
      { claim: "Which breakfast has better food-group variety?", answer: "oats-yogurt-berries", choices: [{ id: "donut", text: "Donut only" }, { id: "oats-yogurt-berries", text: "Oats, yogurt, and berries" }, { id: "juice-only", text: "Juice only" }], feedback: "Oats, yogurt, and berries cover grain, dairy/protein, and fruit." }
    ]
  },
  {
    title: "Set 8: Label Math Boss",
    questions: [
      { claim: "A bottle has 12 g sugar per serving and 2 servings. How much sugar is in the bottle?", answer: "24g", choices: [{ id: "12g", text: "12 g" }, { id: "24g", text: "24 g" }, { id: "6g", text: "6 g" }], feedback: "Two servings means 12 g x 2 = 24 g sugar." },
      { claim: "A snack has 280 mg sodium per serving and you eat 2 servings. What is the sodium?", answer: "560mg", choices: [{ id: "140mg", text: "140 mg" }, { id: "280mg", text: "280 mg" }, { id: "560mg", text: "560 mg" }], feedback: "Two servings doubles the sodium to 560 mg." },
      { claim: "Which label clue is best for choosing a higher-fibre cereal?", answer: "fibre-number", choices: [{ id: "cartoon", text: "A cartoon on the box" }, { id: "fibre-number", text: "More grams of fibre" }, { id: "bright-color", text: "Bright package colour" }], feedback: "The fibre number is real nutrition information." },
      { claim: "Two granola bars are the same size. Bar A has 4 g fibre; Bar B has 1 g fibre. Which has more fibre?", answer: "bar-a", choices: [{ id: "bar-a", text: "Bar A" }, { id: "bar-b", text: "Bar B" }, { id: "same", text: "They are the same" }], feedback: "Four grams is more than one gram." },
      { claim: "Which should you check first before comparing two labels?", answer: "serving-size", choices: [{ id: "serving-size", text: "Serving size" }, { id: "mascot", text: "Mascot" }, { id: "font", text: "Font style" }], feedback: "Serving size tells you what amount the numbers are based on." },
      { claim: "A cereal says 9 g sugar per 30 g serving. Your bowl is 60 g. What happens?", answer: "double", choices: [{ id: "double", text: "The sugar is about double" }, { id: "same", text: "The sugar stays 9 g" }, { id: "zero", text: "The sugar becomes 0 g" }], feedback: "Eating twice the serving means about twice the listed sugar." },
      { claim: "Which label would usually be the better everyday soup choice?", answer: "lower-sodium", choices: [{ id: "lower-sodium", text: "Lower sodium, similar serving size" }, { id: "bigger-logo", text: "Bigger logo" }, { id: "more-claims", text: "More front-label claims" }], feedback: "Lower sodium is useful evidence when serving sizes are similar." }
    ]
  },
  {
    title: "Set 9: Drink Check",
    questions: [
      { claim: "Which drink is usually the best everyday choice?", answer: "water", choices: [{ id: "water", text: "Water" }, { id: "pop", text: "Pop" }, { id: "energy-drink", text: "Energy drink" }], feedback: "Water is the best regular drink for most everyday situations." },
      { claim: "A fruit drink says \"contains real fruit\" but has 25 g sugar. What should you do?", answer: "check-label", choices: [{ id: "check-label", text: "Check the label and serving size" }, { id: "trust-front", text: "Trust the front claim only" }, { id: "ignore-sugar", text: "Ignore the sugar" }], feedback: "Front claims need to be checked against the label." },
      { claim: "When might a sports drink make more sense?", answer: "long-hard-activity", choices: [{ id: "watching-tv", text: "Watching TV" }, { id: "long-hard-activity", text: "Long hard activity or sports" }, { id: "regular-lunch", text: "Every regular lunch" }], feedback: "Sports drinks are not needed for most regular daily meals or short activities." },
      { claim: "Which drink has protein and calcium?", answer: "milk", choices: [{ id: "milk", text: "Milk" }, { id: "fruit-punch", text: "Fruit punch" }, { id: "cola", text: "Cola" }], feedback: "Milk provides protein and calcium." },
      { claim: "What is the trick in \"vitamin water\" with lots of added sugar?", answer: "health-halo", choices: [{ id: "health-halo", text: "Healthy-sounding name hides sugar" }, { id: "whole-fruit", text: "It counts as whole fruit" }, { id: "free-protein", text: "It gives complete protein" }], feedback: "A healthy-sounding name can create a health halo." },
      { claim: "Which choice gives fibre?", answer: "whole-orange", choices: [{ id: "orange-juice", text: "Orange juice" }, { id: "whole-orange", text: "Whole orange" }, { id: "orange-pop", text: "Orange pop" }], feedback: "Whole fruit gives fibre that juice and pop do not provide as well." },
      { claim: "Which habit supports the site message best?", answer: "water-most", choices: [{ id: "water-most", text: "Water most often" }, { id: "pop-every-meal", text: "Pop with every meal" }, { id: "energy-daily", text: "Energy drink daily" }], feedback: "Water most often is a strong everyday habit." }
    ]
  },
  {
    title: "Set 10: Meal Builder Challenge",
    questions: [
      { claim: "Build a stronger lunch from pizza alone. What should you add?", answer: "veg-fruit-water", choices: [{ id: "veg-fruit-water", text: "Vegetables, fruit, and water" }, { id: "more-crust", text: "Only extra crust" }, { id: "candy", text: "Candy and pop" }], feedback: "Vegetables, fruit, and water improve balance." },
      { claim: "Which breakfast is best before a focused school morning?", answer: "balanced-breakfast", choices: [{ id: "balanced-breakfast", text: "Egg, toast, berries, and water" }, { id: "candy-breakfast", text: "Candy and pop" }, { id: "skip", text: "Nothing at all" }], feedback: "A balanced breakfast gives steadier fuel for learning." },
      { claim: "A student wants a 2-group snack. Which works?", answer: "cheese-crackers", choices: [{ id: "gummies", text: "Gummies" }, { id: "cheese-crackers", text: "Cheese and whole grain crackers" }, { id: "soda", text: "Soda" }], feedback: "Cheese plus whole grain crackers gives two food groups." },
      { claim: "Which dinner swap adds more vegetables?", answer: "add-stir-fry", choices: [{ id: "extra-sauce", text: "Extra sugary sauce" }, { id: "add-stir-fry", text: "Add stir-fried peppers and broccoli" }, { id: "remove-salad", text: "Remove the salad" }], feedback: "Peppers and broccoli add vegetables and colour." },
      { claim: "What should you ask when a snack package says \"smart choice\"?", answer: "evidence", choices: [{ id: "evidence", text: "What evidence is on the label?" }, { id: "cool", text: "Is the package cool?" }, { id: "popular", text: "Is it popular online?" }], feedback: "A smart choice should be backed up by label and ingredient evidence." },
      { claim: "Which option is best for adding protein to a salad?", answer: "beans", choices: [{ id: "beans", text: "Beans or chicken" }, { id: "soda", text: "Soda" }, { id: "sprinkles", text: "Sprinkles" }], feedback: "Beans or chicken add protein." },
      { claim: "Which meal best matches the mission idea of balance over hype?", answer: "homemade-bowl", choices: [{ id: "ad-snack", text: "A snack chosen only because of an ad" }, { id: "homemade-bowl", text: "Grain bowl with vegetables and protein" }, { id: "candy-label", text: "Candy with a green label" }], feedback: "The grain bowl uses real food-group balance instead of marketing hype." }
    ]
  }
];

[
  [0, 0, [{ id: "trick", text: "Fruit flavour is not fruit" }, { id: "real", text: "Counts as a fruit serving" }, { id: "real-ish", text: "Always healthier than water" }]],
  [0, 1, [{ id: "serving", text: "Serving size does not matter" }, { id: "trick", text: "Could hide sugar or sodium" }, { id: "real", text: "Calories prove it is healthy" }]],
  [0, 2, [{ id: "real", text: "Good 2-group snack" }, { id: "trick", text: "Only a marketing trick" }, { id: "missing", text: "Missing every food group" }]],
  [1, 0, [{ id: "trick", text: "Still may be sugary" }, { id: "real", text: "No sugar at all" }, { id: "protein", text: "Mainly a protein food" }]],
  [1, 1, [{ id: "trick", text: "Ingredient list warning" }, { id: "real", text: "Front label is enough" }, { id: "ignore", text: "Ignore the ingredients" }]],
  [1, 2, [{ id: "real", text: "Strong whole-grain clue" }, { id: "trick", text: "Only package art matters" }, { id: "drink", text: "This is about drinks" }]],
  [1, 3, [{ id: "trick", text: "Sugar number is high" }, { id: "real", text: "Lightly means low sugar" }, { id: "unknown", text: "Sugar does not matter" }]],
  [1, 4, [{ id: "trick", text: "Multi-grain is not always whole grain" }, { id: "real", text: "Always 100% whole grain" }, { id: "protein", text: "Mostly protein food" }]],
  [1, 5, [{ id: "real", text: "Plain yogurt choice" }, { id: "trick", text: "Candy-style yogurt" }, { id: "grain", text: "Mainly a grain food" }]],
  [1, 6, [{ id: "trick", text: "Irrelevant health halo" }, { id: "real", text: "Makes candy balanced" }, { id: "plate", text: "Completes the food plate" }]],
  [1, 7, [{ id: "trick", text: "Vegetable powder is not enough" }, { id: "real", text: "Same as a vegetable serving" }, { id: "water", text: "Counts as water" }]],
  [1, 8, [{ id: "real", text: "Sodium number supports it" }, { id: "trick", text: "Ignore sodium numbers" }, { id: "sugar", text: "Only sugar matters" }]],
  [1, 9, [{ id: "trick", text: "Compare sugar and protein" }, { id: "real", text: "Protein word fixes everything" }, { id: "fruit", text: "Counts as fruit" }]],
  [2, 0, [{ id: "trick", text: "Double the label numbers" }, { id: "real", text: "Use half-bottle numbers" }, { id: "zero", text: "Serving size does not matter" }]],
  [2, 1, [{ id: "trick", text: "Whole bag has 3 servings" }, { id: "real", text: "Whole bag is 140 calories" }, { id: "plate", text: "This is a food plate question" }]],
  [2, 2, [{ id: "real", text: "Serving matches container" }, { id: "trick", text: "Serving is hidden" }, { id: "ignore", text: "Do not read labels" }]],
  [2, 3, [{ id: "trick", text: "Your bowl doubles the numbers" }, { id: "real", text: "The numbers stay the same" }, { id: "water", text: "Add water to erase sugar" }]],
  [2, 4, [{ id: "trick", text: "Tiny serving can hide totals" }, { id: "real", text: "One spoon proves it is healthy" }, { id: "protein", text: "Sauce is protein" }]],
  [2, 5, [{ id: "real", text: "Fair same-weight comparison" }, { id: "trick", text: "Compare different sizes" }, { id: "ad", text: "Pick the brighter wrapper" }]],
  [2, 6, [{ id: "trick", text: "Serving changed the numbers" }, { id: "real", text: "Family size is always healthier" }, { id: "fruit", text: "It adds fruit" }]]
].forEach(([setIndex, questionIndex, choices]) => {
  quizQuestionSets[setIndex].questions[questionIndex].choices = choices;
});

let activeQuizSetIndex = Number(loadJson(quizStorageKey).activeSet || 0);

function getQuizTotal() {
  return quizQuestionSets.reduce((total, set) => total + set.questions.length, 0);
}

function getQuestionId(setIndex, questionIndex) {
  return `${setIndex}-${questionIndex}`;
}

function loadQuizAnswers() {
  return loadJson(quizAnswersStorageKey);
}

function countQuizProgress(answers = loadQuizAnswers()) {
  let score = 0;
  let completed = 0;

  quizQuestionSets.forEach((set, setIndex) => {
    set.questions.forEach((question, questionIndex) => {
      const saved = answers[getQuestionId(setIndex, questionIndex)];
      if (!saved) return;
      completed += 1;
      if (saved.choice === question.answer) score += 1;
    });
  });

  return { score, completed, total: getQuizTotal() };
}

function getSetProgress(setIndex, answers = loadQuizAnswers()) {
  const set = quizQuestionSets[setIndex];
  const completed = set.questions.filter((question, questionIndex) => answers[getQuestionId(setIndex, questionIndex)]).length;
  return { completed, total: set.questions.length };
}

function countSetScore(setIndex, answers = loadQuizAnswers()) {
  const set = quizQuestionSets[setIndex];
  const score = set.questions.filter((question, questionIndex) => {
    const saved = answers[getQuestionId(setIndex, questionIndex)];
    return saved && saved.choice === question.answer;
  }).length;
  return { score, total: set.questions.length };
}

function renderQuiz() {
  if (!quiz) return;
  if (!quizQuestionSets[activeQuizSetIndex]) activeQuizSetIndex = 0;

  quiz.innerHTML = "";

  const answers = loadQuizAnswers();
  const activeSet = quizQuestionSets[activeQuizSetIndex];
  const progress = countQuizProgress(answers);
  const activeSetProgress = getSetProgress(activeQuizSetIndex, answers);

  if (topQuizSelect) {
    topQuizSelect.innerHTML = "";
    if (topQuizList) topQuizList.innerHTML = "";
    quizQuestionSets.forEach((set, setIndex) => {
      const setProgress = getSetProgress(setIndex, answers);
      const option = document.createElement("option");
      option.value = String(setIndex);
      option.textContent = `${set.title} (${setProgress.completed}/${setProgress.total})`;
      topQuizSelect.appendChild(option);

      if (topQuizList) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "top-quiz-item";
        item.classList.toggle("is-active", setIndex === activeQuizSetIndex);
        item.innerHTML = `
          <span class="top-quiz-item__number">${setIndex === 0 ? "0" : setIndex}</span>
          <span class="top-quiz-item__text">
            <strong>${set.title}</strong>
            <small>${setProgress.completed} of ${setProgress.total} complete</small>
          </span>
          <span class="top-quiz-item__bar"><i style="width:${(setProgress.completed / setProgress.total) * 100}%"></i></span>
        `;
        item.addEventListener("click", () => {
          activeQuizSetIndex = setIndex;
          renderQuiz();
          updateQuizScore();
        });
        topQuizList.appendChild(item);
      }
    });
    topQuizSelect.value = String(activeQuizSetIndex);
  }

  const controls = document.createElement("section");
  controls.className = "quiz-controls";

  const controlsText = document.createElement("div");
  const controlsKicker = document.createElement("p");
  controlsKicker.className = "kicker";
  controlsKicker.textContent = "Mission status";
  const controlsTitle = document.createElement("h2");
  controlsTitle.textContent = activeSet.title;
  const controlsHint = document.createElement("p");
  controlsHint.textContent = `You answered ${activeSetProgress.completed} of ${activeSetProgress.total} in this set. Overall: ${progress.completed} of ${progress.total} answered.`;
  controlsText.append(controlsKicker, controlsTitle, controlsHint);

  const infoGrid = document.createElement("div");
  infoGrid.className = "quiz-info-grid";
  infoGrid.innerHTML = `
    <span><strong>${quizQuestionSets.length}</strong> sets</span>
    <span><strong>${progress.total}</strong> questions</span>
    <span><strong>${progress.score}</strong> correct</span>
  `;
  const resetQuizButton = document.createElement("button");
  resetQuizButton.type = "button";
  resetQuizButton.className = "button button--reset quiz-reset";
  resetQuizButton.textContent = "Reset Quiz";
  resetQuizButton.addEventListener("click", () => {
    localStorage.removeItem(quizAnswersStorageKey);
    localStorage.removeItem(quizStorageKey);
    renderQuiz();
    updateQuizScore();
  });
  infoGrid.appendChild(resetQuizButton);
  controls.append(controlsText, infoGrid);
  quiz.appendChild(controls);

  const layout = document.createElement("div");
  layout.className = "quiz-layout";

  const sidePanel = document.createElement("aside");
  sidePanel.className = "quiz-side-panel";
  const sideTitle = document.createElement("h2");
  sideTitle.textContent = "Quiz Pages";
  const sideText = document.createElement("p");
  sideText.textContent = "Jump between sets.";
  sidePanel.append(sideTitle, sideText);

  quizQuestionSets.forEach((set, setIndex) => {
    const progress = getSetProgress(setIndex, answers);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-tab";
    button.classList.toggle("is-active", setIndex === activeQuizSetIndex);
    button.innerHTML = `<strong>${set.title}</strong><span>${progress.completed} / ${progress.total} done</span>`;
    button.addEventListener("click", () => {
      activeQuizSetIndex = setIndex;
      renderQuiz();
      updateQuizScore();
    });
    sidePanel.appendChild(button);
  });

  const stage = document.createElement("section");
  stage.className = "quiz-stage";

  const heading = document.createElement("h2");
  heading.className = "quiz-set";
  heading.textContent = activeSet.title;

  const setSummary = document.createElement("p");
  setSummary.className = "quiz-set-summary";
  const setProgress = getSetProgress(activeQuizSetIndex, answers);
  setSummary.textContent = `${setProgress.completed} of ${setProgress.total} answered in this set. Overall progress stays saved across quiz pages.`;
  stage.append(heading, setSummary);

  activeSet.questions.forEach((question, questionIndex) => {
    const questionId = getQuestionId(activeQuizSetIndex, questionIndex);
    const saved = answers[questionId];
    const card = document.createElement("article");
    card.className = "quiz-card";
    card.dataset.answer = question.answer;

    if (saved) {
      const isCorrect = saved.choice === question.answer;
      card.classList.add("is-answered");
      card.classList.toggle("is-correct", isCorrect);
      card.classList.toggle("is-wrong", !isCorrect);
    }

    const title = document.createElement("h3");
    title.textContent = question.claim;

    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.textContent = question.feedback;

    const choices = question.choices || [
      { id: "real", text: question.answer === "real" ? "Real balanced choice" : "Real health proof" },
      { id: "trick", text: "Could be a trick" }
    ];

    card.appendChild(title);
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "button button--secondary";
      button.dataset.choice = choice.id;
      button.textContent = choice.text;
      card.appendChild(button);
    });
    card.appendChild(feedback);

    card.querySelectorAll("button").forEach((button) => {
      if (saved) button.disabled = true;
      if (saved && saved.choice === button.dataset.choice) button.classList.add("is-selected");
      button.addEventListener("click", () => {
        const nextAnswers = loadQuizAnswers();
        const isCorrect = button.dataset.choice === card.dataset.answer;
        nextAnswers[questionId] = { choice: button.dataset.choice };
        saveJson(quizAnswersStorageKey, nextAnswers);
        card.classList.add("is-answered");
        card.classList.toggle("is-correct", isCorrect);
        card.classList.toggle("is-wrong", !isCorrect);
        button.classList.add("is-selected");
        card.querySelectorAll("button").forEach((item) => item.disabled = true);
        renderQuiz();
        updateQuizScore();
      });
    });

    stage.appendChild(card);
  });

  quizScore = document.createElement("p");
  quizScore.className = "quiz-score";
  quizScore.id = "quiz-score";
  stage.appendChild(quizScore);

  layout.append(sidePanel, stage);
  quiz.appendChild(layout);
}

function updateQuizScore() {
  if (!quiz || !quizScore) return;
  const progress = countQuizProgress();
  const setScore = countSetScore(activeQuizSetIndex);
  const setProgress = getSetProgress(activeQuizSetIndex);
  quizScore.textContent = `Set score: ${setScore.score} / ${setScore.total}. Overall score: ${progress.score} / ${progress.total}. Answered this set: ${setProgress.completed} of ${setProgress.total}.`;
  saveJson(quizStorageKey, { ...progress, activeSet: activeQuizSetIndex });
}

if (topQuizSelect) {
  topQuizSelect.addEventListener("change", () => {
    activeQuizSetIndex = Number(topQuizSelect.value);
    renderQuiz();
    updateQuizScore();
  });
}

if (quiz) {
  renderQuiz();
  updateQuizScore();
}

function renderMissions() {
  if (!missionPage) return;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  const setHtml = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.innerHTML = value;
  };
  const setWidth = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.style.width = value;
  };
  const setLeft = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.style.left = value;
  };

  const quizProgress = loadJson(quizStorageKey);
  const trackerProgress = countTrackerProgress();
  const quizTotal = quizProgress.total || 3;
  const quizScoreValue = quizProgress.score || 0;
  const quizCompleted = quizProgress.completed || 0;
  const quizPercent = quizScoreValue / quizTotal;
  const trackerPercent = trackerProgress.checked / trackerProgress.total;
  const missionPercent = Math.round(((quizPercent + trackerPercent) / 2) * 100);
  const destinations = ["Earth Launchpad", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const levelIndex = Math.min(destinations.length - 1, Math.floor((missionPercent / 100) * destinations.length));
  const rocketPosition = Math.max(2, Math.min(92, missionPercent));

  setText("mission-level", destinations[levelIndex]);
  setText("mission-summary", levelIndex === destinations.length - 1
    ? "You made it to Pluto. Keep repeating the challenge to stay mission-ready."
    : `Your next stop is ${destinations[Math.min(levelIndex + 1, destinations.length - 1)]}.`);
  setText("mission-score", `${missionPercent}% mission fuel`);
  setWidth("mission-meter-fill", `${missionPercent}%`);
  setLeft("mission-rocket", `${rocketPosition}%`);
  setText("mission-quiz", `Quiz: ${quizScoreValue} correct out of ${quizTotal}. Answered ${quizCompleted} of ${quizTotal} questions.`);
  setText("mission-tracker", `Tracker: ${trackerProgress.checked} of ${trackerProgress.total} food-group checks complete.`);

  document.querySelectorAll(".planet-stop").forEach((planet, index) => {
    planet.classList.toggle("is-active", index <= levelIndex);
  });

  const recommendations = [];
  const quizRemaining = Math.max(quizTotal - quizCompleted, 0);
  const trackerRemaining = Math.max(trackerProgress.total - trackerProgress.checked, 0);
  const savedTrackerProgress = loadProgress();
  const trackerGoalCounts = {
    snack: Math.min((savedTrackerProgress.snack || []).length, 2),
    breakfast: Math.min((savedTrackerProgress.breakfast || []).length, 3),
    lunchdinner: Math.min((savedTrackerProgress.lunchdinner || []).length, 4)
  };
  const quizAccuracy = quizCompleted ? quizScoreValue / quizCompleted : 0;
  const nextPlanetFuel = Math.min(100, Math.ceil(((levelIndex + 1) / destinations.length) * 100));
  const fuelToNextPlanet = Math.max(nextPlanetFuel - missionPercent, 0);

  if (quizRemaining > 0) recommendations.push(`To do: finish ${quizRemaining} more quiz ${quizRemaining === 1 ? "question" : "questions"} to earn more mission fuel.`);
  if (quizCompleted > 0 && quizScoreValue < quizCompleted) recommendations.push("Recommendation: review the ad tricks page, then retry the ideas you missed so front-label claims are easier to catch.");
  if (trackerProgress.checked < 2) recommendations.push("To do: build one 2-group snack, such as fruit with yogurt or whole-grain crackers with cheese.");
  if (trackerProgress.checked >= 2 && trackerProgress.checked < 5) recommendations.push("To do: level up to a 3-group breakfast with a whole grain, a protein food, and a fruit or vegetable.");
  if (trackerProgress.checked >= 5 && trackerRemaining > 0) recommendations.push(`To do: complete ${trackerRemaining} more food-group ${trackerRemaining === 1 ? "check" : "checks"} in the tracker by building a stronger lunch or dinner.`);
  if (quizCompleted === 0) recommendations.push("To do: start with the Warm-up Set so the site can learn what ad tricks you already notice.");
  if (quizCompleted >= 5 && quizAccuracy < 0.7) recommendations.push("Recommendation: slow down on label questions. Read the serving size first, then sugar, sodium, fibre, and ingredients.");
  if (quizCompleted >= 10 && quizAccuracy >= 0.7) recommendations.push("Recommendation: you are spotting tricks well. Try a harder quiz set like Serving Size Tricks or Ingredient Detective.");
  if (quizRemaining <= 10 && quizRemaining > 0) recommendations.push(`To do: you are close to finishing the quiz. Complete the last ${quizRemaining} ${quizRemaining === 1 ? "question" : "questions"} for a stronger final score.`);
  if (trackerGoalCounts.snack < 2) recommendations.push(`To do: finish the snack goal by adding ${2 - trackerGoalCounts.snack} more food-group ${2 - trackerGoalCounts.snack === 1 ? "check" : "checks"}.`);
  if (trackerGoalCounts.breakfast < 3 && trackerGoalCounts.snack === 2) recommendations.push(`To do: build a 3-group breakfast. You need ${3 - trackerGoalCounts.breakfast} more breakfast ${3 - trackerGoalCounts.breakfast === 1 ? "check" : "checks"}.`);
  if (trackerGoalCounts.lunchdinner < 4 && trackerGoalCounts.breakfast === 3) recommendations.push(`To do: complete a 4-group lunch or dinner with ${4 - trackerGoalCounts.lunchdinner} more lunch/dinner ${4 - trackerGoalCounts.lunchdinner === 1 ? "check" : "checks"}.`);
  if (trackerProgress.checked >= 1 && trackerProgress.checked < trackerProgress.total) recommendations.push("Recommendation: after your next meal, open the tracker right away so you do not forget what food groups you used.");
  if (missionPercent < 25) recommendations.push("To do: get off the launchpad by answering one quiz set and checking one real snack or meal.");
  if (missionPercent >= 25 && missionPercent < 50) recommendations.push("Recommendation: your mission has started. Add more tracker checks to balance quiz knowledge with real food choices.");
  if (missionPercent >= 50 && missionPercent < 75) recommendations.push("To do: push past halfway by checking one label before you eat or drink something packaged.");
  if (missionPercent >= 75 && missionPercent < 100) recommendations.push("Recommendation: you are close to Pluto. Finish the missing quiz or tracker pieces to complete the mission.");
  if (fuelToNextPlanet > 0 && missionPercent < 100) recommendations.push(`To do: earn about ${fuelToNextPlanet}% more mission fuel to reach the next planet.`);
  if (quizCompleted > 0 && trackerProgress.checked === 0) recommendations.push("Recommendation: you have quiz fuel, but no tracker fuel yet. Build a real 2-group snack to connect the quiz to real life.");
  if (trackerProgress.checked > 0 && quizCompleted === 0) recommendations.push("Recommendation: you have tracker fuel, but no quiz fuel yet. Try the quiz to practise spotting food ad tricks.");
  if (quizCompleted === quizTotal && quizScoreValue === quizTotal && trackerProgress.checked === trackerProgress.total) recommendations.push("Recommendation: you reached Pluto. Keep the streak going tomorrow by checking one label and building one balanced meal.");
  if (!recommendations.length) recommendations.push("Recommendation: keep going. Answer a quiz set, check your next meal, and watch the rocket move.");

  setHtml("mission-recommendations", recommendations.map((item) => `<li>${item}</li>`).join(""));

  const badges = [
    {
      number: "01",
      title: "First Launch",
      text: "Start the quiz or check one food group.",
      unlocked: quizCompleted > 0 || trackerProgress.checked > 0
    },
    {
      number: "02",
      title: "Quiz Cadet",
      text: "Answer at least 10 quiz questions.",
      unlocked: quizCompleted >= 10
    },
    {
      number: "03",
      title: "Ad Detective",
      text: "Get at least 5 quiz answers correct.",
      unlocked: quizScoreValue >= 5
    },
    {
      number: "04",
      title: "Snack Builder",
      text: "Complete the 2-group snack tracker goal.",
      unlocked: trackerProgress.checked >= 2
    },
    {
      number: "05",
      title: "Meal Builder",
      text: "Complete at least 5 food-group checks.",
      unlocked: trackerProgress.checked >= 5
    },
    {
      number: "06",
      title: "Tracker Master",
      text: "Complete every tracker food-group check.",
      unlocked: trackerProgress.checked === trackerProgress.total
    },
    {
      number: "07",
      title: "Label Legend",
      text: "Finish the quiz with every answer correct.",
      unlocked: quizCompleted === quizTotal && quizScoreValue === quizTotal
    },
    {
      number: "08",
      title: "Pluto Pilot",
      text: "Reach the final mission destination.",
      unlocked: levelIndex === destinations.length - 1
    }
  ];
  const badgeList = document.getElementById("mission-badges");
  if (badgeList) {
    badgeList.innerHTML = badges.map((badge) => `
      <article class="badge-card${badge.unlocked ? "" : " is-locked"}">
        <span>${badge.unlocked ? badge.number : "--"}</span>
        <strong>${badge.title}</strong>
        <small>${badge.unlocked ? "Unlocked: " : "Locked: "}${badge.text}</small>
      </article>
    `).join("");
  }
}

if (resetMissionsButton) {
  resetMissionsButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(quizStorageKey);
    localStorage.removeItem(quizAnswersStorageKey);
    renderMissions();
  });
}

renderMissions();

function setupAdLab() {
  const lab = document.getElementById("ad-lab");
  if (!lab) return;

  const packageCard = document.getElementById("ad-lab-package");
  const status = document.getElementById("ad-lab-status");
  const meter = document.getElementById("ad-lab-meter");
  const findings = document.getElementById("ad-lab-findings");
  const verdict = document.getElementById("ad-lab-verdict");
  const next = document.getElementById("next-ad-lab");
  const reset = document.getElementById("reset-ad-lab");
  const rounds = [
    { brand: "Glow Grain", title: "Marshmallow Cereal", theme: "blue", badge: "Whole grain taste", fine: "Serving shown: 3/4 cup", labels: [["Front fruit art", "Pictures can make cereal feel fresher, but the ingredients decide what is really inside.", true], ["Big cartoon", "Characters can make the package more exciting, especially for kids.", true], ["Whole grain taste", "Taste is not the same as a whole-grain main ingredient.", true], ["Clear serving size", "This is useful information, not automatically a trick.", false]] },
    { brand: "Sport Zip", title: "Electro Drink", theme: "orange", badge: "Athlete energy", fine: "Contains added sugar", labels: [["Athlete picture", "Sports images can make a drink seem needed even when water is enough for most days.", true], ["Energy word", "Energy can just mean sugar or caffeine, not balanced fuel.", true], ["Bottle size", "If the bottle has more than one serving, the real sugar can be higher.", true], ["Water listed", "Water being listed is normal for a drink. Keep checking the whole label.", false]] },
    { brand: "Nature Pop", title: "Fruit Gummies", theme: "pink", badge: "Made with real fruit flavour", fine: "Fruit puree appears after syrup", labels: [["Fruit flavour", "Fruit flavour is not the same as eating fruit.", true], ["Leaf design", "Nature colours can create a healthy feeling without proving nutrition.", true], ["Syrup first", "Ingredients near the front are present in larger amounts.", true], ["Small package", "Small size alone is not proof that the snack is balanced.", false]] },
    { brand: "Protein Pro", title: "Chocolate Bar", theme: "violet", badge: "10 g protein", fine: "18 g sugar", labels: [["Protein claim", "Protein does not erase lots of sugar.", true], ["Chocolate coating", "A bar can act more like dessert even with a health claim.", true], ["Sugar number", "The Nutrition Facts table can reveal what the front hides.", true], ["Contains nuts", "Nuts can be a protein food, but the whole product still matters.", false]] },
    { brand: "Lite Crunch", title: "Veggie Chips", theme: "green", badge: "Made with vegetables", fine: "Potato starch and oil first", labels: [["Veggie word", "Vegetable powder or pictures do not equal a serving of vegetables.", true], ["Green bag", "Green packaging can make processed food look healthier.", true], ["Oil first", "The ingredient order can reveal the main parts of the food.", true], ["Crunchy texture", "Texture is not a nutrition claim by itself.", false]] },
    { brand: "Morning Max", title: "Breakfast Cookie", theme: "orange", badge: "Start smart", fine: "Two cookies per serving", labels: [["Breakfast name", "Calling it breakfast does not make it a balanced meal.", true], ["Smart word", "Smart is a feeling word unless the label backs it up.", true], ["Two-cookie serving", "Serving size can make numbers look better than what people eat.", true], ["Has oats", "Oats can be good, but check whether sugar comes before them.", false]] },
    { brand: "Zero Blast", title: "Candy Drink", theme: "blue", badge: "Zero fat", fine: "High sugar", labels: [["Zero fat", "Many sugary drinks have no fat anyway. That claim can distract from sugar.", true], ["Bright splash", "Exciting design can make the drink feel fun instead of sugary.", true], ["High sugar", "This is the stronger evidence than the front claim.", true], ["Cold drink", "Temperature is not a health claim.", false]] },
    { brand: "Ancient Bite", title: "Grain Crackers", theme: "violet", badge: "Ancient grains", fine: "Enriched flour first", labels: [["Ancient grains", "Trendy grain names do not prove the main grain is whole grain.", true], ["Flour first", "The first ingredient matters more than the front slogan.", true], ["Rustic design", "Natural-looking design can create a health halo.", true], ["Baked shape", "Being square or baked-looking does not prove nutrition.", false]] },
    { brand: "Hydro Hero", title: "Vitamin Water", theme: "green", badge: "With vitamins", fine: "26 g sugar", labels: [["Vitamin claim", "Added vitamins do not cancel out lots of added sugar.", true], ["Water name", "A drink can use the word water and still be sugary.", true], ["Sugar number", "The sugar grams tell more than the healthy-sounding name.", true], ["Clear bottle", "Seeing the colour is not enough to judge health.", false]] },
    { brand: "Lunch Legend", title: "Instant Noodles", theme: "pink", badge: "Ready in 2 minutes", fine: "Very high sodium", labels: [["Fast claim", "Fast is convenient, but it does not mean balanced.", true], ["Sodium warning", "Sodium is important evidence on packaged meals.", true], ["Tiny vegetable art", "Small vegetable pictures may not mean many vegetables inside.", true], ["Warm meal", "Warm food can still be missing food groups.", false]] },
    { brand: "Farm Fresh-ish", title: "Strawberry Yogurt", theme: "blue", badge: "Farm style", fine: "Sugar added", labels: [["Farm style", "Farm pictures can make food feel natural without proving it is lower in sugar.", true], ["Fruit picture", "Fruit on the tub does not prove there is much fruit inside.", true], ["Added sugar", "Plain yogurt is usually a better comparison point.", true], ["Contains milk", "Milk can be part of a protein food, but added sugar still matters.", false]] },
    { brand: "Mega Muffin", title: "Blueberry Muffin", theme: "orange", badge: "Only 220 calories", fine: "Package says 2 servings", labels: [["Calorie claim", "Calories can look low when the package is split into servings.", true], ["Two servings", "If people eat the whole muffin, they need to count both servings.", true], ["Blueberry name", "A fruit name does not prove it has lots of fruit.", true], ["Soft texture", "Texture does not tell you if it is balanced.", false]] },
    { brand: "Power Puff", title: "Cheese Snacks", theme: "violet", badge: "Source of calcium", fine: "High sodium", labels: [["Calcium claim", "One helpful nutrient does not make the whole snack balanced.", true], ["Cheese image", "Cheese flavour is not the same as a protein-food serving.", true], ["Sodium number", "Salt can be hidden behind fun packaging.", true], ["Orange colour", "Colour alone is not nutrition evidence.", false]] },
    { brand: "Real Deal", title: "Granola Cup", theme: "green", badge: "Natural", fine: "Syrup second ingredient", labels: [["Natural word", "Natural is broad and does not automatically mean healthy.", true], ["Syrup second", "Sugar names near the front are a warning sign.", true], ["Small cup", "Small packages can still have lots of sugar per serving.", true], ["Has seeds", "Seeds can be good, but they do not fix every other ingredient.", false]] },
    { brand: "Choice Champ", title: "Snack Combo", theme: "blue", badge: "Kid approved", fine: "Candy pieces included", labels: [["Kid approved", "Approval claims can be vague and emotional.", true], ["Candy pieces", "Candy-style add-ins can shift a snack toward dessert.", true], ["Prize badge", "Rewards can push people to buy without checking nutrition.", true], ["Resealable bag", "Packaging convenience is not a health claim.", false]] }
  ];
  let state = loadJson(adLabStorageKey);
  if (!Number.isInteger(state.round)) state.round = 0;
  if (!Array.isArray(state.clicked)) state.clicked = [];
  state.round = Math.min(Math.max(state.round, 0), rounds.length - 1);

  function renderAdLab() {
    const round = rounds[state.round];
    const clickedSet = new Set(state.clicked);
    if (packageCard) {
      packageCard.className = `fake-package fake-package--round fake-package--${round.theme}`;
      packageCard.innerHTML = `
        <p class="fake-package__top">${round.brand}</p>
        <h3>${round.title}</h3>
        <p class="fake-package__claim">${round.badge}</p>
        <p class="fake-package__small">${round.fine}</p>
        ${round.labels.map(([label, detail, isTrick], index) => `
          <button class="ad-hotspot ad-hotspot--pos-${index + 1}${clickedSet.has(index) ? " is-found" : ""}" type="button" data-index="${index}">
            ${label}
          </button>
        `).join("")}
      `;
      packageCard.querySelectorAll(".ad-hotspot").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index);
          if (!state.clicked.includes(index)) state.clicked.push(index);
          renderAdLab();
        });
      });
    }
    const count = clickedSet.size;
    const totalDone = state.round + (count === round.labels.length ? 1 : 0);
    if (status) status.textContent = `Package ${state.round + 1} of ${rounds.length}: ${count} of ${round.labels.length} labels checked`;
    if (meter) meter.style.width = `${(totalDone / rounds.length) * 100}%`;
    if (findings) {
      findings.innerHTML = count
        ? round.labels
            .map(([label, detail, isTrick], index) => clickedSet.has(index) ? `<li><strong>${label}:</strong> ${isTrick ? "Trick. " : "Not automatically a trick. "}${detail}</li>` : "")
            .join("")
        : "<li>Click a label on the package to investigate it.</li>";
    }
    if (verdict) {
      const tricksFound = round.labels.filter((label, index) => clickedSet.has(index) && label[2]).length;
      const tricksTotal = round.labels.filter((label) => label[2]).length;
      verdict.textContent = count === round.labels.length
        ? `Verdict: ${tricksFound} of ${tricksTotal} labels were tricks. Move to the next package.`
        : `Verdict: keep checking. ${round.labels.length - count} label${round.labels.length - count === 1 ? "" : "s"} left.`;
    }
    if (next) {
      next.disabled = count < round.labels.length || state.round === rounds.length - 1;
      next.textContent = state.round === rounds.length - 1 && count === round.labels.length ? "Lab complete" : "Next package";
    }
    saveJson(adLabStorageKey, state);
  }

  if (next) next.addEventListener("click", () => {
    if (state.clicked.length < rounds[state.round].labels.length || state.round === rounds.length - 1) return;
    state.round += 1;
    state.clicked = [];
    renderAdLab();
  });

  if (reset) {
    reset.addEventListener("click", () => {
      state = { round: 0, clicked: [] };
      localStorage.removeItem(adLabStorageKey);
      renderAdLab();
    });
  }

  renderAdLab();
}

setupAdLab();

const cursorGlow = document.createElement("div");
let cursorGlowTimer;
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);
window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.classList.add("is-visible");
  clearTimeout(cursorGlowTimer);
  cursorGlowTimer = setTimeout(() => cursorGlow.classList.remove("is-visible"), 650);
});
window.addEventListener("mouseleave", () => cursorGlow.classList.remove("is-visible"));
