import express from "express";

import {
  createEvent,
  getEventById,
  uploadPhotos,
  updatePhotoFaces,
  getEventFaceData,
  findPhotos
} from "../controllers/eventController.js";

import upload, { uploadMemory } from "../middleware/upload.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:id", getEventById);
router.get("/:id/faces", getEventFaceData);
router.post("/:id/photos", upload.array("photos", 50), uploadPhotos);
router.post(
  "/find-photos",
  uploadMemory.single("image"),
  findPhotos
);
router.post("/faces", updatePhotoFaces);

export default router;