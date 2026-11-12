# AI Photo Finder

**Every photo you're in, without searching.**

AI Photo Finder is an AI-powered event photo discovery platform that helps people find their pictures without manually browsing hundreds of event photos. Organizers can create event galleries, share them through QR codes, and manage their photos. Attendees can upload a selfie to discover event photos in which they appear.

The application combines a React frontend, a Node.js backend, MongoDB, and a Python-based face recognition service powered by InsightFace.

## Features

- **Event Creation:** Create a dedicated gallery for an event with a four-digit delete PIN.
- **Creator Login:** Return to an existing event gallery using the event name and its four-digit PIN, without recreating the event.
- **QR Code Sharing:** Generate and share QR codes that link directly to event galleries.
- **Bulk Photo Upload:** Upload multiple event photos to a gallery.
- **AI Face Detection:** Detect faces in uploaded photos using InsightFace.
- **Face Embeddings:** Generate numerical face representations for similarity matching.
- **Find My Photos:** Upload a selfie to discover matching event photos.
- **Photo Downloads:** View and download photos from an event gallery.
- **Photo Deletion:** Allow the event creator to delete individual photos.
- **Event Deletion:** Delete an entire event after PIN verification.
- **Responsive Interface:** Access the application through a desktop or mobile browser.

## How It Works

1. An organizer creates an event and sets a four-digit PIN.
2. The application creates an event gallery and generates a shareable QR code.
3. Attendees scan the QR code to open the gallery.
4. The organizer uploads event photos.
5. The backend stores event information and photo metadata, while the AI service detects faces and generates face embeddings.
6. An attendee uploads a selfie through the **Find My Photos** feature.
7. The AI service generates an embedding for the selfie.
8. The application compares the selfie embedding against stored face data using similarity matching.
9. Matching photos are returned to the attendee for viewing and downloading.
10. The organizer can log in again using the event name and PIN to manage photos or delete the event.

## Architecture

```text
Browser
   |
   v
React + Vite Frontend
   |
   | HTTP / API Requests
   v
Node.js + Express Backend
   |
   +--> MongoDB Atlas
   |
   +--> Local Photo Storage
   |       |
   |       +--> Uploaded Event Photos
   |
   +--> Python Flask AI Service
             |
             +--> InsightFace
             |
             +--> Face Detection
             |
             +--> Face Embeddings
             |
             +--> Similarity Matching
```

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- QRCode

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer

### AI Service

- Python
- Flask
- InsightFace
- OpenCV
- NumPy
- ONNX Runtime
- Face embeddings and similarity matching

## Project Structure

```text
ai-photo-finder/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CreateEvent.jsx
│       │   ├── CreatorLogin.jsx
│       │   ├── Event.jsx
│       │   └── FindMe.jsx
│       ├── App.jsx
│       └── ...
├── server/
│   ├── controllers/
│   │   └── eventController.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   └── eventRoutes.js
│   └── server.js
├── ai-service/
│   ├── app.py
│   ├── process_photos.py
│   └── requirements.txt
└── README.md
```

## Local Setup

### Prerequisites

- Node.js and npm
- Python 3.11+
- MongoDB Atlas account or a MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Anwesha4/ai-photo-finder.git
cd ai-photo-finder
```

### 2. Configure the backend

Install dependencies:

```bash
cd server
npm install
```

Create a `server/.env` file containing the environment variables required by your backend. For example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Use the exact variable names expected by your code. Do not commit this file.

Start the backend using the script configured in `server/package.json`. If your project uses the `start` script:

```bash
npm start
```

### 3. Configure the AI service

Open a separate terminal from the project root:

```bash
cd ai-service
python -m venv venv
```

On Windows, activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask application using its configured entry point. The AI service runs on port `8000` in the local development setup.

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Configure `client/.env.local` if your frontend uses environment variables, such as the URL used to generate event-sharing links.

For local network testing, use a reachable LAN address when sharing galleries with other devices on the same network. Do not hardcode machine-specific IP addresses into application source code.

Start the frontend:

```bash
npm run dev
```

The Vite development server typically runs on port `5173`.

### 5. Run the complete application

Keep the three services running in separate terminals:

| Service | Local port |
|---|---:|
| React + Vite frontend | 5173 |
| Express backend | 5000 |
| Flask AI service | 8000 |

Ensure MongoDB is reachable and the backend can communicate with the AI service before testing face matching.

## Creator Access and Event Management

Event creators can return to an existing gallery through the **Creator Login** page using the event name and the existing four-digit event PIN.

The PIN is also used to authorize destructive operations, such as deleting photos or an entire event.

This is PIN-based access rather than a full user-account authentication system. Avoid reusing sensitive passwords as event PINs.

## Security and Privacy

- Keep database credentials and other secrets in environment variables.
- Never commit `.env` files, API keys, or private credentials to GitHub.
- Keep uploaded photos and face embeddings protected from unauthorized access.
- Use appropriate access controls before deploying the application publicly.
- Provide a clear photo retention and deletion policy when using the platform for real events.

## Problem Statement

Large events can generate hundreds or thousands of photos. Finding an individual picture in a shared gallery often requires manually browsing the entire collection.

AI Photo Finder simplifies the process with an AI-powered workflow:

**Scan QR code → Upload selfie → Find your photos.**

## Future Improvements

- Dedicated creator accounts and stronger authentication
- Improved privacy controls and automatic photo expiration
- Background processing for large photo uploads
- Queue-based processing and multiple AI workers
- Scalable cloud storage and CDN-based image delivery
- Pagination and lazy loading for large galleries
- Event analytics and gallery management tools
- HTTPS and a custom domain for production deployment

## License

No open-source license has been specified yet. All rights are reserved by default unless a license is added to the repository.