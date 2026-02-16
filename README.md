# Pokémon Catcher - Modular Structure

This is the refactored version of the Pokémon Catcher game, split into multiple files for easier maintenance and updates.

## File Structure

```
├── index.html          # Main HTML file with styles
├── app.js             # Main App component and game logic
├── pokemon.js         # Pokémon data (all 251 Pokémon)
├── items.js           # Pokéballs and items data
├── biomes.js          # Biome definitions
├── constants.js       # Game constants (type colors, rarity weights, etc.)
├── utils.js           # Utility functions (catch rate, weighted random, etc.)
├── components.js      # Reusable UI components (PokeImg, PBI)
├── styles.js          # Centralized styles object (CS)
└── screens.js         # All screen/page components (Home, Biomes, Encounter, etc.)
```

## What Each File Contains

### `pokemon.js`
- **RAW** - Raw Pokémon data array (all 251 Pokémon)
- **POKEMON_DB** - Processed Pokémon database with full objects
- **ALL_TYPES** - List of all Pokémon types

### `items.js`
- **POKEBALLS** - All Pokéball types with catch multipliers and prices
- **BALL_COLORS** - Visual colors for each Pokéball type
- **BALL_DESC** - Descriptions for each Pokéball
- **ITEMS** - Special items (berries, lures, smoke balls)

### `biomes.js`
- **BIOMES** - All 10 biome definitions with names, emojis, colors, and descriptions

### `constants.js`
- **TC** - Type Colors for all 18 Pokémon types
- **RW** - Rarity Weights for normal encounters
- **RWL** - Rarity Weights with Lure active
- **RC** - Rarity Colors for UI display
- **FR** - Flee Rates by rarity

### `utils.js`
- **spriteUrl()** - Generate Pokémon sprite URLs
- **wr()** - Weighted random selection for encounters
- **cr()** - Calculate catch rate
- **INIT** - Initial game state

### `components.js`
- **PokeImg** - Pokémon sprite image component
- **PBI** - Pokéball icon SVG component

### `styles.js`
- **CS** - Centralized styles object with all common styles

### `screens.js`
- **Home** - Home screen with stats and progress
- **Biomes** - Biome selection screen
- **Encounter** - Wild Pokémon encounter screen
- **Pokedex** - Pokédex with filtering
- **Shop** - Buy/sell items and Pokémon
- **Bag** - View inventory

### `app.js`
- **App** - Main app component
- Game state management
- Core game logic (encounter, throwBall, buy, sell, etc.)
- Save/load functionality

## Benefits of This Structure

1. **Easy Updates**: Change Pokémon data in `data.js` without touching other files
2. **No Redundancy**: When making UI changes, you don't rewrite the entire Pokédex
3. **Clear Organization**: Each file has a single, clear purpose
4. **Maintainable**: Easy to find and fix bugs
5. **Scalable**: Easy to add new features or screens

## How to Make Changes

### Adding a New Pokémon
Edit `pokemon.js` - add to the RAW array:
```javascript
[252, "NewPokemon", "Type", "biome", 100, "r", "🎮", 350]
```

### Adding a New Item
Edit `items.js` - add to the ITEMS or POKEBALLS array:
```javascript
{id:"newitem", name:"New Item", catchBonus:2.0, price:600, emoji:"🌟", desc:"2× catch boost"}
```

### Adding a New Biome
Edit `biomes.js` - add a new biome definition:
```javascript
newbiome: {name:"New Biome", emoji:"🎯", color:"#123456", desc:"Your description"}
```

### Changing Game Constants
Edit `constants.js` - modify rarity weights, type colors, flee rates, etc.

### Changing Styles
Edit `styles.js` - modify the CS object

### Adding a New Screen
1. Create component in `screens.js`
2. Import and use in `app.js`
3. Add navigation button in the header

### Modifying Game Logic
Edit `app.js` - update functions like `encounter()`, `throwBall()`, etc.

## Running the Game

Simply open `index.html` in a web browser. All files must be in the same directory.

Note: Due to CORS restrictions, you may need to run a local server:
```bash
python -m http.server 8000
# or
npx serve
```

Then open http://localhost:8000
