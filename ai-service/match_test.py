from insightface.app import FaceAnalysis
import cv2
import numpy as np

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)


def get_embedding(image_path):
    img = cv2.imread(image_path)

    if img is None:
        print(f"Could not read: {image_path}")
        return None

    faces = app.get(img)

    if len(faces) == 0:
        print(f"No face found in {image_path}")
        return None

    print(f"{image_path}: {len(faces)} face(s) detected")

    return faces[0].embedding


def cosine_similarity(a, b):
    return np.dot(a, b) / (
        np.linalg.norm(a) * np.linalg.norm(b)
    )


embedding1 = get_embedding("me.jpeg")
embedding2 = get_embedding("other.jpg")

if embedding1 is not None and embedding2 is not None:

    similarity = cosine_similarity(
        embedding1,
        embedding2
    )

    print("Similarity:", similarity)