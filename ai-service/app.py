from flask import Flask, request, jsonify
from flask_cors import CORS
from insightface.app import FaceAnalysis
import numpy as np
import os
import cv2
import requests

app = Flask(__name__)
CORS(app)


def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (
        np.linalg.norm(a) * np.linalg.norm(b)
    )


# Load InsightFace once when the server starts
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0)


@app.route("/")
def home():
    return {
        "message": "AI Photo Finder service is running"
    }


@app.route("/extract-face", methods=["POST"])
def extract_face():
    if "image" not in request.files:
        return jsonify({
            "message": "No image uploaded"
        }), 400

    image = request.files["image"]

    temp_path = "temp_selfie.jpg"
    image.save(temp_path)

    try:
        img = cv2.imread(temp_path)

        if img is None:
            return jsonify({
                "message": "Could not read image"
            }), 400

        faces = face_app.get(img)

        if len(faces) == 0:
            return jsonify({
                "message": "No face detected"
            }), 400

        # Use the largest detected face
        face = max(
            faces,
            key=lambda x: (x.bbox[2] - x.bbox[0]) *
                          (x.bbox[3] - x.bbox[1])
        )

        embedding = face.embedding.tolist()

        return jsonify({
            "message": "Face detected successfully",
            "embedding": embedding
        })

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.route("/process-photo", methods=["POST"])
def process_photo():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data provided"
        }), 400

    image_path = data.get("imagePath")

    if not image_path:
        return jsonify({
            "message": "imagePath is required"
        }), 400

    img = cv2.imread(image_path)

    if img is None:
        return jsonify({
            "message": "Could not read image"
        }), 400

    # Detect ALL faces in the event photo
    faces = face_app.get(img)

    face_data = []

    for face in faces:
        face_data.append({
            "embedding": face.embedding.tolist(),
            "boundingBox": face.bbox.tolist()
        })

    return jsonify({
        "faces": face_data
    })


@app.route("/find-photos", methods=["POST"])
def find_photos():

    # Check selfie
    if "image" not in request.files:
        return jsonify({
            "message": "No image uploaded"
        }), 400

    # Check event ID
    event_id = request.form.get("eventId")

    if not event_id:
        return jsonify({
            "message": "eventId is required"
        }), 400

    image = request.files["image"]

    temp_path = "temp_selfie.jpg"
    image.save(temp_path)

    try:

        # --------------------------------
        # 1. Read selfie
        # --------------------------------

        img = cv2.imread(temp_path)

        if img is None:
            return jsonify({
                "message": "Could not read image"
            }), 400


        # --------------------------------
        # 2. Detect face in selfie
        # --------------------------------

        faces = face_app.get(img)

        if len(faces) == 0:
            return jsonify({
                "message": "No face detected"
            }), 400

        # Use largest face from selfie
        selfie_face = max(
            faces,
            key=lambda x: (x.bbox[2] - x.bbox[0]) *
                          (x.bbox[3] - x.bbox[1])
        )

        selfie_embedding = selfie_face.embedding


        # --------------------------------
        # 3. Get event face embeddings
        # --------------------------------

        response = requests.get(
            f"http://localhost:5000/api/events/{event_id}/faces"
        )

        if response.status_code != 200:
            return jsonify({
                "message": "Could not get event face data"
            }), 500

        event_data = response.json()


        # --------------------------------
        # 4. Compare selfie with EVERY face
        # --------------------------------

        # Store only the best matching face
        # for each photo.
        best_matches = {}

        for face in event_data["faces"]:

            similarity = cosine_similarity(
                selfie_embedding,
                face["embedding"]
            )

            print(
                face["filename"],
                "similarity:",
                similarity
            )

            # Matching threshold
            if similarity >= 0.5:

                filename = face["filename"]

                # If this photo hasn't matched yet,
                # store this face.
                #
                # If the photo already matched,
                # keep whichever face has the
                # highest similarity.
                if (
                    filename not in best_matches
                    or similarity >
                    best_matches[filename]["similarity"]
                ):

                    best_matches[filename] = {
                        "filename": filename,
                        "url": face["url"],
                        "similarity": float(similarity)
                    }


        # --------------------------------
        # 5. Convert matches to list
        # --------------------------------

        matches = list(best_matches.values())


        # --------------------------------
        # 6. Return matching photos
        # --------------------------------

        return jsonify({
            "message": "Matching completed",
            "matches": matches
        })


    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )