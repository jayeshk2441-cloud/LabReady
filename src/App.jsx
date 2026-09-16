import { useState } from "react";
import "./App.css";

const quizQuestions = [
  {
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "fun", "define"],
    answer: 1,
    explanation:
      "The def keyword is used to define a function in Python.",
  },
  {
    question: "Which symbol is used for a comment in Python?",
    options: ["//", "#", "/*", "--"],
    answer: 1,
    explanation:
      "Python uses # to write a single-line comment.",
  },
  {
    question:
      "Which function is commonly used to display output in Python?",
    options: ["display()", "show()", "print()", "output()"],
    answer: 2,
    explanation:
      "The print() function is commonly used to display output.",
  },
];

function App() {
  const [page, setPage] = useState("home");

  const [answers, setAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );

  const [quizSubmitted, setQuizSubmitted] = useState(false);

  /* =========================
     HOME → EXPERIMENTS
  ========================= */

  if (page === "experiments") {
    return (
      <main className="labready-page">
        <section className="experiment-screen">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <div className="experiment-heading">

            <div className="experiment-logo">
              🧪
            </div>

            <h1>
              Choose Your Experiment
            </h1>

            <p>
              Select an experiment to begin your pre-lab preparation.
            </p>

          </div>

          <div className="experiment-grid">

            {/* PYTHON */}

            <div className="experiment-card">

              <div className="card-icon">
                🐍
              </div>

              <h2>
                Python Programming
              </h2>

              <p>
                Practice programming, identify mistakes,
                and troubleshoot your lab code.
              </p>

              <button
                className="start-button"
                onClick={() => setPage("pythonQuiz")}
              >
                Start Experiment →
              </button>

            </div>

            {/* PHYSICS */}

            <div className="experiment-card">

              <div className="card-icon">
                ⚡
              </div>

              <h2>
                Physics Experiment
              </h2>

              <p>
                Prepare for your experiment with guided
                steps, concepts, and common mistakes.
              </p>

              <button
                className="start-button"
                onClick={() => setPage("physics")}
              >
                Start Experiment →
              </button>

            </div>

          </div>

        </section>
      </main>
    );
  }

  /* =========================
     PYTHON QUIZ
  ========================= */

  if (page === "pythonQuiz") {

    const score = answers.reduce(
      (total, answer, index) => {
        if (
          answer === quizQuestions[index].answer
        ) {
          return total + 1;
        }

        return total;
      },
      0
    );

    const allAnswered = answers.every(
      (answer) => answer !== null
    );

    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() => setPage("experiments")}
        >
          ← Back
        </button>

        <section className="quiz-page">

          <div className="quiz-header">

            <div className="large-icon">
              🐍
            </div>

            <h1>
              Python Readiness Check
            </h1>

            <p>
              Let's check your basic understanding
              before you begin the experiment.
            </p>

          </div>

          <div className="questions-container">

            {quizQuestions.map(
              (question, questionIndex) => {

                const selected =
                  answers[questionIndex];

                const correct =
                  question.answer;

                return (
                  <div
                    className="question-card"
                    key={questionIndex}
                  >

                    <div className="question-number">
                      Question {questionIndex + 1} of{" "}
                      {quizQuestions.length}
                    </div>

                    <h2>
                      {question.question}
                    </h2>

                    <div className="options">

                      {question.options.map(
                        (option, optionIndex) => {

                          const isSelected =
                            selected === optionIndex;

                          const isCorrect =
                            optionIndex === correct;

                          let optionClass =
                            "option";

                          if (quizSubmitted) {

                            if (isCorrect) {
                              optionClass +=
                                " correct-option";
                            }

                            if (
                              isSelected &&
                              !isCorrect
                            ) {
                              optionClass +=
                                " wrong-option";
                            }

                          } else if (isSelected) {

                            optionClass +=
                              " selected-option";
                          }

                          return (
                            <button
                              type="button"
                              key={optionIndex}
                              className={optionClass}
                              disabled={quizSubmitted}
                              onClick={() => {

                                if (quizSubmitted) {
                                  return;
                                }

                                const updated =
                                  [...answers];

                                updated[questionIndex] =
                                  optionIndex;

                                setAnswers(updated);
                              }}
                            >

                              <span className="option-letter">
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <span>
                                {option}
                              </span>

                              {quizSubmitted &&
                                isCorrect && (
                                  <span className="answer-mark">
                                    ✓
                                  </span>
                                )}

                              {quizSubmitted &&
                                isSelected &&
                                !isCorrect && (
                                  <span className="answer-mark">
                                    ✕
                                  </span>
                                )}

                            </button>
                          );
                        }
                      )}

                    </div>

                    {quizSubmitted && (

                      <div
                        className={
                          selected === correct
                            ? "question-feedback correct-feedback"
                            : "question-feedback wrong-feedback"
                        }
                      >

                        {selected === correct ? (

                          <>
                            <strong>
                              ✓ Correct!
                            </strong>

                            <p>
                              {question.explanation}
                            </p>
                          </>

                        ) : (

                          <>
                            <strong>
                              ✕ Wrong answer
                            </strong>

                            <p>
                              Your answer:{" "}
                              {selected === null
                                ? "Not answered"
                                : `${String.fromCharCode(
                                    65 + selected
                                  )}. ${
                                    question.options[selected]
                                  }`}
                            </p>

                            <p>
                              Correct answer:{" "}
                              {String.fromCharCode(
                                65 + correct
                              )}
                              .{" "}
                              {question.options[correct]}
                            </p>

                            <p>
                              {question.explanation}
                            </p>
                          </>

                        )}

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

          {!quizSubmitted ? (

            <button
              className="primary-button quiz-button"
              disabled={!allAnswered}
              onClick={() =>
                setQuizSubmitted(true)
              }
            >
              Check My Readiness →
            </button>

          ) : (

            <div className="score-panel">

              <h2>
                Your Score: {score}/
                {quizQuestions.length}
              </h2>

              {score === quizQuestions.length ? (

                <p>
                  🎉 Excellent! You are ready
                  to begin the experiment.
                </p>

              ) : (

                <p>
                  Review the questions marked
                  in red and learn from your mistakes.
                </p>

              )}

              <button
                className="primary-button"
                onClick={() => {
                  setAnswers(
                    Array(
                      quizQuestions.length
                    ).fill(null)
                  );

                  setQuizSubmitted(false);
                }}
              >
                Try Again
              </button>

              {score === quizQuestions.length && (

                <button
                  className="home-link"
                  onClick={() =>
                    setPage("pythonLab")
                  }
                >
                  Continue to Python Lab →
                </button>

              )}

            </div>

          )}

        </section>

      </main>
    );
  }

  /* =========================
     PYTHON LAB PLACEHOLDER
  ========================= */

  if (page === "pythonLab") {
    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() =>
            setPage("pythonQuiz")
          }
        >
          ← Back
        </button>

        <section className="lab-header">

          <div className="large-icon">
            🐍
          </div>

          <h1>
            Python Programming Lab
          </h1>

          <p>
            Your interactive coding laboratory
            will appear here next.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              setPage("pythonQuiz")
            }
          >
            ← Back to Readiness Check
          </button>

        </section>

      </main>
    );
  }

  /* =========================
     PHYSICS
  ========================= */

  if (page === "physics") {
    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() =>
            setPage("experiments")
          }
        >
          ← Back
        </button>

        <section className="simple-page">

          <div className="large-icon">
            ⚡
          </div>

          <h1>
            Physics Experiment
          </h1>

          <p>
            Prepare for your physics experiment
            with guided concepts and procedures.
          </p>

          <div className="info-panel">

            <h2>
              Pre-Lab Preparation
            </h2>

            <div className="info-item">

              <span>01</span>

              <div>
                <h3>
                  Understand the Objective
                </h3>

                <p>
                  Understand what the experiment
                  is designed to demonstrate.
                </p>
              </div>

            </div>

            <div className="info-item">

              <span>02</span>

              <div>
                <h3>
                  Learn the Principle
                </h3>

                <p>
                  Review the important concepts
                  related to the experiment.
                </p>
              </div>

            </div>

            <div className="info-item">

              <span>03</span>

              <div>
                <h3>
                  Follow the Procedure
                </h3>

                <p>
                  Understand the experimental steps
                  before starting.
                </p>
              </div>

            </div>

            <div className="info-item">

              <span>04</span>

              <div>
                <h3>
                  Check Common Mistakes
                </h3>

                <p>
                  Review common measurement and
                  calculation mistakes.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =========================
     HOME
  ========================= */

  return (
    <main className="labready-page">

      <section className="hero">

        <div className="hero-icon">
          🧪
        </div>

        <h1 className="hero-title">
          LabReady
        </h1>

        <h2 className="hero-subtitle">
          Interactive Pre-Lab Readiness
        </h2>

        <p className="hero-description">
          Prepare for your laboratory experiments with guided
          learning, experiment-specific support, and intelligent
          troubleshooting.
        </p>

        <button
          className="start-button hero-button"
          onClick={() => setPage("experiments")}
        >
          Start Lab →
        </button>

      </section>

    </main>
  );
}

export default App;