# MatrixAI

AI-powered chat application built with the MERN stack and Retrieval-Augmented Generation (RAG).

## Features

* User authentication with Passport.js and sessions
* Create and manage chat threads
* Persistent conversation history
* Gemini-powered AI chat
* Document upload and management
* RAG-enabled conversations
* Document chunking and embedding generation
* Semantic document retrieval using cosine similarity
* Multi-file selection for RAG queries
* Markdown and code block rendering
* Loading states and error handling

## Tech Stack

### Frontend

* React.js
* React Router
* Context API
* Fetch API
* React Hot Toast
* React Markdown
* Rehype Highlight
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Express Session
* Connect-Mongo
* Multer

### AI & RAG

* Google Gemini API
* Gemini Embeddings
* Retrieval-Augmented Generation (RAG)

## Architecture

User Query
↓
Generate Query Embedding
↓
Retrieve Relevant Document Chunks
↓
Build Context
↓
Send Context + Query to Gemini
↓
Generate Response

## Current Status

### Completed

#### Frontend

* Authentication pages
* Form validation
* Global state management
* Chat interface
* Thread management
* File management UI
* RAG file selection
* Markdown rendering
* Syntax highlighting
* Loading states
* Toast notifications
* Centralized API layer
* Session persistence

#### Backend

* Passport authentication
* Session management
* User registration
* User login
* User logout
* Thread CRUD operations
* Chat history storage
* File upload and deletion
* Document management
* Gemini integration
* Embedding generation
* RAG pipeline
* Cosine similarity retrieval
* Controller-Service architecture
* Error handling

#### Database

* Local MongoDB integration
* User storage
* Session storage
* Thread storage
* Document storage

### Next Tasks

* MongoDB Atlas migration
* Deployment

## Project Status

🚧 Active Development
