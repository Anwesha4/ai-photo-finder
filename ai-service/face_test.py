from insightface.app import FaceAnalysis
import cv2

# Load face analysis model
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

# Change this to the path of one of your event photos
image_path = r"C:\Users\anwes\OneDrive\Desktop\ai-photo-finder\server\uploads\photo2.jpeg"

# Read image
img = cv2.imread(image_path)

if img is None:
    print("Could not read image")
    exit()

# Detect faces
faces = app.get(img)

print(f"Faces detected: {len(faces)}")

for i, face in enumerate(faces):
    print(f"Face {i + 1}")
    print("Bounding box:", face.bbox)
    print("Embedding size:", len(face.embedding))