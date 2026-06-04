# SafetyConnect Intelligence — Astro JS Site

## How to run this site

### Step 1 — Install Node.js
Download and install from: https://nodejs.org (choose the LTS version)

### Step 2 — Open terminal in this folder
- On Windows: Right-click the folder → "Open in Terminal"
- On Mac: Right-click the folder → "New Terminal at Folder"

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Start the site locally
```bash
npm run dev
```

Open your browser and go to: **http://localhost:4321**
Your site is running! 🎉

---

## Project Structure

```
/
├── public/
│   ├── images/       ← All your images
│   ├── css/          ← Your Webflow CSS
│   └── js/           ← Your Webflow JS
└── src/
    ├── components/
    │   ├── Navbar.astro
    │   ├── Hero.astro
    │   ├── HowItWorks.astro
    │   ├── FreeAssessment.astro
    │   ├── Framework.astro
    │   ├── CTA.astro
    │   └── Footer.astro
    ├── layouts/
    │   └── Layout.astro   ← Base HTML wrapper
    └── pages/
        └── index.astro    ← Main page (combines all components)
```

---

## Deploy for FREE on Netlify

1. Go to https://netlify.com and sign up free
2. Drag and drop this folder onto the Netlify dashboard
3. Your site goes live instantly with a free URL!

Or connect to GitHub for automatic deployments.
