import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const isShared =
    new URLSearchParams(window.location.search).get("shared") === "true";

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `http://10.149.31.174:5000/api/events/${id}`
      );

      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select photos");
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      setUploading(true);

      await axios.post(
        `http://10.149.31.174:5000/api/events/${id}/photos`,
        formData
      );

      setSelectedFiles([]);

      await fetchEvent();

      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* Event Header */}
        <h1 className="text-4xl md:text-5xl font-bold">
          {event.name}
        </h1>

        <p className="text-gray-400 mt-2">
          {event.description}
        </p>

        {/* Shared Event Message */}
        {isShared && (
          <div className="mt-6 p-5 bg-purple-900/20 border border-purple-800 rounded-xl">
            <p className="font-semibold">
              You are viewing a shared event.
            </p>

            <p className="text-gray-400 mt-1">
              Add your photos to this event or find the photos you're in.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={() => navigate(`/find-me/${id}`)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
          >
            🔍 Find My Photos
          </button>

          <label className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer">
            📸 Upload Photos

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                setSelectedFiles(Array.from(e.target.files))
              }
            />
          </label>

          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Photos`}
            </button>
          )}

        </div>

        {/* Selected files count */}
        {selectedFiles.length > 0 && (
          <p className="text-gray-400 mt-4">
            {selectedFiles.length} photos selected
          </p>
        )}

        {/* QR Code - Creator Only */}
        {!isShared && (
          <div className="mt-12 bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center">

            <h2 className="text-2xl font-bold">
              Share This Event
            </h2>

            <p className="text-gray-400 mt-2 max-w-lg">
              Share this QR code with everyone at the event.
              Anyone who scans it can add their photos to this event.
            </p>

            <div className="mt-6 bg-white p-4 rounded-2xl">
              <QRCodeCanvas
                value={`http://10.149.31.174:5173/event/${id}?shared=true`}
                size={220}
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Anyone with this QR code can contribute photos.
            </p>

          </div>
        )}

        {/* Gallery */}
        <div className="mt-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              Event Photos
            </h2>

            <span className="text-gray-400">
              {event.photos.length} photos
            </span>

          </div>

          {event.photos.length === 0 ? (

            <div className="border border-dashed border-gray-700 rounded-xl p-16 text-center">

              <p className="text-gray-400">
                No photos uploaded yet.
              </p>

              <p className="text-gray-500 mt-2">
                Upload some photos to get started.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {event.photos.map((photo, index) => (

                <div
                  key={index}
                  className="bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center"
                >

                  <img
                    src={photo.url.replace(
                      "http://localhost:5000",
                      "http://10.149.31.174:5000"
                    )}
                    alt={`Event photo ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Event;