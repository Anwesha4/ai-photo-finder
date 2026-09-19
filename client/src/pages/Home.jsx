import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="border-b border-gray-800/70 bg-gray-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-lg">
              📸
            </div>

            <span className="text-xl font-bold tracking-tight">
              Photo<span className="text-purple-500">Finder</span>
            </span>
          </button>

          <button
            onClick={() => navigate("/create-event")}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Create Event
          </button>

        </div>
      </nav>


      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-28">

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
              ✨ AI-powered event photo discovery
            </div>


            {/* Heading */}

            <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">

              Find every photo
              <br />

              <span className="text-purple-500">
                you're in.
              </span>

            </h1>


            {/* Description */}

            <p className="mt-7 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">

              Stop scrolling through hundreds of event photos.
              Upload a selfie and let AI find the moments you're part of.

            </p>


            {/* Buttons */}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

              <button
                onClick={() => navigate("/create-event")}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition shadow-lg shadow-purple-900/30"
              >
                Create an Event →
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl font-semibold text-lg transition"
              >
                How it works
              </button>

            </div>

          </div>


          {/* =========================
              PRODUCT FLOW VISUAL
          ========================= */}

          <div className="mt-20 max-w-5xl mx-auto">

            <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 md:p-10">

              <p className="text-center text-gray-500 text-sm font-medium mb-10">
                FROM EVENT TO YOUR PHOTOS
              </p>


              <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-5">


                {/* CREATE */}

                <div className="flex flex-col items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-2xl">
                    🎟️
                  </div>

                  <h3 className="font-semibold mt-4">
                    Create
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Start an event
                  </p>

                </div>


                {/* ARROW */}

                <div className="hidden md:block text-center text-gray-600 text-2xl">
                  →
                </div>


                {/* QR */}

                <div className="flex flex-col items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-2xl">
                    📱
                  </div>

                  <h3 className="font-semibold mt-4">
                    Share QR
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Guests join
                  </p>

                </div>


                {/* ARROW */}

                <div className="hidden md:block text-center text-gray-600 text-2xl">
                  →
                </div>


                {/* AI */}

                <div className="flex flex-col items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-2xl">
                    ✨
                  </div>

                  <h3 className="font-semibold mt-4">
                    AI Finds
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Your moments
                  </p>

                </div>

              </div>


              {/* MOBILE FLOW */}

              <div className="md:hidden flex justify-center text-gray-600 text-2xl my-4">
                ↓
              </div>

              <p className="text-center text-gray-500 text-sm mt-8">
                Create an event → share the QR → collect photos → find yourself
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section
        id="how-it-works"
        className="border-t border-gray-900"
      >

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="max-w-2xl">

            <p className="text-purple-400 font-semibold text-sm tracking-widest">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              Three simple steps.
            </h2>

            <p className="mt-5 text-gray-400 text-lg">
              No complicated setup. Just create, share, and find.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6 mt-14">


            {/* STEP 1 */}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center font-bold">
                  01
                </div>

                <span className="text-3xl">
                  🎟️
                </span>

              </div>

              <h3 className="text-xl font-bold mt-7">
                Create your event
              </h3>

              <p className="text-gray-400 mt-3 leading-relaxed">
                Create an event and get a unique QR code.
                Display it, download it, or share it with everyone attending.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center font-bold">
                  02
                </div>

                <span className="text-3xl">
                  📸
                </span>

              </div>

              <h3 className="text-xl font-bold mt-7">
                Collect event photos
              </h3>

              <p className="text-gray-400 mt-3 leading-relaxed">
                Guests scan the QR code and upload the photos
                they've taken during the event.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center font-bold">
                  03
                </div>

                <span className="text-3xl">
                  ✨
                </span>

              </div>

              <h3 className="text-xl font-bold mt-7">
                Find your photos
              </h3>

              <p className="text-gray-400 mt-3 leading-relaxed">
                Upload one selfie and our AI finds the event
                photos you're in.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHY PHOTOFINDER
      ========================= */}

      <section className="border-y border-gray-900 bg-gray-900/30">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="grid md:grid-cols-2 gap-16 items-center">


            {/* LEFT */}

            <div>

              <p className="text-purple-400 font-semibold text-sm tracking-widest">
                WHY PHOTOFINDER
              </p>

              <h2 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">

                Your memories shouldn't
                <span className="text-purple-500">
                  {" "}hide in a gallery.
                </span>

              </h2>

              <p className="mt-6 text-gray-400 text-lg leading-relaxed">

                At events, hundreds of photos are taken by
                different people. Finding the ones you're in
                shouldn't mean scrolling through all of them.

              </p>

            </div>


            {/* RIGHT */}

            <div className="grid sm:grid-cols-2 gap-4">


              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <div className="text-2xl">
                  🤖
                </div>

                <h3 className="font-bold text-lg mt-4">
                  AI Face Matching
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  One selfie is enough to find your photos.
                </p>

              </div>


              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <div className="text-2xl">
                  📱
                </div>

                <h3 className="font-bold text-lg mt-4">
                  QR Sharing
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Guests can join an event instantly.
                </p>

              </div>


              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <div className="text-2xl">
                  ⚡
                </div>

                <h3 className="font-bold text-lg mt-4">
                  Automatic Processing
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Photos are processed as they're uploaded.
                </p>

              </div>


              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <div className="text-2xl">
                  ⬇️
                </div>

                <h3 className="font-bold text-lg mt-4">
                  Easy Downloads
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Find and download the photos you want.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          USE CASES
      ========================= */}

      <section>

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-purple-400 font-semibold text-sm tracking-widest">
              MADE FOR EVENTS
            </p>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              One platform. Every moment.
            </h2>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">


            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">

              <div className="text-3xl">
                🎓
              </div>

              <p className="font-semibold mt-4">
                College Fests
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">

              <div className="text-3xl">
                💍
              </div>

              <p className="font-semibold mt-4">
                Weddings
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">

              <div className="text-3xl">
                💼
              </div>

              <p className="font-semibold mt-4">
                Conferences
              </p>

            </div>


            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">

              <div className="text-3xl">
                🎉
              </div>

              <p className="font-semibold mt-4">
                Parties
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="px-6 pb-24">

        <div className="max-w-5xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-purple-950/20 px-8 py-16 md:px-16 text-center">

            <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative">

              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to find your photos?
              </h2>

              <p className="text-gray-400 text-lg mt-5 max-w-xl mx-auto">
                Create an event, share the QR code,
                and let AI do the searching.
              </p>

              <button
                onClick={() => navigate("/create-event")}
                className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition"
              >
                Create an Event →
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-gray-800">

        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              📸
            </div>

            <span className="font-semibold">
              PhotoFinder
            </span>

          </div>

          <p className="text-gray-500 text-sm text-center">
            Find every photo you're in. Without searching.
          </p>

          <p className="text-gray-600 text-sm">
            Built for Bharat Builds Tour 🚀
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;