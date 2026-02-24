# FlashCard AI Coding Assistant Instructions

## Project Overview
FlashCard is a React Native mobile app (Expo-based) for learning Japanese N5 vocabulary. It's a single-screen flashcard app with Japanese word, pronunciations, translations (Chinese & English), example sentences, and a quiz feature.

**Key Architecture**: Everything runs in [App.js](App.js) as a single functional component. Styling is centralized in [AppStyle.js](AppStyle.js). Data is static JSON in [assets/data/card_database.json](assets/data/card_database.json).

## Data Model
The core data structure is a JSON array of vocabulary cards (8000+ entries). Each card has:
```json
{
  "Title": "Japanese word in hiragana",
  "Subtitle": "Kanji form (if applicable)",
  "Pronoun": "Romaji pronunciation",
  "Chinese": "Chinese translation",
  "English": "English translation",
  "Sample_JP": "Example sentence in hiragana",
  "Sample_KJ": "Example sentence in kanji",
  "Sample_En": "English translation of example"
}
```
**Critical**: Card indexing starts at 0. When navigating, `itemSeq=0` to `card_database.length-1`. Quiz mode always validates against `Title` field for answer matching.

## Core Features & Implementation Patterns

### 1. Card Navigation
- **State**: `itemSeq` (current card index), bounded by database length
- **Navigation logic**: Respects circular boundaries (wraps at start/end)
- **Three navigation modes**:
  - Sequential: `nextCard()` / `prevCard()` 
  - Random: `randomCard()` uses `Math.floor(Math.random() * (card_database.length-1))`
  - Gesture-based: Swipe left/right via `GestureRecognizer`

### 2. Audio/Speech System
- Uses **expo-speech** for TTS with hardcoded `{language:'ja-JP', rate:0.8}`
- Uses **expo-av** for audio session management (plays silent MP3 to initialize audio on iOS)
- Two functions: `readWord()` for card pronunciation, `readSample()` for example sentences
- **Pattern**: Always set audio mode before calling `Speech.speak()` to ensure iOS silent mode playback
- Pronunciation field uses `Subtitle` as fallback if available: `theWord.Subtitle === "" ? theWord.Title : theWord.Subtitle`

### 3. UI Toggles
- **showTranslate**: Controls opacity of Chinese/English text
- **showPronoun**: Controls opacity of pronunciation & speaker icon
- Both use ternary to toggle `1` ↔ `0`, applied via `opacity` style property
- Icons/images are static paths in component, requiring `require()` at render time

### 4. Quiz Feature
- **Flow**: Pick random card → generate 4-option multiple choice → submit answer → show result
- **Distractor generation**: Loops until 3 unique cards (by `Title` match) are collected
- **Shuffle**: Fisher-Yates shuffle on options array
- **Answer validation**: Compares `quizOptions[idx].Title === quizQuestion.Title`
- **Result styling**: Green highlight for correct, red for incorrect
- **State guards**: `if (quizAnswerIndex !== null) return;` prevents re-submission

### 5. Gesture System
- **Library**: `react-native-swipe-gestures` with `onSwipe` callback
- **Directions**: SWIPE_LEFT (next), SWIPE_RIGHT (prev), SWIPE_UP (speak), SWIPE_DOWN (random)
- **Pattern**: Switch on `gestureName` string enum, pass current card object to handlers

## Build & Run Commands
```bash
npm start              # Start Expo dev server
npm run android        # Build & run Android APK
npm run ios           # Build & run iOS app
npm run web           # Launch web version
```
**Note**: Project uses **Expo CLI**, not bare React Native. iOS requires CocoaPods (check `ios/Podfile`).

## Styling Architecture
- [AppStyle.js](AppStyle.js) exports single `StyleSheet.create()` object
- Responsive design uses `Dimensions.get('window')` for `screenWidth` / `screenHeight`
- Common patterns:
  - Views use `flex` direction with `alignItems: 'center'` + `justifyContent: 'space-evenly'`
  - Text opacity is dynamically controlled via style array: `style={[styles.text, {opacity: showTranslate}]}`
  - Images use `require()` and must be static strings (no variables in require path)

## Common Pitfalls & Conventions
1. **Image paths**: Always use `require()` with static strings, not variables. Store image paths as string constants at component top.
2. **Audio initialization**: Must configure audio mode BEFORE calling `Speech.speak()`, especially for iOS.
3. **Modal management**: Use separate `*Visible` state bools for each modal (menuVisible, quizVisible, aboutVisible).
4. **Array mutations**: Use spread operator for state arrays; never mutate directly.
5. **Card boundaries**: When querying `card_database[index]`, always validate index is in bounds to avoid crashes.
6. **Quiz answer matching**: Use `.find()` to check Title uniqueness; matches are strict equality on `Title` field.

## Dependencies & Key Versions
- **expo**: 51.0.39 (managed build system)
- **react-native**: 0.74.5
- **expo-speech**: 12.0.2 (TTS)
- **expo-av**: 14.0.7 (audio playback)
- **react-native-swipe-gestures**: 1.0.5 (gesture detection)

