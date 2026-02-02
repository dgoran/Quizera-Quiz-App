import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../Contexts/SocketContext";
import Navbar from "../components/Common/Navbar";
import ParticipantsList from "../components/AdminRoom/ParticipantsList";
import QuestionSection from "../components/AdminRoom/QuestionSection";
import PresentationMode from "../components/AdminRoom/PresentationMode";
import Loading from "../components/Common/Loading";
import axios from "axios";

const AdminRoom = () => {
  const navigate = useNavigate();
  const { socketRef, send } = useSocket();
  const { quizId } = useParams();

  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [responseStats, setResponseStats] = useState({ responses: [], totalResponses: 0 });
  const roomCreatedRef = useRef(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleSocketReady = () => {
      if (!roomCreatedRef.current && socket.readyState === WebSocket.OPEN) {
        console.log("[AdminRoom] Creating room for quiz:", quizId);
        const success = send({ type: "createRoom", quizId: quizId });
        if (success) {
          roomCreatedRef.current = true;
        }
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      handleSocketReady();
    } else {
      socket.addEventListener('open', handleSocketReady);
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("AdminRoom received:", data);

      switch (data.type) {
        case "roomCreated":
          setRoomCode(data.roomCode);
          console.log("Room created with code:", data.roomCode);
          break;
        case "participantUpdate":
          setParticipants(data.participants);
          break;
        case "responseUpdate":
          setResponseStats({
            responses: data.responses,
            totalResponses: data.totalResponses
          });
          break;
        case "leaderboard":
          setLeaderboard(data.leaderboard);
          break;
        case "roomClosed":
          alert("Quiz ended. Returning to dashboard.");
          navigate("/admin");
          break;
        default:
          console.warn("Unknown message type:", data);
      }
    };

    return () => {
      socket.removeEventListener('open', handleSocketReady);
    };
  }, [socketRef, send, quizId, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await axios.get(`${apiUrl}/quiz/${quizId}`, {
          headers: { authorization: token },
        });
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleSendQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];

      // Reset response stats for new question
      setResponseStats({ responses: [], totalResponses: 0 });

      const success = send({
        type: "nextQuestion",
        questionId: nextQuestion.id,
      });

      if (success) {
        setCurrentIndex(nextIndex);
        // Auto-enter presentation mode when question is sent
        setPresentationMode(true);
      } else {
        alert("Connection lost. Please refresh the page.");
      }
    } else {
      send({ type: "showLeaderboard" });
      setPresentationMode(false);
    }
  };

  const handleEndQuiz = () => {
    const success = send({ type: "endQuiz" });
    if (!success) {
      alert("Connection lost. Please refresh the page.");
    }
  };

  if (loading) {
    return <Loading message="Setting up quiz room..." />;
  }

  // Presentation mode full-screen view
  if (presentationMode) {
    const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null;

    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Exit button */}
        <button
          onClick={() => setPresentationMode(false)}
          className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Presentation
        </button>

        <PresentationMode
          question={currentQuestion}
          responses={responseStats.responses}
          totalResponses={responseStats.totalResponses}
          roomCode={roomCode}
        />
      </div>
    );
  }

  // Normal admin view
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Room Code: {roomCode}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setPresentationMode(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Present
          </button>
          <button
            onClick={handleEndQuiz}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            End Quiz
          </button>
        </div>
      </div>

      <div className="flex flex-grow p-4 gap-4">
        <ParticipantsList participants={participants} />
        <QuestionSection
          leaderboard={leaderboard}
          questions={questions}
          currentIndex={currentIndex}
          handleSendQuestion={handleSendQuestion}
        />
      </div>
    </div>
  );
};

export default AdminRoom;
