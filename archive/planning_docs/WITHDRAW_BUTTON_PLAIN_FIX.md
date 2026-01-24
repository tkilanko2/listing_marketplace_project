# Withdraw Button - Plain Outline Style

## Change
Removed the green fill inside the "Withdraw Now" button, making it a clean outline button.

## Before:
```css
bg-white bg-opacity-20 backdrop-blur-sm
```
- Had a translucent white/glass fill inside

## After:
```css
bg-transparent
```
- Completely plain/transparent background
- Only white outline border
- White text
- Subtle hover effect (10% white overlay)

## Visual Result
**Plain outline button on green card:**
- No fill/background color
- Clean white border (2px)
- White text
- Minimal and modern
- On hover: subtle white overlay appears

## Button States:
- **Default**: Transparent bg + white border + white text
- **Hover**: 10% white overlay + white border + white text
- **Click**: (can add if needed)

✅ Much cleaner appearance without competing fills

