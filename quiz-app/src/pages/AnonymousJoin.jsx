import React, { useState } from "react";
import { useNavigate } from "react-router";

const AnonymousJoin = () => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleJoin = () => {
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!roomCode.trim()) {
      setMessage("Please enter a room code.");
      return;
    }

    // Store anonymous user data in localStorage
    localStorage.setItem("name", name.trim());
    localStorage.setItem("userId", `anon_${Date.now()}`);
    localStorage.setItem("isAnonymous", "true");

    // Navigate to the room
    navigate(`/room/${roomCode.trim()}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-12 w-full max-w-xl border border-gray-200/50">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-center flex-1">
              Join Quiz Anonymously
            </h2>
          </div>

          <p className="text-gray-600 text-center mb-8">
            No account needed! Just enter your name and room code to participate.
          </p>

          {message && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center">
              {message}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg uppercase"
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>

            <button
              onClick={handleJoin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Join Quiz
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousJoin;
