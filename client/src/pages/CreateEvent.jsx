import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        {
          name,
          description,
        }
      );

      console.log(response.data);

      navigate(`/event/${response.data._id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Create Your Event
        </h1>

        <label className="block mb-2">
          Event Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NIT Jamshedpur Tech Fest"
          className="w-full p-3 mb-5 rounded-lg bg-gray-800"
          required
        />

        <label className="block mb-2">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about the event..."
          className="w-full p-3 mb-6 rounded-lg bg-gray-800"
          rows="4"
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;