import express from "express";
import path from "path";

import {
  createEvent,
  getEventById,
  uploadPhotos,
  updatePhotoFaces,
  getEventFaceData,
  findPhotos,
  deletePhoto
} from "../controllers/eventController.js";



import upload, { uploadMemory } from "../middleware/upload.js";

const router = express.Router();

router.post("/", createEvent);

// Download photo
router.get("/:id/photos/:filename/download", (req, res) => {
  const filePath = path.resolve(
    "uploads",
    req.params.filename
  );

  res.download(
    filePath,
    req.params.filename,
    (error) => {
      if (error) {
        console.error("DOWNLOAD ERROR:", error);
      }
    }
  );
});

router.delete("/:id/photos/:filename", deletePhoto);

router.get("/:id", getEventById);

router.get("/:id/faces", getEventFaceData);

router.post(
  "/:id/photos",
  upload.array("photos", 50),
  uploadPhotos
);

router.post(
  "/find-photos",
  uploadMemory.single("image"),
  findPhotos
);

router.post("/faces", updatePhotoFaces);

export default router;