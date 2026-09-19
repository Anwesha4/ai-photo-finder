import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deletePin, setDeletePin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter an event name");
      return;
    }

    if (!/^\d{4}$/.test(deletePin)) {
      alert("Delete PIN must be exactly 4 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://10.149.31.174:5000/api/events",
        {
          name,
          description,
          deletePin,
        }
      );

      navigate(`/event/${response.data._id}`);
    } catch (error) {
      console.error("Create event error:", error);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl p-8">
        <h1 className="text-3xl font-bold">
          Create Event
        </h1>

        <p className="text-gray-400 mt-2">
          Create an event and share it with everyone.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div>
            <label className="block mb-2 font-semibold">
              Event Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. College Fest 2026"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Creator Delete PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              maxLength="4"
              value={deletePin}
              onChange={(e) =>
                setDeletePin(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="4-digit PIN"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-purple-500"
            />

            <p className="text-sm text-gray-500 mt-2">
              Keep this PIN safe. You will need it to delete photos.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;