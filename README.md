# 🚀 GenCode Backend

This is the backend for **GenCode**, an AI-powered platform to generate and solve competitive programming questions from user-defined prompts.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/karannfr/GenCode-Backend.git
cd GenCode-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_2_5_flash_key
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY=your_rapidapi_judge0_key
```

> ⚠️ Keep your `.env` file private — never push it to GitHub.

---

### 4. Start the Server

```bash
npm start
```

The server will start on:

```
http://localhost:5000
```

---

## 🌐 CORS

This backend only accepts requests from:

```
https://gencode.karnx.dev
```

To allow other domains (for dev or testing), update the CORS whitelist in `server.js`.

---

## 📦 Features

- ✨ Generate coding problems using **Gemini 2.5 Flash**
- 🧠 Execute code in real time with **Judge0 API**
- 🔐 Secure user authentication via **JWT**
- 📊 Track user submissions and performance history
- ⏱️ Rate-limiting to prevent abuse

---


## 🧪 Testing

You can test endpoints using:

- Postman
- curl
- The deployed frontend: [https://gencode.karnx.dev](https://gencode.karnx.dev)

After exceeding the request threshold, the server will return:

```json
{
  "error": "Too many requests"
}
```

(Status code: `429`)

---

