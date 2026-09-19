import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FindMe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selfie, setSelfie] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelfie(file);
      setMatches([]);
      setError("");
    }
  };

  const handleFindPhotos = async () => {
    if (!selfie) {
      alert("Please upload a selfie first");
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);

    try {
      const formData = new FormData();

      formData.append("image", selfie);
      formData.append("eventId", id);

      const response = await fetch(
        "http://10.149.31.174:5000/api/events/find-photos",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to find photos");
      }

      setMatches(data.matches || []);
    } catch (error) {
      console.error("FIND PHOTOS ERROR:", error);

      setError(
        error.message || "Something went wrong while finding your photos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto text-center">

        <button
          onClick={() => navigate(`/event/${id}`)}
          className="mb-10 text-gray-400 hover:text-white"
        >
          ← Back to Event
        </button>

        <h1 className="text-4xl md:text-5xl font-bold">
          Find My Photos
        </h1>

        <p className="text-gray-400 mt-4">
          Upload a selfie and AI will find the event photos you're in.
        </p>

        <div className="mt-10 border-2 border-dashed border-gray-700 rounded-2xl p-12">

          {!selfie ? (
            <>
              <p className="text-xl font-semibold">
                Upload your selfie
              </p>

              <p className="text-gray-500 mt-2">
                JPG, PNG or JPEG
              </p>

              <label className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer font-semibold">
                Choose Selfie

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : (
            <>
              <img
                src={URL.createObjectURL(selfie)}
                alt="Selfie preview"
                className="mx-auto max-h-80 rounded-xl object-contain"
              />

              <p className="mt-4 text-gray-300">
                {selfie.name}
              </p>

              <div className="flex justify-center gap-4 mt-6">

                <label className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer">
                  Change Selfie

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <button
                  onClick={handleFindPhotos}
                  disabled={loading}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Finding Photos..." : "Find My Photos"}
                </button>

              </div>
            </>
          )}

        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-12 text-left">

            <h2 className="text-2xl font-bold text-center">
              We found {matches.length} photo
              {matches.length !== 1 ? "s" : ""} of you 🎉
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {matches.map((photo, index) => (
                <div
                  key={`${photo.filename}-${index}`}
                  className="bg-gray-900 rounded-xl overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={`Matching photo ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />

                  <div className="p-4 flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                      Matching photo
                    </p>

                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold"
                    >
                      View Photo
                    </a>
                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

        {!loading && selfie && matches.length === 0 && !error && (
          <div className="mt-10 text-gray-400">
            No matching photos found.
          </div>
        )}

      </div>
    </div>
  );
};

export default FindMe;