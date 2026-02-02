import React from "react";

const PresentationMode = ({ question, responses, totalResponses, roomCode }) => {
  if (!question) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Quizera</h1>
          <p className="text-2xl mb-8">Waiting for next question...</p>
          <div className="text-lg opacity-80">Room Code: {roomCode}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Header with room code */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-600 text-lg">
          Room Code: <span className="font-bold text-blue-600">{roomCode}</span>
        </div>
        <div className="text-gray-600 text-lg">
          Responses: <span className="font-bold text-blue-600">{totalResponses}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 mb-8">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          {question.text}
        </h2>
      </div>

      {/* Response Chart */}
      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 overflow-auto">
        <div className="space-y-6">
          {responses && responses.map((response, index) => {
            const colors = [
              'from-blue-500 to-blue-600',
              'from-green-500 to-green-600',
              'from-yellow-500 to-yellow-600',
              'from-red-500 to-red-600',
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600',
            ];
            const colorClass = colors[index % colors.length];

            return (
              <div key={response.optionId} className="space-y-2">
                {/* Option label */}
                <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                  <span>({String.fromCharCode(65 + index)}) {response.optionText}</span>
                  <span className="text-2xl">{response.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out flex items-center justify-end pr-4`}
                    style={{ width: `${response.percentage}%` }}
                  >
                    {response.count > 0 && (
                      <span className="text-white font-bold text-xl">
                        {response.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalResponses === 0 && (
          <div className="text-center text-gray-500 text-xl mt-12">
            Waiting for responses...
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationMode;
