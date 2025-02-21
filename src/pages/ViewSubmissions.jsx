import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const ViewSubmissions = () => {
  const { authorization_token, setQuizId, API } = useAuth();
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${API}/api/MyQuiz/getAllAnswers/${quizId}`,
          {
            method: "GET",
            headers: {
              Authorization: authorization_token,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.answers);
        } else {
          console.error("Error fetching submissions:", data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [quizId, authorization_token, API]);

  if (loading)
    return <h2 className="text-center mt-5">Loading Submissions...</h2>;
  if (submissions.length === 0)
    return <h2 className="text-center mt-5">No Submissions Found.</h2>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">View Submissions</h2>
      <div className="table-responsive">
        <table className="table table-bordered mt-3 text-center">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Question ID</th>
              <th>Username</th>
              <th>View Answers</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission.answerId}>
                <td>{index + 1}</td>
                <td>{submission.answerId}</td>
                <td>{submission.username}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      setQuizId(quizId);
                      navigate(`/view-answer/${submission.answerId}`);
                    }}
                  >
                    View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSubmissions;
