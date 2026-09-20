# AI Photo Finder

> Every photo you're in, without searching.

AI Photo Finder is an AI-powered event photo discovery platform. An organizer creates an event and shares its QR code. Attendees can upload event photos or submit a selfie. The AI detects faces, generates face embeddings, compares the selfie against faces found in event photos, and returns matching photos.

## Live Demo

http://13.233.90.109/

## Features

- Create events with a delete PIN
- Generate and share an event QR code
- Upload multiple event photos
- AI face detection and face embeddings
- Find photos containing an attendee from a selfie
- View and download matching photos
- Delete photos using the event PIN
- Responsive desktop/mobile interface
- AWS-based deployment and cloud photo storage

## How It Works

1. Organizer creates an event.
2. The application generates a QR code for that event.
3. Attendees scan the QR code and open the event.
4. Event photos are uploaded and processed by the Python AI service.
5. Faces are detected and their embeddings are stored with the photo metadata.
6. An attendee uploads a selfie.
7. The selfie is converted into a face embedding.
8. The embedding is compared with stored event-face embeddings.
9. Matching photos are displayed for the attendee to download.

## Architecture

```text
Browser
   |
   v
Nginx (AWS EC2)
   |
   +--> React/Vite production build
   |
   +--> Node.js/Express API
             |
             +--> MongoDB Atlas
             +--> Amazon S3
             +--> Python AI Service
                       |
                       +--> InsightFace
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
- MongoDB
- Mongoose
- Multer

### AI
- Python
- Flask
- Gunicorn
- InsightFace
- Face embeddings
- Similarity matching

### AWS / Cloud
- Amazon EC2
- Amazon S3
- AWS IAM
- Nginx
- MongoDB Atlas

## AWS Usage

AWS is part of the actual application architecture, not only the deployment target.

### EC2
The application runs on an EC2 instance with:
- Nginx
- React production build
- Node.js/Express API
- Python AI service

### S3
Uploaded event photos are also stored in Amazon S3 using:

```text
events/<event-id>/<filename>
```

### IAM
AWS IAM credentials are used by the backend for controlled S3 access.

## Project Structure

```text
ai-photo-finder/
├── client/
├── server/
├── ai-service/
└── README.md
```

Important areas:

```text
client/src/pages/
├── Home.jsx
├── CreateEvent.jsx
├── Event.jsx
└── FindMe.jsx

server/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js

ai-service/
├── app.py
└── process_photos.py
```

## Local Setup

### Prerequisites

- Node.js
- Python 3.11+
- MongoDB Atlas
- AWS S3 bucket
- Git

### Clone

```bash
git clone https://github.com/Anwesha4/ai-photo-finder.git
cd ai-photo-finder
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

Create `server/.env` with your MongoDB and AWS credentials:

```env
MONGO_URI=your_mongodb_connection_string
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
PORT=5000
```

### AI Service

```bash
cd ai-service
python -m venv venv
```

Activate the environment and install:

```bash
pip install -r requirements.txt
```

Run the Python service on port `8000`.

## Security

Secrets must remain in environment variables and must never be committed to GitHub.

Do not commit:

```text
.env
AWS access keys
MongoDB credentials
private deployment keys
```

## Problem

Large events can produce hundreds or thousands of photos. Attendees usually have to manually browse the entire gallery to find photos they appear in.

AI Photo Finder turns that into a simple workflow:

**Scan QR → Upload selfie → Get your photos.**

## Future Improvements

- Authentication and event ownership
- Automatic photo expiration and stronger privacy controls
- Background processing for large uploads
- Multiple AI workers and queue-based processing
- CDN-based image delivery
- Pagination and lazy loading
- Event analytics
- HTTPS and a custom domain

## Hackathon

Built as a hackathon project for the **WeMakeDevs Bharat Builds Tour / First Commit**.

## License

Created for educational and hackathon purposes.
