import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const ViewQuiz = () => {
  const { authorization_token, setQuizId, API } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fillBlankInput, setFillBlankInput] = useState("");
  const [submittedResponses, setSubmittedResponses] = useState({});
  const [answerId, setAnswerId] = useState(null);
  const id = params.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://decoid-digital-assignment-backend.vercel.app/api/AvailableQuiz/getQuizDetails/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: authorization_token,
            },
          }
        );
        const data = await response.json();
        setQuestions([...data.optionType, ...data.FillInTheBlank]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [id, authorization_token]);

  useEffect(() => {
    if (questions.length === 0 || quizCompleted) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          moveToNextQuestion();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questions, quizCompleted]);

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(30);
      setFillBlankInput("");
    } else {
      submitResponses();
    }
  };

  const handleMCQSelect = (optionIndex) => {
    const currentQuestion = questions[currentQuestionIndex];

    setUserResponses((prevResponses) => {
      const updatedResponses = prevResponses.filter(
        (resp) =>
          resp.questionNumber !== currentQuestion.questionNumber ||
          resp.type !== "MCQ"
      );

      return [
        ...updatedResponses,
        {
          type: "MCQ",
          questionNumber: currentQuestion.questionNumber,
          answer: optionIndex + 1,
        },
      ];
    });
  };

  const handleFillBlankChange = (e) => {
    setFillBlankInput(e.target.value);
  };

  const saveFillBlankAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];

    setUserResponses((prevResponses) => {
      const updatedResponses = prevResponses.filter(
        (resp) =>
          resp.questionNumber !== currentQuestion.questionNumber ||
          resp.type !== "FillInTheBlank"
      );

      return [
        ...updatedResponses,
        {
          type: "FillInTheBlank",
          questionNumber: currentQuestion.questionNumber,
          answer: fillBlankInput.trim(),
        },
      ];
    });

    setSubmittedResponses((prev) => ({
      ...prev,
      [currentQuestion.questionNumber]: fillBlankInput.trim(),
    }));

    setFillBlankInput("");
  };

  const submitResponses = async () => {
    try {
      const response = await fetch(
        `https://decoid-digital-assignment-backend.vercel.app/api/AvailableQuiz/submitResponse/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization_token,
          },
          body: JSON.stringify({ responses: userResponses }),
        }
      );

      const result = await response.json();
      console.log("Result:", result);

      if (result.savedAnswer?._id) {
        setAnswerId(result.savedAnswer._id);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      setQuizCompleted(true);
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  useEffect(() => {
    if (quizCompleted && answerId) {
      console.log("Navigating to view-answer with ID:", answerId);
      setQuizId(id);
      navigate(`/view-answer/${answerId}`);
    }
  }, [quizCompleted, answerId, navigate]);

  if (loading) return <h2 className="text-center mt-5">Loading Quiz...</h2>;
  if (quizCompleted)
    return <h2 className="text-center mt-5">Quiz Completed! Redirecting...</h2>;
  if (questions.length === 0)
    return <h2 className="text-center mt-5">No questions found.</h2>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mt-4">
      <h2 className="text-center">Quiz</h2>
      <div className="card p-4">
        <h5 className="text-danger">Time Remaining: {timer}s</h5>
        <h4>{currentQuestion.questionText}</h4>

        {currentQuestion.options ? (
          <div>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`btn w-100 my-2 ${
                  userResponses.find(
                    (resp) =>
                      resp.questionNumber === currentQuestion.questionNumber &&
                      resp.answer === index + 1
                  )
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handleMCQSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Type your answer..."
              value={fillBlankInput}
              onChange={handleFillBlankChange}
            />
            <button
              className="btn btn-success mt-2"
              onClick={saveFillBlankAnswer}
            >
              Submit Answer
            </button>

            {submittedResponses[currentQuestion.questionNumber] && (
              <div className="mt-3">
                <strong>Your Answer: </strong>
                {submittedResponses[currentQuestion.questionNumber]}
              </div>
            )}
          </div>
        )}

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-success" onClick={moveToNextQuestion}>
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
