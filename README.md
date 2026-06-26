# MatrixAI 🤖

MatrixAI is a full-stack AI chat application inspired by ChatGPT. It integrates Google's Gemini API with Retrieval-Augmented Generation (RAG), allowing users to upload their own documents and receive context-aware AI responses.

## ✨ Features

* 🔐 Session-based Authentication (Passport.js)
* 💬 Thread-based AI conversations
* 📝 Persistent chat history
* 📄 Upload TXT and PDF documents
* 🧠 Retrieval-Augmented Generation (RAG)
* 📌 Multi-document selection for context
* 🔄 Toggle between Normal Chat and RAG Chat
* ⚡ Google Gemini API integration
* 📱 Responsive user interface
* 🚀 Deployed on Render

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* CSS
* React Toastify
* React Icons

### Backend

* Node.js
* Express.js
* Passport.js
* Express Session
* Multer

### Database

* MongoDB Atlas
* Mongoose

### AI & RAG

* Google Gemini API
* Gemini Embedding API
* LangChain Text Splitter
* Cosine Similarity Search
* PDFReader

---

## 🏗 Architecture

```
User
   │
   ▼
React Frontend
   │
   ▼
Express Backend
   │
   ├── Authentication (Passport)
   ├── Chat Management
   ├── Document Upload
   └── RAG Pipeline
   │
   ▼
MongoDB Atlas
   │
   ▼
Gemini API
```

---

## 🧠 RAG Workflow

```
Upload Document
        │
        ▼
Extract Text
        │
        ▼
Split into Chunks
        │
        ▼
Generate Embeddings
        │
        ▼
Store in MongoDB
        │
        ▼
User Question
        │
        ▼
Similarity Search
        │
        ▼
Relevant Context
        │
        ▼
Gemini Response
```

---

## 📂 Project Structure

```
MatrixAI
├── Frontend
│   ├── components
│   ├── context
│   ├── pages
│   └── services
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── uploads
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the Backend directory.

```env
PORT=8080
MONGODB_URI=your_mongodb_connection
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/<your-username>/MatrixAI.git
cd MatrixAI
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔮 Future Improvements

* Markdown rendering
* Code syntax highlighting
* Streaming AI responses
* DOCX support
* Image-based RAG
* Voice input
* Chat export
* Chat search

---

## 📄 License

This project is licensed under the MIT License.
