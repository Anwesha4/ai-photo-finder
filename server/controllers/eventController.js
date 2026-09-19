import "dotenv/config";
import Event from "../models/Event.js";
import path from "path";
import fs from "fs";
import axios from "axios";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET;

export const createEvent = async (req, res) => {
  try {
    const { name, description, deletePin } = req.body;

    if (!name || !deletePin) {
      return res.status(400).json({
        message: "Event name and delete PIN are required",
      });
    }

    if (!/^\d{4}$/.test(deletePin)) {
      return res.status(400).json({
        message: "Delete PIN must be exactly 4 digits",
      });
    }

    const event = await Event.create({
      name,
      description,
      deletePin,
      photos: [],
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to create event",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);

    const event = await Event.findById(req.params.id);

    console.log("Found event:", event);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const processedPhotos = [];

    for (const file of req.files) {
      const photo = {
        url: `http://10.149.31.174:5000/uploads/${file.filename}`,
        filename: file.filename,
        faces: [],
      };

      // Add photo to event first
      event.photos.push(photo);

      // Get actual uploaded photo path
      const imagePath = path.resolve(file.path);

      /*
       * Upload photo to Amazon S3
       */
      try {
        const fileBuffer = await fs.promises.readFile(file.path);

        await s3.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: `events/${req.params.id}/${file.filename}`,
            Body: fileBuffer,
            ContentType: file.mimetype,
          })
        );

        console.log(
          `Uploaded ${file.filename} to S3 successfully`
        );
      } catch (s3Error) {
        console.error(
          `S3 upload failed for ${file.filename}:`,
          s3Error.message
        );

        /*
         * We continue because the local upload
         * and AI processing should still work.
         */
      }

      /*
       * Ask Flask / InsightFace to process the photo
       */
      try {
        const aiResponse = await axios.post(
          "http://127.0.0.1:8000/process-photo",
          {
            imagePath,
          }
        );

        const faces = aiResponse.data.faces || [];

        // Find the photo we just added
        const savedPhoto = event.photos.find(
          (p) => p.filename === file.filename
        );

        if (savedPhoto) {
          savedPhoto.faces = faces;
        }

        processedPhotos.push({
          filename: file.filename,
          faceCount: faces.length,
        });

      } catch (aiError) {
        console.error(
          `AI processing failed for ${file.filename}:`,
          aiError.message
        );

        processedPhotos.push({
          filename: file.filename,
          faceCount: 0,
          aiProcessingFailed: true,
        });
      }
    }

    await event.save();

    res.status(200).json({
      message: "Photos uploaded and processed successfully",
      photos: processedPhotos,
    });

  } catch (error) {
    console.error("UPLOAD PHOTOS ERROR:", error);

    res.status(500).json({
      message: "Failed to upload photos",
    });
  }
};

export const updatePhotoFaces = async (req, res) => {
  try {
    const { eventId, filename, faces } = req.body;

    if (!eventId || !filename || !faces) {
      return res.status(400).json({
        message: "eventId, filename and faces are required",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const photo = event.photos.find(
      (photo) => photo.filename === filename
    );

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    photo.faces = faces;

    await event.save();

    res.status(200).json({
      message: "Face data saved successfully",
      filename,
      faceCount: faces.length,
    });

  } catch (error) {
    console.error("UPDATE FACE ERROR:", error);

    res.status(500).json({
      message: "Failed to save face data",
    });
  }
};

export const getEventFaceData = async (req, res) => {
  try {
    const { id: eventId } = req.params;

    const event = await Event.findById(eventId).lean();

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const faceData = [];

    for (const photo of event.photos) {
      if (!photo.faces || photo.faces.length === 0) {
        continue;
      }

      for (const face of photo.faces) {
        faceData.push({
          filename: photo.filename,
          url: photo.url.replace(
            "http://localhost:5000",
            "http://10.149.31.174:5000"
          ),
          embedding: face.embedding,
          boundingBox: face.boundingBox,
        });
      }
    }

    res.status(200).json({
      eventId,
      faces: faceData,
    });

  } catch (error) {
    console.error("GET FACE DATA ERROR:", error);

    res.status(500).json({
      message: "Failed to get face data",
    });
  }
};

export const findPhotos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No selfie uploaded",
      });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "eventId is required",
      });
    }

    const formData = new FormData();

    formData.append(
      "image",
      new Blob([req.file.buffer]),
      req.file.originalname
    );

    formData.append("eventId", eventId);

    const response = await axios.post(
      "http://127.0.0.1:8000/find-photos",
      formData
    );

    res.status(200).json(response.data);

  } catch (error) {
    console.error("FIND PHOTOS ERROR:", error);

    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    }

    res.status(500).json({
      message: "Failed to find photos",
      error: error.message,
    });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const { deletePin } = req.body;

    if (!deletePin) {
      return res.status(400).json({
        message: "Delete PIN is required",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.deletePin !== deletePin) {
      return res.status(403).json({
        message: "Incorrect delete PIN",
      });
    }

    const photoIndex = event.photos.findIndex(
      (photo) => photo.filename === filename
    );

    if (photoIndex === -1) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    /*
     * Delete from local uploads folder
     */
    const filePath = path.resolve(
      "uploads",
      filename
    );

    try {
      await fs.promises.unlink(filePath);
    } catch (fileError) {
      console.error(
        "FILE DELETE ERROR:",
        fileError.message
      );
    }

    /*
     * Delete from S3
     */
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: `events/${id}/${filename}`,
        })
      );

      console.log(
        `Deleted ${filename} from S3 successfully`
      );

    } catch (s3Error) {
      console.error(
        `S3 delete failed for ${filename}:`,
        s3Error.message
      );
    }

    event.photos.splice(photoIndex, 1);

    await event.save();

    res.status(200).json({
      message: "Photo deleted successfully",
    });

  } catch (error) {
    console.error("DELETE PHOTO ERROR:", error);

    res.status(500).json({
      message: "Failed to delete photo",
    });
  }
};