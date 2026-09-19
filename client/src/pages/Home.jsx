import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          AI Photo Finder
        </h1>

        <p className="text-gray-400 mb-8">
          Find every photo you're in.
        </p>

        <button
          onClick={() => navigate("/create-event")}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default Home;