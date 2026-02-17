# Running CertPrep Pro on Desktop

This guide explains how to run the CertPrep Pro application locally on your PC.

---

## 1️⃣ Install Node.js (Required)

This project uses **Node.js + Vite + TypeScript**.

### Download Node.js

Download the **LTS version (v18 or later)** from:

👉 [https://nodejs.org](https://nodejs.org)

After installation, verify:

```bash
node -v
npm -v
```

You should see:

```
v18.x.x  (or higher)
```

---

## 2️⃣ Clone the Repository

```bash
git clone https://github.com/Elad-Eytan/CertPrep
cd CertPrep
```

Now navigate into the **WebApp directory**:

```bash
cd WebApp
```

🔑 
All development commands must be executed from inside the `WebApp` directory — not the root folder.

---

## 3️⃣ Install Dependencies (What Exactly Gets Installed?)

Instead of blindly saying `npm install`, here is what actually happens:

The `package.json` inside `WebApp` defines the packages needed:

### Production Dependencies

* react
* react-dom
* lucide-react
* recharts
* clsx
* tailwind-merge

### Development Dependencies

* vite
* typescript
* tailwindcss
* postcss
* autoprefixer

To install exactly what the project requires:

```bash
npm install
```

- ✔ This installs only the dependencies defined in `WebApp/package.json`.
- ✔ It does NOT install the entire global npm registry.
- ✔ It installs into `WebApp/node_modules`.

If you want to see what will be installed before installing:

```bash
npm install --dry-run
```

---

## 4️⃣ Start the Development Server

```bash
npm run dev
```

You will see something like:

```
Local: http://localhost:5173/
```

Open the URL in your browser.

```url
http://localhost:5173/
```

---

## 5️⃣ Mobile View (Recommended)

Since this app is mobile-first:

1. Right click → Inspect
2. Toggle Device Toolbar (📱 icon)
3. Choose iPhone / Android viewport

---

## 6️⃣ Common Errors

### ❌ "Module not found"

Make sure:

* You are inside the `WebApp` directory
* You ran `npm install`
* There is no accidental `src` folder wrapping files

---

## Summary

Install Node → Clone repo → cd into WebApp → npm install → npm run dev → open browser.