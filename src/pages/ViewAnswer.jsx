import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";

const ViewAnswer = () => {
  const { answerId } = useParams();
  const [answerDetails, setAnswerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { quizId, authorization_token, API } = useAuth();

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      try {
        const response = await fetch(
          `${API}/api/MyQuiz/getAnswerDetails/${answerId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization_token,
            },
            body: JSON.stringify({ questionId: quizId }),
          }
        );

        const data = await response.json();
        console.log(data);
        if (
          !data ||
          data.message === "answerId and questionId are required" ||
          Object.keys(data).length === 0
        ) {
          setAnswerDetails(null);
        } else {
          setAnswerDetails(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching answer details:", error);
        setLoading(false);
      }
    };

    fetchAnswerDetails();
  }, [answerId, quizId, authorization_token]);

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;

  if (!answerDetails)
    return (
      <h2 className="text-center text-danger mt-5">Answer does not exist</h2>
    );

  const { submittedBy, questionDetails, answerDetails: answer } = answerDetails;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center text-primary mb-3">Answer Details</h2>
        <h4 className="text-secondary text-center mb-4">
          <strong>Submitted by:</strong> {submittedBy}
        </h4>

        {/* Multiple Choice Questions */}
        <div className="mb-5">
          <h3 className="text-success mb-3">Multiple Choice Questions</h3>
          <hr />
          {questionDetails.optionType.length === 0 ? (
            <p className="text-muted">
              No multiple-choice questions available.
            </p>
          ) : (
            questionDetails.optionType.map((mcq, index) => {
              const userAnswer = answer.optionType?.find(
                (a) => a.questionNumber === mcq.questionNumber
              )?.selectedOption;
              const correctAnswer = mcq.correctOption;

              return (
                <div key={index} className="p-3 border rounded mb-3 bg-light">
                  <h5 className="mb-2">
                    <strong>
                      {index + 1}. {mcq.questionText}
                    </strong>
                  </h5>
                  <p>
                    <strong>Correct Answer:</strong> {correctAnswer}
                  </p>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {userAnswer ? userAnswer : "—"}{" "}
                    {userAnswer &&
                      (userAnswer === correctAnswer ? (
                        <span className="text-success ms-2 fs-5">&#10004;</span>
                      ) : (
                        <span className="text-danger ms-2 fs-5">&#10008;</span>
                      ))}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Fill in the Blank Questions */}
        <div>
          <h3 className="text-primary mb-3">Fill in the Blank Questions</h3>
          <hr />
          {questionDetails.FillInTheBlank.length === 0 ? (
            <p className="text-muted">
              No fill-in-the-blank questions available.
            </p>
          ) : (
            questionDetails.FillInTheBlank.map((fitb, index) => {
              const userAnswer = answer.FillInTheBlank?.find(
                (a) => a.questionNumber === fitb.questionNumber
              )?.answer;
              const correctAnswer = fitb.correctAnswer;

              return (
                <div key={index} className="p-3 border rounded mb-3 bg-light">
                  <h5 className="mb-2">
                    <strong>
                      {index + 1}. {fitb.questionText}
                    </strong>
                  </h5>
                  <p>
                    <strong>Correct Answer:</strong> {correctAnswer}
                  </p>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {userAnswer ? userAnswer : "—"}{" "}
                    {userAnswer &&
                      (userAnswer.toLowerCase() ===
                      correctAnswer.toLowerCase() ? (
                        <span className="text-success ms-2 fs-5">&#10004;</span>
                      ) : (
                        <span className="text-danger ms-2 fs-5">&#10008;</span>
                      ))}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;