## Extending Quiz Feature

### Adding Quiz Variants
To add new quiz modes (difficulty levels, timed quizzes, etc.), extend the quiz state pattern:

```javascript
// Add state for quiz variants
const [quizMode, setQuizMode] = useState('standard'); // 'standard', 'timed', 'hard'
const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 }); // Track scores

// Modify startQuiz() to accept mode parameter
function startQuiz(mode = 'standard') {
  setQuizMode(mode);
  const qIdx = Math.floor(Math.random() * card_database.length);
  const question = card_database[qIdx];
  
  // For hard mode: increase distractor difficulty
  const distractorCount = mode === 'hard' ? 4 : 3;
  const options = [question];
  while (options.length < distractorCount + 1) {
    const idx = Math.floor(Math.random() * card_database.length);
    const candidate = card_database[idx];
    if (!options.find(o => o.Title === candidate.Title)) options.push(candidate);
  }
  
  // Fisher-Yates shuffle (existing pattern)
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  setQuizQuestion(question);
  setQuizOptions(options);
  setQuizAnswerIndex(null);
  setQuizResult(null);
  setQuizVisible(true);
}

// Update submitAnswer() to track stats
function submitAnswer(idx) {
  if (quizAnswerIndex !== null) return;
  const correct = quizOptions[idx].Title === quizQuestion.Title;
  setQuizAnswerIndex(idx);
  setQuizResult(correct);
  if (correct) {
    setQuizStats({ ...quizStats, correct: quizStats.correct + 1, total: quizStats.total + 1 });
  } else {
    setQuizStats({ ...quizStats, total: quizStats.total + 1 });
  }
}
```

### Key Extension Points
- **Distractor filtering**: Filter `card_database` before distractor selection (e.g., by word type, frequency tier)
- **Answer validation**: Keep strict equality on `Title` field; add semantic variations only if data schema changes
- **Result feedback**: Add performance summaries in quiz modal using `quizStats` state
- **Quiz persistence**: Initialize session stats in `useEffect` if adding score persistence

## Adding New Card Navigation Modes

### Navigation Mode Architecture
Current modes use `itemSeq` state with bounded index logic. Extend by:

1. **Add mode selector state**:
```javascript
const [navMode, setNavMode] = useState('sequential'); // 'sequential', 'filtered', 'learning'
const [filterCriteria, setFilterCriteria] = useState(null); // Store active filter
```

2. **Create filtered dataset function**:
```javascript
function getActiveCardset() {
  if (navMode === 'sequential') return card_database;
  if (navMode === 'favorites') return card_database.filter(card => userFavorites.includes(card.Title));
  // Add more filter types as needed
  return card_database;
}

const activeCards = getActiveCardset();
```

3. **Update navigation bounds to use active cardset**:
```javascript
function nextCard() {
  if (itemSeq < activeCards.length - 1) {
    setItemSeq(itemSeq + 1);
  } else {
    setItemSeq(0); // Wrap to start
  }
}

function prevCard() {
  if (itemSeq >= 1) {
    setItemSeq(itemSeq - 1);
  } else {
    setItemSeq(activeCards.length - 1); // Wrap to end
  }
}

// Update render to use activeCards[itemSeq] instead of card_database[itemSeq]
```

### Practical Extension Examples

**Learning Mode** (sequential with progress):
```javascript
const [startIndex, setStartIndex] = useState(0);
const [endIndex, setEndIndex] = useState(50); // Study 50 cards at a time

function setLearningRange(start, end) {
  setStartIndex(start);
  setEndIndex(end);
  setItemSeq(0);
  setNavMode('learning');
}

function getActiveCardset() {
  if (navMode === 'learning') return card_database.slice(startIndex, endIndex);
  return card_database;
}
```

**Category Filter** (if data schema expands):
```javascript
const [selectedCategory, setSelectedCategory] = useState(null);

function getActiveCardset() {
  if (navMode === 'filtered' && selectedCategory) {
    return card_database.filter(card => card.Category === selectedCategory);
  }
  return card_database;
}
```

### Important Constraints
- **Maintain circular boundaries**: All modes should wrap at start/end to avoid index errors
- **Preserve gesture system**: `onSwipe` handler passes `activeCards[itemSeq]` to maintain compatibility
- **Index reset on mode change**: Always call `setItemSeq(0)` when switching navigation modes
- **Menu integration**: Add mode selector buttons to existing menu modal structure

## Development Notes
- **Single file architecture**: All logic in App.js; consider componentization only if UI complexity grows significantly.
- **Data-driven**: Entire app behavior depends on card_database array structure. If data schema changes, update all references to card field names.
- **No state persistence**: App doesn't save user progress (progress state exists only during session).
- **Responsive design focus**: App scales to different screen sizes via Dimensions API and percentage-based layouts.
