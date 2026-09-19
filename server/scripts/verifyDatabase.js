import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Event from "../models/Event.js";

dotenv.config();

const uploadsDir = path.resolve("uploads");

const verifyDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("\nMongoDB connected.\n");

    // ========================================
    // 1. CHECK EVENTS
    // ========================================

    const events = await Event.find({});

    const invalidEvents = events.filter(
      (event) =>
        !event.deletePin ||
        !/^\d{4}$/.test(event.deletePin)
    );

    console.log("========================================");
    console.log("EVENT CHECK");
    console.log("========================================");

    console.log(`Total events: ${events.length}`);
    console.log(
      `Events without valid PIN: ${invalidEvents.length}`
    );


    // ========================================
    // 2. GET REFERENCED FILES
    // ========================================

    const referencedFiles = new Set();

    for (const event of events) {
      for (const photo of event.photos) {
        if (photo.filename) {
          referencedFiles.add(photo.filename);
        }
      }
    }


    // ========================================
    // 3. CHECK UPLOADS DIRECTORY
    // ========================================

    let orphanFiles = [];

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);

      orphanFiles = files.filter(
        (filename) => !referencedFiles.has(filename)
      );
    }

    console.log("\n========================================");
    console.log("PHOTO FILE CHECK");
    console.log("========================================");

    console.log(
      `Photos referenced by MongoDB: ${referencedFiles.size}`
    );

    console.log(
      `Orphan files: ${orphanFiles.length}`
    );


    // ========================================
    // 4. SHOW EVENTS
    // ========================================

    console.log("\n========================================");
    console.log("CURRENT EVENTS");
    console.log("========================================");

    for (const event of events) {
      console.log(
        `- ${event.name} | ${event.photos.length} photos | PIN: ${event.deletePin ? "YES" : "NO"}`
      );
    }


    // ========================================
    // 5. SHOW ORPHANS IF ANY
    // ========================================

    if (orphanFiles.length > 0) {
      console.log("\n========================================");
      console.log("ORPHAN FILES");
      console.log("========================================");

      orphanFiles.forEach((file) => {
        console.log(`- ${file}`);
      });
    }


    // ========================================
    // FINAL RESULT
    // ========================================

    console.log("\n========================================");
    console.log("VERIFICATION RESULT");
    console.log("========================================");

    if (
      invalidEvents.length === 0 &&
      orphanFiles.length === 0
    ) {
      console.log("✓ DATABASE IS CLEAN");
      console.log("✓ All events have valid PINs");
      console.log("✓ No orphan files found");
    } else {
      console.log("⚠ CLEANUP STILL REQUIRED");
    }

  } catch (error) {
    console.error("\nVERIFICATION ERROR:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyDatabase();