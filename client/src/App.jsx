
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import Event from "./pages/Event";
import FindMe from "./pages/FindMe.jsx";
import CreatorLogin from "./pages/CreatorLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/creator-login" element={<CreatorLogin />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/find-me/:id" element={<FindMe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
