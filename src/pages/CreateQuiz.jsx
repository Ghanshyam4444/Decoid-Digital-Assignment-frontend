import React, { useState } from "react";
import { useAuth } from "../store/auth";
const CreateQuiz = () => {
  const { authorization_token, API } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [fillInTheBlankQuestion, setFillInTheBlankQuestion] = useState("");
  const [fillInTheBlankAnswer, setFillInTheBlankAnswer] = useState("");
  const [error, setError] = useState("");

  const addQuestion = (type) => {
    if (type === "multipleChoice") {
      if (!questionText.trim()) {
        setError("Question text is required.");
        return;
      }
      if (options.some((opt) => !opt.trim())) {
        setError("All options are required.");
        return;
      }
      if (
        !correctAnswer ||
        isNaN(correctAnswer) ||
        correctAnswer < 1 ||
        correctAnswer > 4
      ) {
        setError("Correct answer must be a number between 1 and 4.");
        return;
      }
    } else {
      if (!fillInTheBlankQuestion.trim()) {
        setError("Question text is required.");
        return;
      }
      if (!fillInTheBlankAnswer.trim()) {
        setError("Correct answer is required for fill in the blank question.");
        return;
      }
    }

    setError("");
    const newQuestion =
      type === "multipleChoice"
        ? {
            type: "multipleChoice",
            text: questionText,
            options,
            answer: correctAnswer,
          }
        : {
            type: "fillInTheBlank",
            text: fillInTheBlankQuestion,
            answer: fillInTheBlankAnswer,
          };

    setQuestions([...questions, newQuestion]);
    resetForm(type);
  };

  const resetForm = (type) => {
    if (type === "multipleChoice") {
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } else {
      setFillInTheBlankQuestion("");
      setFillInTheBlankAnswer("");
    }
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const AddQuiz = async () => {
    try {
      const response = await fetch(
        `https://decoid-digital-assignment-backend.vercel.app/api/admin/AddQuiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization_token,
          },
          body: JSON.stringify({
            questions: questions,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      console.log("Quiz submitted successfully:", data);
      alert("Quiz submitted successfully!");
      setQuestions([]);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Create Your Quiz</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4 mb-4">
        <h4>Multiple Choice Question</h4>
        <input
          type="text"
          className="form-control mb-2"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
        />
        {options.map((option, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
            />
          </div>
        ))}
        <div className="mt-2">
          <label className="form-label">Select Correct Answer</label>
          <div className="d-flex gap-2">
            {options.map((_, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  name="correctAnswer"
                  className="form-check-input"
                  value={index + 1}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  checked={correctAnswer === String(index + 1)}
                />
                <label className="form-check-label">Option {index + 1}</label>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-primary mt-2"
          onClick={() => addQuestion("multipleChoice")}
        >
          Add Multiple Choice Question
        </button>
      </div>

      <div className="card p-4 mb-4">
        <h4>Fill in the Blank Question</h4>
        <input
          type="text"
          className="form-control mb-2"
          value={fillInTheBlankQuestion}
          onChange={(e) => setFillInTheBlankQuestion(e.target.value)}
          placeholder="Enter the question"
        />
        <input
          type="text"
          className="form-control"
          value={fillInTheBlankAnswer}
          onChange={(e) => setFillInTheBlankAnswer(e.target.value)}
          placeholder="Enter the correct answer"
        />
        <button
          className="btn btn-primary mt-2"
          onClick={() => addQuestion("fillInTheBlank")}
        >
          Add Fill in the Blank Question
        </button>
      </div>

      <div className="card p-4 mb-4">
        <h3>Multiple Choice Questions Preview</h3>
        <ul className="list-group">
          {questions
            .filter((q) => q.type === "multipleChoice")
            .map((q, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{q.text}</strong>
                  <ol>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ol>
                  <p>
                    <strong>Answer:</strong> {q.answer}
                  </p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteQuestion(index)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="card p-4 mb-4">
        <h3>Fill in the Blank Questions Preview</h3>
        <ul className="list-group">
          {questions
            .filter((q) => q.type === "fillInTheBlank")
            .map((q, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{q.text}</strong>
                  <p>
                    <strong>Answer:</strong> {q.answer}
                  </p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteQuestion(index)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="text-end mt-auto mb-4">
        <button className="btn btn-success mt-3" onClick={() => AddQuiz()}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
