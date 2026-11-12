
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);

  const isShared =
    new URLSearchParams(window.location.search).get("shared") === "true";

  // Event URL used by the QR code
  const eventUrl = `${frontendUrl}/event/${id}?shared=true`;

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // QR DOWNLOAD
  const downloadQR = () => {
    const canvas = document.querySelector("#event-qr");

    if (!canvas) {
      alert("QR code not found");
      return;
    }

    const link = document.createElement("a");
    link.download = `${event.name}-QR.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // COPY EVENT LINK
  const copyEventLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      alert("Event link copied!");
    } catch (error) {
      console.error("Copy error:", error);
      alert("Could not copy the event link");
    }
  };

  // SHARE EVENT
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Join ${event.name} on PhotoFinder`,
          url: eventUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      await copyEventLink();
    }
  };

  // UPLOAD PHOTOS
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

      await axios.post(`/api/events/${id}/photos`, formData);

      setSelectedFiles([]);
      await fetchEvent();

      alert("Photos uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // DELETE ENTIRE EVENT
  const handleDeleteEvent = async () => {
    const deletePin = window.prompt(
      "Enter the 4-digit creator PIN to delete this event:"
    );

    if (deletePin === null) {
      return;
    }

    if (!/^\d{4}$/.test(deletePin)) {
      alert("PIN must be exactly 4 digits.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${event.name}" and all its photos? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingEvent(true);

      await axios.delete(`/api/events/${id}`, {
        data: { deletePin },
      });

      alert("Event deleted successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Delete event error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete the event. Please try again."
      );
    } finally {
      setDeletingEvent(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // EVENT NOT FOUND
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">Event not found</p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            ← Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* EVENT HEADER */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-semibold transition"
        >
          ← Home
        </button>

        <h1 className="text-4xl md:text-5xl font-bold">
          {event.name}
        </h1>

        <p className="text-gray-400 mt-2">
          {event.description}
        </p>

        {/* SHARED EVENT MESSAGE */}
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

        {/* ACTIONS */}
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

        {/* SELECTED FILE COUNT */}
        {selectedFiles.length > 0 && (
          <p className="text-gray-400 mt-4">
            {selectedFiles.length} photos selected
          </p>
        )}

        {/* QR CODE AND CREATOR ACTIONS */}
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
                id="event-qr"
                value={eventUrl}
                size={220}
                includeMargin={true}
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Anyone with this QR code can contribute photos.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={downloadQR}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
              >
                ⬇ Download QR
              </button>

              <button
                onClick={shareEvent}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-semibold transition"
              >
                📤 Share Event
              </button>

              <button
                onClick={copyEventLink}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-semibold transition"
              >
                🔗 Copy Link
              </button>
            </div>

            {/* DELETE ENTIRE EVENT */}
            <div className="w-full max-w-lg mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-red-400">
                Danger Zone
              </h3>

              <p className="text-sm text-gray-400 mt-2 mb-4">
                Permanently delete this event and its associated photos.
                This action cannot be undone.
              </p>

              <button
                onClick={handleDeleteEvent}
                disabled={deletingEvent}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition"
              >
                {deletingEvent
                  ? "Deleting Event..."
                  : "🗑 Delete Entire Event"}
              </button>
            </div>
          </div>
        )}

        {/* GALLERY */}
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
                  key={photo.filename || index}
                  className="bg-gray-900 rounded-xl overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={`Event photo ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />

                  <div className="p-3 space-y-2">
                    <a
                      href={`/api/events/${id}/photos/${photo.filename}/download`}
                      className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
                    >
                      ⬇ Download Photo
                    </a>

                    {!isShared && (
                      <button
                        onClick={async () => {
                          const deletePin = window.prompt(
                            "Enter the 4-digit creator PIN to delete this photo:"
                          );

                          if (deletePin === null) {
                            return;
                          }

                          if (!/^\d{4}$/.test(deletePin)) {
                            alert("PIN must be exactly 4 digits.");
                            return;
                          }

                          const confirmed = window.confirm(
                            "Are you sure you want to delete this photo?"
                          );

                          if (!confirmed) {
                            return;
                          }

                          try {
                            await axios.delete(
                              `/api/events/${id}/photos/${photo.filename}`,
                              {
                                data: { deletePin },
                              }
                            );

                            await fetchEvent();
                            alert("Photo deleted successfully!");
                          } catch (error) {
                            console.error("Delete error:", error);

                            alert(
                              error.response?.data?.message ||
                                "Failed to delete photo."
                            );
                          }
                        }}
                        className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                      >
                        🗑 Delete Photo
                      </button>
                    )}
                  </div>
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
