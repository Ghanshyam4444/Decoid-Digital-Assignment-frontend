import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const MyQuiz = () => {
  const { authorization_token, API } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API}/api/MyQuiz/getMyAllQuiz`, {
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
  }, [authorization_token, API]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Created Quizzes</h2>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Quiz ID</th>
              <th>MCQ Questions</th>
              <th>Fill in the Blank Questions</th>
              <th>Total Submissions</th>
              <th>View Submissions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan="6">No quizzes found.</td>
              </tr>
            ) : (
              quizzes.map((quiz, index) => (
                <tr key={quiz.quizId}>
                  <td>{index + 1}</td>
                  <td>{quiz.quizId}</td>
                  <td>{quiz.totalMCQs}</td>
                  <td>{quiz.totalFillInTheBlanks}</td>
                  <td>{quiz.totalAnswers}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(`/view-submissions/${quiz.quizId}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyQuiz;
