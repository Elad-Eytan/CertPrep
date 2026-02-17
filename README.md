# CertPrep Pro

CertPrep Pro is an **offline-first, mobile-optimized certification practice application** built with **React + TypeScript + Vite**.

It allows you to practice multiple-choice certification exams by uploading JSON exam dumps — directly in your browser or via the provided Android APK.

No backend.
No database.
Everything runs locally on your device.

---

## 📱 Android Users

An Android build is already included in this repository:

```
CertPrep.apk
```

You can:

1. Download the `CertPrep.apk` file directly from the repository
2. Transfer it to your Android device
3. Install it (you may need to allow installation from unknown sources)

No build steps required.

---

## 🚀 Core Features

| Feature                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| Offline-First                 | Runs fully client-side with no server required       |
| JSON Upload                   | Drag & drop exam dump files                          |
| Single / Multi-Select Support | Automatically detects `"A"` vs `"AC"` answers        |
| Strict Validation             | Only exact correct combinations count                |
| Explanation Engine            | Displays official description and parsed explanation |
| Leaderboard                   | Stores results locally using browser `localStorage`  |
| Mobile-Optimized UI           | Tailwind CSS mobile-first layout                     |
| Android Support               | Prebuilt APK included in repo                        |

---

## 📁 JSON Format

The application expects a JSON array of questions.

Each question object must contain:

| Field               | Required | Description                                       |
| ------------------- | -------- | ------------------------------------------------- |
| `body`              | ✅        | Question text                                     |
| `options`           | ✅        | Array of `"A. ..."`, `"B. ..."` formatted options |
| `answer`            | ✅        | Correct answer letters (`"A"` or `"AC"`)          |
| `answerDescription` | Optional | Explanation shown after answering                 |

---

### Minimal Example

```json
[
  {
    "body": "What is the capital of France?",
    "options": [
      "A. London",
      "B. Paris",
      "C. Berlin",
      "D. Madrid"
    ],
    "answer": "B",
    "answerDescription": "Paris is the capital of France."
  }
]
```

---

## 🧪 Sample Exam Included

The repository includes:

```
amazon-aws-certified-cloud-practitioner-1590.json
```

Drag & drop this file into the app to start practicing immediately.

---

## 💻 Development

For running the project locally on desktop:

See:

- [For Desktop development. Read the README_DESKTOP](WebApp/README_DESKTOP.md)


---

## 🏗 Tech Stack

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons
* Recharts
