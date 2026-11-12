
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatorLogin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [deletePin, setDeletePin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your event name.");
      return;
    }

    if (!/^\d{4}$/.test(deletePin)) {
      setError("PIN must contain exactly 4 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/events/creator-login",
        {
          name: name.trim(),
          deletePin,
        }
      );

      navigate(`/event/${response.data.eventId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white text-sm mb-6"
        >
          ← Back to Home
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Creator Login
        </h1>

        <p className="text-gray-400 mb-8">
          Return to an event you created using its name and
          creator PIN.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium mb-2"
            >
              Event Name
            </label>

            <input
              id="eventName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your existing event name"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="deletePin"
              className="block text-sm font-medium mb-2"
            >
              4-digit Creator PIN
            </label>

            <input
              id="deletePin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={deletePin}
              onChange={(e) =>
                setDeletePin(
                  e.target.value.replace(/\D/g, "").slice(0, 4)
                )
              }
              placeholder="Enter your PIN"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg py-3 font-semibold transition"
          >
            {loading ? "Checking..." : "Open My Event"}
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-6">
          Use the same event name and PIN you entered when
          creating your event.
        </p>
      </div>
    </div>
  );
}

export default CreatorLogin;
