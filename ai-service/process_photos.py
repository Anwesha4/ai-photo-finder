from insightface.app import FaceAnalysis
import cv2
import os
import requests

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

UPLOADS_FOLDER = r"C:\Users\anwes\OneDrive\Desktop\ai-photo-finder\server\uploads"

NODE_URL = "http://localhost:5000/api/events/faces"

EVENT_ID = "6aad4cf3c65c1d1224f2bec2"


def process_photo(image_path):
    img = cv2.imread(image_path)

    if img is None:
        print(f"Could not read: {image_path}")
        return []

    faces = app.get(img)

    results = []

    for face in faces:
        results.append({
            "embedding": face.embedding.tolist(),
            "boundingBox": face.bbox.tolist()
        })

    return results


for filename in os.listdir(UPLOADS_FOLDER):

    if not filename.lower().endswith(
        (".jpg", ".jpeg", ".png", ".webp")
    ):
        continue

    image_path = os.path.join(
        UPLOADS_FOLDER,
        filename
    )

    faces = process_photo(image_path)

    print(
        f"{filename}: {len(faces)} face(s) detected"
    )

    try:

        response = requests.post(
            NODE_URL,
            json={
                "eventId": EVENT_ID,
                "filename": filename,
                "faces": faces
            }
        )

        print("Node response:", response.json())

    except Exception as error:
        print("Could not connect to Node:", error)