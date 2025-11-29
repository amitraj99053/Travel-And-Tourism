# MechanicConnect — Project Structure

## Final Organized Layout

```
Travel-And-Tourism/
├── index.html                          # Main landing page (entry point)
├── assets/                             # Centralized assets
│   ├── css/
│   │   └── styles.css                 # Global stylesheet
│   └── js/
│       └── main.js                    # Main JavaScript (cleaned & repaired)
├── pages/                              # Standalone pages
│   └── auth/
│       ├── login.html                 # Standalone login page
│       ├── signup.html                # Standalone signup page
│       ├── auth.css                   # Auth page styles
│       └── auth.js                    # Auth page scripts
├── backup/                             # Backup files (for rollback)
│   ├── main_js_corrupt_2025-11-30.js # Corrupted main.js snapshot
│   ├── script.js                      # Original root-level script
│   ├── styles.css                     # Original root-level styles
│   └── auth/                          # Original auth folder
├── Read.md                             # Project README
└── PROJECT_STRUCTURE.md               # This file
```

## Asset Links & References

### Main Entry Point: `index.html`
- **Stylesheet**: `<link rel="stylesheet" href="assets/css/styles.css">`
- **Script**: `<script src="assets/js/main.js"></script>`
- **Modal**: Embedded `#login-modal` with auth chooser (Traveler/Mechanic)
- **Contact Link**: Home icon in navbar → `#contact` (smooth scroll)

### Standalone Auth Pages

#### `pages/auth/login.html`
- **Back Link**: `<a href="../index.html">← Back to Home</a>`
- **Stylesheet**: `<link rel="stylesheet" href="../assets/css/styles.css">`
- **Auth Styles**: `<link rel="stylesheet" href="auth.css">`
- **Scripts**: 
  - `<script src="../assets/js/main.js"></script>` (shared)
  - `<script src="auth.js"></script>` (local)

#### `pages/auth/signup.html`
- **Back Link**: `<a href="../index.html">← Back to Home</a>`
- **Stylesheet**: `<link rel="stylesheet" href="../assets/css/styles.css">`
- **Auth Styles**: `<link rel="stylesheet" href="auth.css">`
- **Scripts**: 
  - `<script src="../assets/js/main.js"></script>` (shared)
  - `<script src="auth.js"></script>` (local)

## Features & Functionality

### Responsive & Mobile-First
- Mobile menu toggle with smooth transitions
- Viewport height fix (fixes mobile browser chrome shrink/grow)
- Touch-friendly interactions

### Authentication Flow
1. **Modal (In-Modal)**: 
   - `Get Started` button opens modal
   - User chooses role (Traveler/Mechanic)
   - Sign In or Sign Up within modal
2. **Standalone Pages**: 
   - Links in modal to full signup page
   - Back link to return to home

### Accessibility
- ARIA attributes (roles, labels, hidden states)
- Focus trap in modal
- Keyboard navigation (Tab, Shift+Tab, Escape)
- Semantic HTML

### Performance
- Lazy loading for images (data-src)
- GPU-promoted hero section
- Intersection observers for animations
- Optimized for slow connections

## Link Navigation Map

```
index.html (root)
  ├─ #hero (Hero section)
  ├─ #features (Features section)
  ├─ #how-it-works (How It Works section)
  ├─ #about (About section)
  ├─ #contact (Contact section with form)
  └─ Modal (#login-modal)
      ├─ Sign In view
      ├─ Sign Up view
      └─ Link to pages/auth/signup.html

pages/auth/login.html
  ├─ Back to index.html
  └─ Link to pages/auth/signup.html

pages/auth/signup.html
  ├─ Back to index.html
  └─ Link to pages/auth/login.html
```

## Backup Information

All original files have been moved to `backup/`:
- `main_js_corrupt_2025-11-30.js` — Pre-repair corrupted version
- `script.js`, `styles.css` — Original root-level files
- `auth/` — Original auth folder

These are kept for rollback purposes if needed.

## Setup & Testing

### Local Development Server
```bash
# From project root
python -m http.server 8000
# Then open: http://localhost:8000/index.html
```

### Verify Links
1. Open `http://localhost:8000/index.html`
2. Click "Get Started" → Modal opens
3. Click sign-in/up buttons → Views switch
4. Click "Open Signup Page" → Navigates to `pages/auth/signup.html`
5. Click "← Back to Home" → Returns to `index.html`
6. Click home icon → Scrolls to `#contact`

### Console Check
- No parse errors in DevTools console
- `window.AppHelpers` available with API:
  - `openLoginModal()`
  - `closeLoginModal()`
  - `setAuthModalMode('choose'|'signin'|'signup')`
  - `setViewportHeight()`
  - `debounce(fn, wait)`

---

**Status**: ✅ All files organized, centralized, and linked.  
**Last Updated**: November 30, 2025
