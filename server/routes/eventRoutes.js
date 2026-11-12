
import express from "express";
import path from "path";

import {
  createEvent,
  getEventById,
  uploadPhotos,
  updatePhotoFaces,
  getEventFaceData,
  findPhotos,
  deletePhoto,
  creatorLogin,
  deleteEvent,
} from "../controllers/eventController.js";

import upload, { uploadMemory } from "../middleware/upload.js";

const router = express.Router();

// Create a new event
router.post("/", createEvent);

// Creator login: find an existing event using its name and PIN
router.post("/creator-login", creatorLogin);

// Download a photo
router.get("/:id/photos/:filename/download", (req, res) => {
  const filePath = path.resolve("uploads", req.params.filename);

  res.download(filePath, req.params.filename, (error) => {
    if (error) {
      console.error("DOWNLOAD ERROR:", error);
    }
  });
});

// Delete an individual photo
router.delete("/:id/photos/:filename", deletePhoto);

// Delete an entire event
router.delete("/:id", deleteEvent);

// Get event details
router.get("/:id", getEventById);

// Get face data for an event
router.get("/:id/faces", getEventFaceData);

// Upload event photos
router.post(
  "/:id/photos",
  upload.array("photos", 50),
  uploadPhotos
);

// Find photos matching an uploaded face
router.post(
  "/find-photos",
  uploadMemory.single("image"),
  findPhotos
);

// Update photo face data
router.post("/faces", updatePhotoFaces);

export default router;
