# Plan: Dark/Light Mode Toggle Button

## Objective
Add a button to each sidebar that toggles between dark and light mode when clicked. When dark mode is active, clicking switches to light mode, and vice versa.

## Files Found
- `ThemeContext.jsx` - Already has theme state with toggleTheme function ✓
- `main.jsx` - Wraps App with ThemeProvider ✓  
- `index.css` - Has basic light/dark CSS rules
- Three sidebars needing toggle buttons:
  - `component/dg/Dgsidebar.jsx` (Director General)
  - `component/SideBar.jsx` (Admin)
  - `component/directeur/Directeursidebar.jsx` (Direction Director)

## Implementation Steps

### Step 1: Add ThemeToggleButton to DGSidebar.jsx
- Import useTheme hook from ThemeContext
- Add a toggle button near the user profile section
- Button shows sun icon for dark mode, moon icon for light mode

### Step 2: Add ThemeToggleButton to SideBar.jsx
- Import useTheme hook from ThemeContext
- Add toggle button similar to DGSidebar

### Step 3: Add ThemeToggleButton to Directeursidebar.jsx
- Import useTheme hook from ThemeContext
- Add toggle button similar to other sidebars

### Step 4: Enhance index.css
- Add comprehensive light mode styles for inline styled elements

## Buttons to Edit
1. `frontend/src/component/dg/Dgsidebar.jsx`
2. `frontend/src/component/SideBar.jsx` 
3. `frontend/src/component/directeur/Directeursidebar.jsx`
