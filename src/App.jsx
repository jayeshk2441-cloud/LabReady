import { useEffect, useState } from "react";
import "./App.css";
import { experiments } from "./data/experiments";

const defaultPythonCode = `# Write your Python code here

print("Hello LabReady")`;

function App() {
  const [page, setPage] = useState("home");
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const [prepTime, setPrepTime] = useState(30);
  const [prepStarted, setPrepStarted] = useState(false);

  const [answers, setAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [code, setCode] = useState(defaultPythonCode);
  const [userInput, setUserInput] = useState("");
  const [codeResult, setCodeResult] = useState(null);
  const [checkingCode, setCheckingCode] = useState(false);

  /* =========================================
     TIMER
  ========================================= */

  useEffect(() => {
    if (
      page !== "preparation" ||
      !prepStarted ||
      prepTime <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setPrepTime((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [page, prepStarted, prepTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  };

  /* =========================================
     NAVIGATION
  ========================================= */

  const goHome = () => {
    setPage("home");
    setSelectedExperiment(null);
    setPrepTime(30);
    setPrepStarted(false);
    setAnswers([]);
    setQuizSubmitted(false);
    setCodeResult(null);
    setUserInput("");
  };

  const selectExperiment = (experiment) => {
    setSelectedExperiment(experiment);

    setPrepTime(30);
    setPrepStarted(false);

    setAnswers(
      new Array(experiment.questions?.length || 0).fill(null)
    );

    setQuizSubmitted(false);
    setCodeResult(null);
    setUserInput("");

    if (experiment.id === "python") {
      setCode(defaultPythonCode);
    }

    setPage("preparation");
  };

  const startPreparation = () => {
    setPrepTime(30);
    setPrepStarted(true);
  };

  const skipPreparation = () => {
    setPrepTime(0);
    setPrepStarted(false);
  };

  const openQuiz = () => {
    if (!selectedExperiment) return;

    setAnswers(
      new Array(selectedExperiment.questions.length).fill(null)
    );

    setQuizSubmitted(false);
    setPage("quiz");
  };

  /* =========================================
     QUIZ
  ========================================= */

  const selectAnswer = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;

    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;

    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    if (!selectedExperiment) return 0;

    return selectedExperiment.questions.reduce(
      (score, question, index) => {
        return (
          score +
          (answers[index] === question.answer ? 1 : 0)
        );
      },
      0
    );
  };

  const continueToLab = () => {
    if (!selectedExperiment) return;

    if (selectedExperiment.id === "python") {
      setPage("pythonLab");
      return;
    }

    if (selectedExperiment.id === "physics_ohm") {
      setPage("physicsLab");
      return;
    }

    setPage("experiments");
  };

  /* =========================================
     PYTHON EXECUTION
  ========================================= */

  const checkPythonCode = async () => {
    if (!code.trim()) {
      setCodeResult({
        type: "error",
        title: "No code entered",
        message: "Write some Python code first.",
        hint:
          "Enter your Python program in the editor.",
      });

      return;
    }

    setCheckingCode(true);
    setCodeResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/run-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            input: userInput,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCodeResult({
          type: "success",
          title: "Code executed successfully! ✅",
          message: data.output?.trim()
            ? data.output
            : "Program finished successfully with no output.",
        });
      } else {
        setCodeResult({
          type: "error",
          title: "Python found an error ❌",
          message:
            data.error?.trim() ||
            "The program could not be executed.",
        });
      }
    } catch (error) {
      setCodeResult({
        type: "error",
        title: "Backend unavailable ❌",
        message:
          "LabReady could not connect to the Python execution server.",
        hint:
          "Make sure server.py is running on http://127.0.0.1:5000.",
      });
    }

    setCheckingCode(false);
  };

  const resetCode = () => {
    setCode(defaultPythonCode);
    setUserInput("");
    setCodeResult(null);
  };

  /* =========================================
     HOME
  ========================================= */

  if (page === "home") {
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

  /* =========================================
     EXPERIMENT SELECTION
  ========================================= */

  if (page === "experiments") {
    const experimentList = Object.values(experiments);

    return (
      <main className="labready-page">

        <section className="experiment-screen">

          <button
            className="back-button"
            onClick={goHome}
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
              Select an experiment to begin your pre-lab
              preparation.
            </p>

          </div>

          <div className="experiment-grid">

            {experimentList.map((experiment) => (
              <div
                className="experiment-card"
                key={experiment.id}
              >

                <div className="card-icon">
                  {experiment.icon}
                </div>

                <h2>
                  {experiment.title}
                </h2>

                <p>
                  {experiment.description}
                </p>

                <button
                  className="start-button"
                  onClick={() =>
                    selectExperiment(experiment)
                  }
                >
                  Start Experiment →
                </button>

              </div>
            ))}

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     PREPARATION
  ========================================= */

  if (
    page === "preparation" &&
    selectedExperiment
  ) {
    const preparationComplete = prepTime === 0;

    return (
      <main className="labready-page prep-page">

        <button
          className="back-button"
          onClick={() => setPage("experiments")}
        >
          ← Back
        </button>

        <section className="prep-container">

          <div className="prep-header">

            <div className="prep-icon">
              {selectedExperiment.icon}
            </div>

            <div className="prep-label">
              PRE-LAB PREPARATION
            </div>

            <h1>
              Quick Pre-Lab Preparation
            </h1>

            <p>
              Review the key concepts for{" "}
              <strong>
                {selectedExperiment.title}
              </strong>{" "}
              before beginning the readiness questions.
            </p>

          </div>

          <div
            className={`prep-timer ${
              preparationComplete
                ? "timer-complete"
                : ""
            }`}
          >

            <div className="timer-label">
              TIME REMAINING
            </div>

            <div className="timer-value">
              {formatTime(prepTime)}
            </div>

            <div className="timer-status">

              {preparationComplete
                ? "Preparation complete"
                : prepStarted
                ? "Preparation in progress"
                : "Ready to begin"}

            </div>

          </div>

          <div className="prep-grid">

            {selectedExperiment.preparation.map(
              (item, index) => (
                <article
                  className={`prep-card ${
                    selectedExperiment.preparation.length % 2 !== 0 &&
                    index ===
                      selectedExperiment.preparation.length - 1
                      ? "prep-card-wide"
                      : ""
                  }`}
                  key={item.id}
                >

                  <div className="prep-card-number">
                    {String(item.id).padStart(2, "0")}
                  </div>

                  <div className="prep-card-content">

                    <h2>
                      {item.title}
                    </h2>

                    <p>
                      {item.content}
                    </p>

                    {item.example && (
                      <div className="code-example">
                        <code>
                          {item.example}
                        </code>
                      </div>
                    )}

                  </div>

                </article>
              )
            )}

          </div>

          <div className="prep-actions">

            {!prepStarted &&
              !preparationComplete && (
                <button
                  className="start-button"
                  onClick={startPreparation}
                >
                  Start Preparation →
                </button>
              )}

            {prepStarted &&
              !preparationComplete && (
                <div className="prep-control-row">

                  <div className="waiting-message">

                    <span>
                      Continue reviewing the preparation material.
                    </span>

                    <strong>
                      You can skip the preparation at any time.
                    </strong>

                  </div>

                  <button
                    className="skip-button"
                    onClick={skipPreparation}
                  >
                    Skip Preparation →
                  </button>

                </div>
              )}

            {preparationComplete && (
              <button
                className="start-button ready-button"
                onClick={openQuiz}
              >
                Start Readiness Check →
              </button>
            )}

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     QUIZ
  ========================================= */

  if (
    page === "quiz" &&
    selectedExperiment
  ) {
    const score = calculateScore();

    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() => setPage("preparation")}
        >
          ← Back to Preparation
        </button>

        <section className="quiz-page">

          <div className="quiz-header">

            <div className="large-icon">
              {selectedExperiment.icon}
            </div>

            <h1>
              Readiness Check
            </h1>

            <p>
              Let's check your understanding of{" "}
              <strong>
                {selectedExperiment.title}
              </strong>
              .
            </p>

          </div>

          <div className="questions-container">

            {selectedExperiment.questions.map(
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
                      {selectedExperiment.questions.length}
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

                          } else if (
                            isSelected
                          ) {

                            optionClass +=
                              " selected-option";
                          }

                          return (
                            <button
                              type="button"
                              className={optionClass}
                              key={optionIndex}
                              disabled={quizSubmitted}
                              onClick={() =>
                                selectAnswer(
                                  questionIndex,
                                  optionIndex
                                )
                              }
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

                        <strong>
                          {selected === correct
                            ? "✓ Correct!"
                            : "✕ Wrong answer"}
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
              onClick={() => setQuizSubmitted(true)}
            >
              Check My Readiness →
            </button>

          ) : (

            <div className="score-panel">

              <h2>
                Your Score: {score}/
                {selectedExperiment.questions.length}
              </h2>

              <p>
                {score ===
                selectedExperiment.questions.length
                  ? "🎉 Excellent! You are ready to continue."
                  : "Review the answers marked in red and learn from your mistakes."}
              </p>

              <button
                className="primary-button"
                onClick={continueToLab}
              >
                Continue to Experiment Lab →
              </button>

            </div>

          )}

        </section>

      </main>
    );
  }

  /* =========================================
     PYTHON LAB
  ========================================= */

  if (
    page === "pythonLab" &&
    selectedExperiment?.id === "python"
  ) {
    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() => setPage("quiz")}
        >
          ← Back to Readiness Check
        </button>

        <section className="lab-header">

          <div className="large-icon">
            🐍
          </div>

          <h1>
            Python Programming Lab
          </h1>

          <p>
            Write and execute your Python code below.
          </p>

        </section>

        <section className="lab-objective">

          <div className="objective-label">
            EXPERIMENT WORKSPACE
          </div>

          <h2>
            Write any Python program you want to test.
          </h2>

          <div className="objective-steps">

            <div>
              <span>01</span>
              Write Python code.
            </div>

            <div>
              <span>02</span>
              Provide input if required.
            </div>

            <div>
              <span>03</span>
              Run and inspect the result.
            </div>

          </div>

        </section>

        <section className="code-section">

          <div className="code-title">

            <div className="window-buttons">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <strong>
              main.py
            </strong>

          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            spellCheck="false"
          />

          <div className="input-section">

            <label htmlFor="program-input">
              Program Input
            </label>

            <textarea
              id="program-input"
              className="program-input"
              value={userInput}
              onChange={(event) =>
                setUserInput(event.target.value)
              }
              placeholder="Enter input here if your program uses input()"
              spellCheck="false"
            />

          </div>

          <div className="button-row">

            <button
              className="primary-button"
              onClick={checkPythonCode}
              disabled={checkingCode}
            >
              {checkingCode
                ? "⏳ Running..."
                : "▶ Run Code"}
            </button>

            <button
              className="secondary-button"
              onClick={resetCode}
            >
              ↻ Reset
            </button>

          </div>

        </section>

        {codeResult && (
          <section
            className={`result-box result-${codeResult.type}`}
          >

            <h2>
              {codeResult.title}
            </h2>

            <pre className="program-output">
              {codeResult.message}
            </pre>

            {codeResult.hint && (
              <div className="hint-box">

                <strong>
                  💡 LabReady
                </strong>

                <p>
                  {codeResult.hint}
                </p>

              </div>
            )}

          </section>
        )}

      </main>
    );
  }

  /* =========================================
     PHYSICS EXPERIMENT LAB
  ========================================= */

  if (
    page === "physicsLab" &&
    selectedExperiment?.id === "physics_ohm"
  ) {
    return (
      <main className="labready-page">

        <button
          className="back-button"
          onClick={() => setPage("quiz")}
        >
          ← Back to Readiness Check
        </button>

        <section className="lab-header">

          <div className="large-icon">
            ⚡
          </div>

          <h1>
            Physics Experiment Lab
          </h1>

          <p>
            Apply the concepts from your pre-lab preparation
            to the experiment below.
          </p>

        </section>

        <section className="lab-objective">

          <div className="objective-label">
            EXPERIMENT OBJECTIVE
          </div>

          <h2>
            Study the relationship between voltage,
            current, and resistance.
          </h2>

          <div className="objective-steps">

            <div>
              <span>01</span>
              Set up the circuit correctly.
            </div>

            <div>
              <span>02</span>
              Measure voltage and current.
            </div>

            <div>
              <span>03</span>
              Verify Ohm's Law.
            </div>

          </div>

        </section>

        <section className="physics-lab-panel">

          <h2>
            Experiment Preparation
          </h2>

          <div className="physics-step-list">

            <div className="physics-step">
              <span>01</span>

              <div>
                <h3>
                  Check the Components
                </h3>

                <p>
                  Identify the resistor, cell,
                  ammeter, voltmeter, and wires.
                </p>
              </div>
            </div>

            <div className="physics-step">
              <span>02</span>

              <div>
                <h3>
                  Make the Connections
                </h3>

                <p>
                  Connect the ammeter in series
                  and the voltmeter in parallel.
                </p>
              </div>
            </div>

            <div className="physics-step">
              <span>03</span>

              <div>
                <h3>
                  Record Readings
                </h3>

                <p>
                  Record voltage and current values
                  for different readings.
                </p>
              </div>
            </div>

            <div className="physics-step">
              <span>04</span>

              <div>
                <h3>
                  Verify Ohm's Law
                </h3>

                <p>
                  Use V = I × R to analyse the
                  relationship between the measurements.
                </p>
              </div>
            </div>

          </div>

          <div className="physics-note">
            💡 The interactive measurement and
            troubleshooting tools can be added here next.
          </div>

        </section>

      </main>
    );
  }

  return null;
}

export default App;