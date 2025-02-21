import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const AvailableQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { authorization_token, API } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API}/api/AvailableQuiz/getAllQuiz`, {
          method: "GET",
          headers: {
            Authorization: authorization_token,
          },
        });
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const navigateToQuiz = (quizId) => {
    navigate(`/viewQuiz/${quizId}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Quizzes</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Quiz #</th>
              <th scope="col">Quiz ID</th>
              <th scope="col">Creator Name</th>
              <th scope="col">MCQ Count</th>
              <th scope="col">Fill in the Blank Count</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <tr key={quiz.quizId}>
                  <td>{index + 1}</td>
                  <td>{quiz.quizId}</td>
                  <td>{quiz.creatorName}</td>
                  <td>{quiz.totalMultipleChoice}</td>
                  <td>{quiz.totalFillInTheBlank}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigateToQuiz(quiz.quizId)}
                    >
                      View Quiz
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No quizzes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableQuiz;
