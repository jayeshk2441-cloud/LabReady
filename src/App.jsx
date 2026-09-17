import { useEffect, useState } from "react";
import "./App.css";
import { experiments } from "./data/experiments";

const defaultPythonCode = `# Calculate the average of three numbers

a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
c = float(input("Enter third number: "))

average = (a + b + c) / 3

print("Average:", average)`;

const createInitialReadings = () => [
  {
    id: 1,
    voltage: "",
    current: "",
  },
  {
    id: 2,
    voltage: "",
    current: "",
  },
];

const getRandomQuestions = (questionPool = [], count = 3) => {
  const shuffled = [...questionPool].sort(
    () => Math.random() - 0.5
  );

  return shuffled.slice(
    0,
    Math.min(count, shuffled.length)
  );
};

const troubleshootingFlows = {
  inconsistent: {
    title: "Resistance values are inconsistent",
    icon: "📊",
    causes: [
      "Loose wire connections",
      "Incorrect ammeter or voltmeter connection",
      "Unstable voltage or current readings",
    ],
    steps: [
      {
        title: "Check the circuit connections",
        text:
          "Make sure all connecting wires are firmly attached and there are no loose terminals.",
      },
      {
        title: "Check the instrument connections",
        text:
          "Confirm that the ammeter is connected in series and the voltmeter is connected in parallel.",
      },
      {
        title: "Repeat the reading",
        text:
          "Take another voltage and current reading after the circuit has stabilised.",
      },
    ],
  },

  zeroCurrent: {
    title: "Current reading is zero",
    icon: "🔌",
    causes: [
      "Open circuit",
      "Ammeter connection problem",
      "Power source or wire connection issue",
    ],
    steps: [
      {
        title: "Check the circuit path",
        text:
          "Make sure the circuit is closed and all wires are connected properly.",
      },
      {
        title: "Check the ammeter",
        text:
          "Verify that the ammeter is connected in series with the circuit.",
      },
      {
        title: "Check the power source",
        text:
          "Confirm that the cell or power supply is switched on and connected correctly.",
      },
    ],
  },

  zeroVoltage: {
    title: "Voltage reading is zero",
    icon: "⚡",
    causes: [
      "Voltmeter connection problem",
      "No potential difference across the component",
      "Loose connections",
    ],
    steps: [
      {
        title: "Check the voltmeter",
        text:
          "Make sure the voltmeter is connected in parallel across the component being measured.",
      },
      {
        title: "Check the connection points",
        text:
          "Verify that both voltmeter terminals are firmly connected.",
      },
      {
        title: "Check the supply",
        text:
          "Confirm that the circuit has a working power source and is switched on.",
      },
    ],
  },

  circuit: {
    title: "Circuit is not working",
    icon: "🔧",
    causes: [
      "Loose wires",
      "Incorrect polarity",
      "Incorrect instrument placement",
    ],
    steps: [
      {
        title: "Check all wires",
        text:
          "Reconnect loose wires and make sure every connection is secure.",
      },
      {
        title: "Check polarity",
        text:
          "Verify that the positive and negative terminals are connected in the correct direction.",
      },
      {
        title: "Check instrument placement",
        text:
          "Confirm the ammeter is in series and the voltmeter is in parallel.",
      },
    ],
  },

  unexpected: {
    title: "Unexpected result",
    icon: "⚠️",
    causes: [
      "Incorrect measurement",
      "Calculation error",
      "Unstable circuit conditions",
    ],
    steps: [
      {
        title: "Check the recorded values",
        text:
          "Compare the values entered in LabReady with the actual instrument readings.",
      },
      {
        title: "Check the resistance calculation",
        text:
          "Remember: Resistance R = Voltage V ÷ Current I.",
      },
      {
        title: "Repeat the measurement",
        text:
          "Take another reading and compare it with the earlier result.",
      },
    ],
  },

  unknown: {
    title: "I don't know what went wrong",
    icon: "🤔",
    causes: [
      "The issue may be related to circuit connections",
      "The measuring instruments may be connected incorrectly",
      "The recorded values may need to be checked",
    ],
    steps: [
      {
        title: "Start with the basic connections",
        text:
          "Check every wire and make sure the circuit is properly connected.",
      },
      {
        title: "Check the instruments",
        text:
          "Confirm the ammeter is in series and the voltmeter is in parallel.",
      },
      {
        title: "Check the readings",
        text:
          "Repeat the voltage and current measurements and compare the new readings.",
      },
    ],
  },
};

function App() {
  const [page, setPage] = useState("home");

  const [selectedExperiment, setSelectedExperiment] =
    useState(null);

  /* =========================================
     DYNAMIC MICRO PREP
  ========================================= */

  const [prepTime, setPrepTime] = useState(30);
  const [prepStarted, setPrepStarted] = useState(false);
  const [prepStep, setPrepStep] = useState(0);

  const [prepQuestionAnswer, setPrepQuestionAnswer] =
    useState(null);

  const [prepQuestionChecked, setPrepQuestionChecked] =
    useState(false);

  /* =========================================
     QUIZ
  ========================================= */

  const [answers, setAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] =
    useState(false);

  /* =========================================
     PYTHON LAB
  ========================================= */

  const [code, setCode] =
    useState(defaultPythonCode);

  const [codeResult, setCodeResult] =
    useState(null);

  const [checkingCode, setCheckingCode] =
    useState(false);

  const [pythonCompleted, setPythonCompleted] =
    useState(false);

  const [pythonInput, setPythonInput] =
    useState({
      first: "10",
      second: "20",
      third: "30",
    });

  const [pythonAttempts, setPythonAttempts] =
    useState(0);

  const [pythonReport, setPythonReport] =
    useState(null);

  /* =========================================
     PHYSICS LAB
  ========================================= */

  const [physicsReadings, setPhysicsReadings] =
    useState(createInitialReadings());

  const [physicsAnalysis, setPhysicsAnalysis] =
    useState(null);

  /* =========================================
     TROUBLESHOOTING
  ========================================= */

  const [
    troubleshootingOpen,
    setTroubleshootingOpen,
  ] = useState(false);

  const [
    troubleshootingProblem,
    setTroubleshootingProblem,
  ] = useState(null);

  const [
    troubleshootingStep,
    setTroubleshootingStep,
  ] = useState(0);

  /* =========================================
     PREP TIMER
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

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(2, "0")}`;
  };

  /* =========================================
     NAVIGATION / RESET
  ========================================= */

  const resetTroubleshootingState = () => {
    setTroubleshootingOpen(false);
    setTroubleshootingProblem(null);
    setTroubleshootingStep(0);
  };

  const resetMicroPrep = () => {
    setPrepTime(30);
    setPrepStarted(false);
    setPrepStep(0);
    setPrepQuestionAnswer(null);
    setPrepQuestionChecked(false);
  };

  const resetPythonState = () => {
    setCode(defaultPythonCode);
    setCodeResult(null);
    setPythonCompleted(false);

    setPythonInput({
      first: "10",
      second: "20",
      third: "30",
    });

    setPythonAttempts(0);
    setPythonReport(null);
  };

  const goHome = () => {
    setPage("home");
    setSelectedExperiment(null);

    resetMicroPrep();

    setAnswers([]);
    setQuizSubmitted(false);

    resetPythonState();

    setPhysicsReadings(createInitialReadings());
    setPhysicsAnalysis(null);

    resetTroubleshootingState();
  };

  /* =========================================
     SELECT EXPERIMENT
     RANDOM 3 QUIZ QUESTIONS
  ========================================= */

  const selectExperiment = (experiment) => {
    const randomQuestions =
      experiment.questionPool?.length
        ? getRandomQuestions(
            experiment.questionPool,
            3
          )
        : experiment.questions || [];

    const sessionExperiment = {
      ...experiment,
      questions: randomQuestions,
    };

    setSelectedExperiment(sessionExperiment);

    resetMicroPrep();

    setAnswers(
      new Array(
        randomQuestions.length
      ).fill(null)
    );

    setQuizSubmitted(false);

    resetPythonState();

    setPhysicsReadings(
      createInitialReadings()
    );

    setPhysicsAnalysis(null);

    resetTroubleshootingState();

    setPage("preparation");
  };

  /* =========================================
     PREPARATION
  ========================================= */

  const startPreparation = () => {
    setPrepTime(30);
    setPrepStarted(true);
    setPrepStep(0);
    setPrepQuestionAnswer(null);
    setPrepQuestionChecked(false);
  };

  const skipPreparation = () => {
    setPrepTime(0);
    setPrepStarted(true);

    if (
      selectedExperiment?.microPrep?.length
    ) {
      setPrepStep(
        selectedExperiment.microPrep.length -
          1
      );
    }
  };

  const nextPrepStep = () => {
    if (!selectedExperiment?.microPrep)
      return;

    const maxStep =
      selectedExperiment.microPrep.length -
      1;

    if (prepStep < maxStep) {
      setPrepStep(
        (current) => current + 1
      );

      setPrepQuestionAnswer(null);
      setPrepQuestionChecked(false);
    }
  };

  const previousPrepStep = () => {
    if (prepStep > 0) {
      setPrepStep(
        (current) => current - 1
      );

      setPrepQuestionAnswer(null);
      setPrepQuestionChecked(false);
    }
  };

  const answerPrepQuestion = (index) => {
    if (prepQuestionChecked) return;

    setPrepQuestionAnswer(index);
  };

  const checkPrepQuestion = () => {
    if (
      prepQuestionAnswer === null
    ) {
      return;
    }

    setPrepQuestionChecked(true);
  };

  const openQuiz = () => {
    if (!selectedExperiment) return;

    setAnswers(
      new Array(
        selectedExperiment.questions.length
      ).fill(null)
    );

    setQuizSubmitted(false);
    setPage("quiz");
  };

  /* =========================================
     QUIZ
  ========================================= */

  const selectAnswer = (
    questionIndex,
    optionIndex
  ) => {
    if (quizSubmitted) return;

    const updatedAnswers = [...answers];

    updatedAnswers[questionIndex] =
      optionIndex;

    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    if (!selectedExperiment) return 0;

    return selectedExperiment.questions.reduce(
      (score, question, index) =>
        score +
        (answers[index] ===
        question.answer
          ? 1
          : 0),
      0
    );
  };

  const continueToLab = () => {
    if (!selectedExperiment) return;

    if (
      selectedExperiment.id === "python"
    ) {
      setPage("pythonLab");
      return;
    }

    if (
      selectedExperiment.id ===
      "physics_ohm"
    ) {
      setPage("physicsLab");
    }
  };

  /* =========================================
     PYTHON INPUT
  ========================================= */

  const updatePythonInput = (
    field,
    value
  ) => {
    setPythonInput((current) => ({
      ...current,
      [field]: value,
    }));

    setPythonCompleted(false);
  };

  /* =========================================
     PYTHON CODE CHECKER
  ========================================= */

  const checkPythonCode = async () => {
    const first = Number(
      pythonInput.first
    );

    const second = Number(
      pythonInput.second
    );

    const third = Number(
      pythonInput.third
    );

    if (
      !Number.isFinite(first) ||
      !Number.isFinite(second) ||
      !Number.isFinite(third)
    ) {
      setCodeResult({
        type: "error",
        title: "Invalid input ❌",
        message:
          "Please enter valid numbers in all three input boxes.",
        hint:
          "Use numbers such as 10, 20 and 30.",
      });

      setPythonCompleted(false);
      return;
    }

    if (!code.trim()) {
      setCodeResult({
        type: "error",
        title: "No code entered",
        message:
          "Write your Python solution before checking it.",
        hint:
          "Use input() to receive the three numbers and calculate their average.",
      });

      setPythonCompleted(false);
      return;
    }

    const expectedAverage =
      (first + second + third) / 3;

    const userInput =
      `${first}\n${second}\n${third}\n`;

    const nextAttempt =
      pythonAttempts + 1;

    setPythonAttempts(nextAttempt);
    setCheckingCode(true);
    setPythonCompleted(false);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/run-code",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            code,
            input: userInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const data =
        await response.json();

      if (!data.success) {
        const errorText =
          data.error || "";

        const lowerError =
          errorText.toLowerCase();

        let title =
          "Python found an error ❌";

        let hint =
          "Read the error carefully and check the line mentioned in the message.";

        if (
          lowerError.includes(
            "syntaxerror"
          )
        ) {
          title =
            "Syntax error ❌";

          hint =
            "Check brackets, quotes, colons, spelling and the structure of your Python statements.";
        } else if (
          lowerError.includes(
            "indentationerror"
          ) ||
          lowerError.includes(
            "unexpected indent"
          )
        ) {
          title =
            "Indentation error ❌";

          hint =
            "Check that your indentation is consistent. Python uses indentation to define code blocks.";
        } else if (
          lowerError.includes(
            "nameerror"
          )
        ) {
          title =
            "Variable error ❌";

          hint =
            "Make sure every variable is created before you use it and check the spelling.";
        } else if (
          lowerError.includes(
            "typeerror"
          )
        ) {
          title =
            "Type error ❌";

          hint =
            "Check whether the values used in your calculation have compatible data types.";
        } else if (
          lowerError.includes(
            "eoferror"
          )
        ) {
          title =
            "Input error ❌";

          hint =
            "Your program expected more input. Use input() three times for the three numbers.";
        }

        setCodeResult({
          type: "error",
          title,
          message:
            errorText ||
            "Your Python program contains an error.",
          hint,
        });

        setPythonReport({
          status: "Failed",
          first,
          second,
          third,
          expectedAverage,
          actualAverage: null,
          expectedOutput:
            `Average: ${expectedAverage.toFixed(
              2
            )}`,
          actualOutput:
            data.output ||
            "No output",
          attempts:
            nextAttempt,
        });

        return;
      }

      const output =
        (data.output || "").trim();

      const averageMatch =
        output.match(
          /Average\s*:\s*(-?\d+(?:\.\d+)?)/i
        );

      const actualAverage =
        averageMatch
          ? Number(
              averageMatch[1]
            )
          : null;

      const correctAverage =
        Number.isFinite(
          actualAverage
        ) &&
        Math.abs(
          actualAverage -
            expectedAverage
        ) < 0.000001;

      const expectedOutput =
        `Average: ${expectedAverage.toFixed(
          2
        )}`;

      if (correctAverage) {
        setPythonCompleted(true);

        setCodeResult({
          type: "success",
          title:
            "Experiment completed successfully! 🎉",
          message: output,
          hint:
            "Your program produced the expected result for the entered values.",
        });

        setPythonReport({
          status: "Passed",
          first,
          second,
          third,
          expectedAverage,
          actualAverage,
          expectedOutput,
          actualOutput:
            output,
          attempts:
            nextAttempt,
        });
      } else if (
        actualAverage !== null
      ) {
        setPythonCompleted(false);

        setCodeResult({
          type: "error",
          title:
            "Output does not match the expected result ⚠️",
          message: output,
          hint:
            `LabReady expected an average of ${expectedAverage.toFixed(
              2
            )}. Check your formula: (a + b + c) / 3.`,
        });

        setPythonReport({
          status:
            "Needs Correction",
          first,
          second,
          third,
          expectedAverage,
          actualAverage,
          expectedOutput,
          actualOutput:
            output,
          attempts:
            nextAttempt,
        });
      } else {
        setPythonCompleted(false);

        setCodeResult({
          type: "error",
          title:
            "Output could not be verified ⚠️",
          message:
            output ||
            "Your program ran, but LabReady could not find an average value.",
          hint:
            'Print the result using a format such as: print("Average:", average)',
        });

        setPythonReport({
          status:
            "Needs Correction",
          first,
          second,
          third,
          expectedAverage,
          actualAverage:
            null,
          expectedOutput,
          actualOutput:
            output ||
            "No readable output",
          attempts:
            nextAttempt,
        });
      }
    } catch (error) {
      setPythonCompleted(false);

      setCodeResult({
        type: "error",
        title:
          "Python backend unavailable",
        message:
          "LabReady could not connect to the local Python execution server.",
        hint:
          "Run your Flask server with: python server.py",
      });

      setPythonReport({
        status:
          "Backend Error",
        first,
        second,
        third,
        expectedAverage,
        actualAverage:
          null,
        expectedOutput:
          `Average: ${expectedAverage.toFixed(
            2
          )}`,
        actualOutput:
          "Python backend unavailable",
        attempts:
          nextAttempt,
      });
    } finally {
      setCheckingCode(false);
    }
  };

  const resetCode = () => {
    setCode(defaultPythonCode);
    setCodeResult(null);
    setPythonCompleted(false);
    setPythonReport(null);
    setPythonAttempts(0);

    setPythonInput({
      first: "10",
      second: "20",
      third: "30",
    });
  };

  /* =========================================
     PHYSICS READINGS
  ========================================= */

  const updatePhysicsReading = (
    id,
    field,
    value
  ) => {
    setPhysicsReadings(
      (current) =>
        current.map(
          (reading) =>
            reading.id === id
              ? {
                  ...reading,
                  [field]:
                    value,
                }
              : reading
        )
    );

    setPhysicsAnalysis(null);
  };

  const addPhysicsReading = () => {
    setPhysicsReadings(
      (current) => [
        ...current,
        {
          id:
            current.length >
            0
              ? Math.max(
                  ...current.map(
                    (item) =>
                      item.id
                  )
                ) + 1
              : 1,
          voltage: "",
          current: "",
        },
      ]
    );

    setPhysicsAnalysis(null);
  };

  const deletePhysicsReading = (
    id
  ) => {
    setPhysicsReadings(
      (current) =>
        current.filter(
          (reading) =>
            reading.id !== id
        )
    );

    setPhysicsAnalysis(null);
  };

  const resetPhysicsReadings = () => {
    setPhysicsReadings(
      createInitialReadings()
    );

    setPhysicsAnalysis(null);
    resetTroubleshootingState();
  };

  /* =========================================
     PHYSICS ANALYSIS
  ========================================= */

  const analyzePhysicsExperiment =
    () => {
      const processed =
        physicsReadings.map(
          (reading) => {
            const voltage =
              Number(
                reading.voltage
              );

            const current =
              Number(
                reading.current
              );

            let resistance =
              null;

            let status =
              "valid";

            let message =
              "";

            const voltageEntered =
              reading.voltage !==
                "" &&
              reading.voltage !==
                null;

            const currentEntered =
              reading.current !==
                "" &&
              reading.current !==
                null;

            if (
              !voltageEntered ||
              !currentEntered
            ) {
              status =
                "invalid";

              message =
                "Both voltage and current are required.";
            } else if (
              !Number.isFinite(
                voltage
              )
            ) {
              status =
                "invalid";

              message =
                "Voltage must be a valid number.";
            } else if (
              !Number.isFinite(
                current
              )
            ) {
              status =
                "invalid";

              message =
                "Current must be a valid number.";
            } else if (
              current === 0
            ) {
              status =
                "invalid";

              message =
                "Current cannot be zero because resistance would be undefined.";
            } else if (
              voltage < 0 ||
              current < 0
            ) {
              status =
                "warning";

              resistance =
                voltage / current;

              message =
                "Check the polarity and measurement values before relying on this reading.";
            } else {
              resistance =
                voltage / current;
            }

            return {
              ...reading,
              voltage,
              current,
              resistance,
              status,
              message,
            };
          }
        );

      const invalidReadings =
        processed.filter(
          (reading) =>
            reading.status ===
            "invalid"
        );

      const validReadings =
        processed.filter(
          (reading) =>
            reading.status !==
              "invalid" &&
            Number.isFinite(
              reading.resistance
            )
        );

      if (
        validReadings.length <
        2
      ) {
        setPhysicsAnalysis({
          success: false,
          status:
            "insufficient",
          processed,
          validReadings,
          invalidReadings,
          averageResistance:
            null,
          variation: null,
          consistency:
            "Insufficient Data",
          feedback:
            "Add at least two valid voltage-current readings to analyse the experiment.",
          troubleshooting: [
            "Make sure voltage and current are entered for every reading.",
            "Do not enter zero current.",
            "Check that your values are numerical measurements.",
          ],
        });

        resetTroubleshootingState();
        return;
      }

      const resistances =
        validReadings.map(
          (reading) =>
            reading.resistance
        );

      const averageResistance =
        resistances.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        resistances.length;

      const minimumResistance =
        Math.min(
          ...resistances
        );

      const maximumResistance =
        Math.max(
          ...resistances
        );

      const variation =
        averageResistance === 0
          ? 0
          : ((maximumResistance -
              minimumResistance) /
              averageResistance) *
            100;

      let consistency =
        "Consistent";

      let feedback =
        "The resistance values are reasonably close to each other.";

      let troubleshooting =
        [];

      if (
        variation > 20
      ) {
        consistency =
          "Inconsistent";

        feedback =
          "The resistance values vary significantly. Recheck the circuit and measurements.";

        troubleshooting = [
          "Check for loose circuit connections.",
          "Verify that the ammeter is connected in series.",
          "Verify that the voltmeter is connected in parallel.",
          "Repeat readings using stable voltage and current values.",
        ];
      } else if (
        variation > 10
      ) {
        consistency =
          "Needs Review";

        feedback =
          "The readings show some variation. Review the circuit and repeat any doubtful measurements.";

        troubleshooting = [
          "Check for loose wires.",
          "Confirm the meter connections.",
          "Take another reading for confirmation.",
        ];
      } else {
        troubleshooting = [
          "Circuit measurements appear stable.",
          "Resistance values are reasonably consistent.",
          "You can use the average resistance for your conclusion.",
        ];
      }

      setPhysicsAnalysis({
        success: true,
        status: "complete",
        processed,
        validReadings,
        invalidReadings,
        averageResistance,
        variation,
        consistency,
        feedback,
        troubleshooting,
      });

      resetTroubleshootingState();
    };

  /* =========================================
     PHYSICS GRAPH
  ========================================= */

  const renderPhysicsGraph =
    () => {
      if (
        !physicsAnalysis ||
        !physicsAnalysis.validReadings ||
        physicsAnalysis
          .validReadings
          .length === 0
      ) {
        return (
          <div className="graph-empty">
            Add valid readings and click
            <strong>
              Calculate &amp; Analyse
            </strong>
            to generate the V–I graph.
          </div>
        );
      }

      const points =
        physicsAnalysis.validReadings;

      const width = 700;
      const height = 360;

      const paddingLeft = 70;
      const paddingRight = 30;
      const paddingTop = 30;
      const paddingBottom = 55;

      const plotWidth =
        width -
        paddingLeft -
        paddingRight;

      const plotHeight =
        height -
        paddingTop -
        paddingBottom;

      const maxVoltage =
        Math.max(
          ...points.map(
            (point) =>
              point.voltage
          ),
          1
        );

      const maxCurrent =
        Math.max(
          ...points.map(
            (point) =>
              point.current
          ),
          1
        );

      const xScale =
        (voltage) =>
          paddingLeft +
          (voltage /
            maxVoltage) *
            plotWidth;

      const yScale =
        (current) =>
          height -
          paddingBottom -
          (current /
            maxCurrent) *
            plotHeight;

      const sortedPoints =
        [...points].sort(
          (a, b) =>
            a.voltage -
            b.voltage
        );

      const polylinePoints =
        sortedPoints
          .map(
            (point) =>
              `${xScale(
                point.voltage
              )},${yScale(
                point.current
              )}`
          )
          .join(" ");

      return (
        <div className="graph-container">
          <svg
            className="vi-graph"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Voltage current graph"
          >
            {[0, 0.25, 0.5, 0.75, 1].map(
              (fraction) => {
                const y =
                  height -
                  paddingBottom -
                  fraction *
                    plotHeight;

                return (
                  <line
                    key={`horizontal-${fraction}`}
                    x1={
                      paddingLeft
                    }
                    y1={y}
                    x2={
                      width -
                      paddingRight
                    }
                    y2={y}
                    className="graph-grid-line"
                  />
                );
              }
            )}

            {[0, 0.25, 0.5, 0.75, 1].map(
              (fraction) => {
                const x =
                  paddingLeft +
                  fraction *
                    plotWidth;

                return (
                  <line
                    key={`vertical-${fraction}`}
                    x1={x}
                    y1={
                      paddingTop
                    }
                    x2={x}
                    y2={
                      height -
                      paddingBottom
                    }
                    className="graph-grid-line"
                  />
                );
              }
            )}

            <line
              x1={
                paddingLeft
              }
              y1={
                paddingTop
              }
              x2={
                paddingLeft
              }
              y2={
                height -
                paddingBottom
              }
              className="graph-axis"
            />

            <line
              x1={
                paddingLeft
              }
              y1={
                height -
                paddingBottom
              }
              x2={
                width -
                paddingRight
              }
              y2={
                height -
                paddingBottom
              }
              className="graph-axis"
            />

            {sortedPoints.length >=
              2 && (
              <polyline
                points={
                  polylinePoints
                }
                fill="none"
                className="graph-line"
              />
            )}

            {points.map(
              (point) => (
                <circle
                  key={
                    point.id
                  }
                  cx={xScale(
                    point.voltage
                  )}
                  cy={yScale(
                    point.current
                  )}
                  r="6"
                  className="graph-point"
                />
              )
            )}

            <text
              x={
                width / 2
              }
              y={
                height - 12
              }
              textAnchor="middle"
              className="graph-label"
            >
              Voltage (V)
            </text>

            <text
              x="18"
              y={
                height / 2
              }
              textAnchor="middle"
              transform={`rotate(-90 18 ${
                height / 2
              })`}
              className="graph-label"
            >
              Current (A)
            </text>
          </svg>
        </div>
      );
    };

  /* =========================================
     TROUBLESHOOTING
  ========================================= */

  const startTroubleshooting =
    () => {
      setTroubleshootingOpen(
        true
      );

      setTroubleshootingProblem(
        null
      );

      setTroubleshootingStep(
        0
      );
    };

  const selectTroubleshootingProblem =
    (problem) => {
      setTroubleshootingOpen(
        true
      );

      setTroubleshootingProblem(
        problem
      );

      setTroubleshootingStep(
        0
      );
    };

  const nextTroubleshootingStep =
    () => {
      if (
        !troubleshootingProblem
      ) {
        return;
      }

      const flow =
        troubleshootingFlows[
          troubleshootingProblem
        ];

      if (!flow) return;

      if (
        troubleshootingStep <
        flow.steps.length -
          1
      ) {
        setTroubleshootingStep(
          (current) =>
            current + 1
        );
      }
    };

  const markTroubleshootingSolved =
    () => {
      setTroubleshootingProblem(
        "success"
      );

      setTroubleshootingStep(
        0
      );
    };

  const backToProblemSelection =
    () => {
      setTroubleshootingProblem(
        null
      );

      setTroubleshootingStep(
        0
      );
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
            Prepare for your laboratory experiments
            with guided learning, experiment-specific
            support, and intelligent troubleshooting.
          </p>

          <button
            className="start-button hero-button"
            onClick={() =>
              setPage("experiments")
            }
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
    const experimentList =
      Object.values(
        experiments
      );

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
              Select an experiment to begin your
              pre-lab preparation.
            </p>
          </div>

          <div className="experiment-grid">
            {experimentList.map(
              (experiment) => (
                <div
                  className="experiment-card"
                  key={
                    experiment.id
                  }
                >
                  <div className="card-icon">
                    {
                      experiment.icon
                    }
                  </div>

                  <h2>
                    {
                      experiment.title
                    }
                  </h2>

                  <p>
                    {
                      experiment.description
                    }
                  </p>

                  <button
                    className="start-button"
                    onClick={() =>
                      selectExperiment(
                        experiment
                      )
                    }
                  >
                    Start Experiment →
                  </button>
                </div>
              )
            )}
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
    const preparationComplete =
      prepTime === 0;

    const microPrep =
      selectedExperiment.microPrep ||
      [];

    const currentPrep =
      microPrep[prepStep];

    const prepIsQuestion =
      currentPrep?.type ===
      "question";

    const lastPrepStep =
      prepStep ===
      microPrep.length - 1;

    const questionCorrect =
      prepQuestionAnswer ===
      currentPrep?.answer;

    return (
      <main className="labready-page prep-page">
        <button
          className="back-button"
          onClick={() =>
            setPage(
              "experiments"
            )
          }
        >
          ← Back
        </button>

        <section className="micro-prep-container">
          <div className="micro-prep-header">
            <div className="prep-icon">
              {
                selectedExperiment.icon
              }
            </div>

            <div className="prep-label">
              PRE-LAB MICRO SESSION
            </div>

            <h1>
              30-Second Preparation
            </h1>

            <p>
              A quick experiment-specific session
              to prepare you before entering the lab.
            </p>

            <div className="micro-prep-experiment">
              Preparing you for:
              <strong>
                {
                  selectedExperiment.title
                }
              </strong>
            </div>
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
              {formatTime(
                prepTime
              )}
            </div>

            <div className="timer-status">
              {preparationComplete
                ? "Preparation complete"
                : prepStarted
                ? "Micro-session in progress"
                : "Ready to begin"}
            </div>
          </div>

          {microPrep.length >
            0 &&
            currentPrep && (
              <>
                <div className="micro-prep-progress">
                  {microPrep.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item.id
                        }
                        className={`micro-progress-step ${
                          index ===
                          prepStep
                            ? "active"
                            : index <
                              prepStep
                            ? "completed"
                            : ""
                        }`}
                      >
                        <span>
                          {index <
                          prepStep
                            ? "✓"
                            : index +
                              1}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <article
                  className={`micro-prep-card micro-prep-${currentPrep.type}`}
                >
                  <div className="micro-prep-card-top">
                    <div className="micro-prep-icon">
                      {
                        currentPrep.icon
                      }
                    </div>

                    <div>
                      <div className="micro-prep-label">
                        {
                          currentPrep.label
                        }
                      </div>

                      <div className="micro-prep-count">
                        STEP{" "}
                        {prepStep +
                          1}{" "}
                        /{" "}
                        {
                          microPrep.length
                        }
                      </div>
                    </div>
                  </div>

                  <h2>
                    {
                      currentPrep.title
                    }
                  </h2>

                  <p>
                    {
                      currentPrep.content
                    }
                  </p>

                  {currentPrep.example && (
                    <div className="micro-prep-example">
                      <code>
                        {
                          currentPrep.example
                        }
                      </code>
                    </div>
                  )}

                  {prepIsQuestion &&
                    currentPrep.options && (
                      <div className="micro-question-area">
                        <div className="micro-question-options">
                          {currentPrep.options.map(
                            (
                              option,
                              index
                            ) => {
                              const selected =
                                prepQuestionAnswer ===
                                index;

                              const correct =
                                currentPrep.answer ===
                                index;

                              let className =
                                "micro-question-option";

                              if (
                                prepQuestionChecked
                              ) {
                                if (
                                  correct
                                ) {
                                  className +=
                                    " correct";
                                } else if (
                                  selected
                                ) {
                                  className +=
                                    " wrong";
                                }
                              } else if (
                                selected
                              ) {
                                className +=
                                  " selected";
                              }

                              return (
                                <button
                                  key={
                                    index
                                  }
                                  type="button"
                                  className={
                                    className
                                  }
                                  onClick={() =>
                                    answerPrepQuestion(
                                      index
                                    )
                                  }
                                  disabled={
                                    prepQuestionChecked
                                  }
                                >
                                  <span>
                                    {String.fromCharCode(
                                      65 +
                                        index
                                    )}
                                  </span>

                                  <strong>
                                    {
                                      option
                                    }
                                  </strong>

                                  {prepQuestionChecked &&
                                    correct && (
                                      <b>
                                        ✓
                                      </b>
                                    )}

                                  {prepQuestionChecked &&
                                    selected &&
                                    !correct && (
                                      <b>
                                        ✕
                                      </b>
                                    )}
                                </button>
                              );
                            }
                          )}
                        </div>

                        {!prepQuestionChecked ? (
                          <button
                            className="primary-button"
                            onClick={
                              checkPrepQuestion
                            }
                            disabled={
                              prepQuestionAnswer ===
                              null
                            }
                          >
                            Check Answer →
                          </button>
                        ) : (
                          <div
                            className={`micro-question-feedback ${
                              questionCorrect
                                ? "correct"
                                : "wrong"
                            }`}
                          >
                            <strong>
                              {questionCorrect
                                ? "✓ Correct!"
                                : "✕ Not quite"}
                            </strong>

                            <p>
                              {
                                currentPrep.explanation
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </article>
              </>
            )}

          <div className="micro-prep-actions">
            <button
              className="secondary-button"
              onClick={
                previousPrepStep
              }
              disabled={
                prepStep ===
                0
              }
            >
              ← Previous
            </button>

            {!prepStarted &&
              !preparationComplete && (
                <button
                  className="start-button"
                  onClick={
                    startPreparation
                  }
                >
                  Start 30-Second Preparation →
                </button>
              )}

            {prepStarted &&
              !preparationComplete &&
              !lastPrepStep && (
                <button
                  className="primary-button"
                  onClick={
                    nextPrepStep
                  }
                >
                  Next →
                </button>
              )}

            {prepStarted &&
              !preparationComplete &&
              lastPrepStep && (
                <button
                  className="primary-button"
                  onClick={
                    skipPreparation
                  }
                >
                  Finish Early →
                </button>
              )}

            {preparationComplete && (
              <button
                className="start-button ready-button"
                onClick={
                  openQuiz
                }
              >
                Start Readiness Check →
              </button>
            )}

            {prepStarted &&
              !preparationComplete && (
                <button
                  className="skip-button"
                  onClick={
                    skipPreparation
                  }
                >
                  Skip →
                </button>
              )}
          </div>

          {preparationComplete && (
            <div className="micro-prep-complete-message">
              <span>✓</span>

              <div>
                <strong>
                  Micro-session complete
                </strong>

                <p>
                  You have reviewed the key concepts.
                  Now test your understanding.
                </p>
              </div>
            </div>
          )}
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
    const score =
      calculateScore();

    return (
      <main className="labready-page">
        <button
          className="back-button"
          onClick={() =>
            setPage(
              "preparation"
            )
          }
        >
          ← Back to Preparation
        </button>

        <section className="quiz-page">
          <div className="quiz-header">
            <div className="large-icon">
              {
                selectedExperiment.icon
              }
            </div>

            <h1>
              Readiness Check
            </h1>

            <p>
              Let's check your understanding
              of{" "}
              <strong>
                {
                  selectedExperiment.title
                }
              </strong>
              .
            </p>
          </div>

          <div className="questions-container">
            {selectedExperiment.questions.map(
              (
                question,
                questionIndex
              ) => {
                const selected =
                  answers[
                    questionIndex
                  ];

                const correct =
                  question.answer;

                return (
                  <div
                    className="question-card"
                    key={
                      questionIndex
                    }
                  >
                    <div className="question-number">
                      Question{" "}
                      {
                        questionIndex +
                        1
                      }{" "}
                      of{" "}
                      {
                        selectedExperiment
                          .questions
                          .length
                      }
                    </div>

                    <h2>
                      {
                        question.question
                      }
                    </h2>

                    <div className="options">
                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => {
                          const isSelected =
                            selected ===
                            optionIndex;

                          const isCorrect =
                            optionIndex ===
                            correct;

                          let optionClass =
                            "option";

                          if (
                            quizSubmitted
                          ) {
                            if (
                              isCorrect
                            ) {
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
                              className={
                                optionClass
                              }
                              key={
                                optionIndex
                              }
                              disabled={
                                quizSubmitted
                              }
                              onClick={() =>
                                selectAnswer(
                                  questionIndex,
                                  optionIndex
                                )
                              }
                            >
                              <span className="option-letter">
                                {String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}
                              </span>

                              <span>
                                {
                                  option
                                }
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
                          selected ===
                          correct
                            ? "question-feedback correct-feedback"
                            : "question-feedback wrong-feedback"
                        }
                      >
                        <strong>
                          {selected ===
                          correct
                            ? "✓ Correct!"
                            : "✕ Wrong answer"}
                        </strong>

                        <p>
                          Your answer:{" "}
                          {selected ===
                          null
                            ? "Not answered"
                            : `${String.fromCharCode(
                                65 +
                                  selected
                              )}. ${
                                question
                                  .options[
                                  selected
                                ]
                              }`}
                        </p>

                        <p>
                          Correct answer:{" "}
                          {String.fromCharCode(
                            65 +
                              correct
                          )}
                          .{" "}
                          {
                            question
                              .options[
                              correct
                            ]
                          }
                        </p>

                        <p>
                          {
                            question.explanation
                          }
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
              onClick={() =>
                setQuizSubmitted(
                  true
                )
              }
            >
              Check My Readiness →
            </button>
          ) : (
            <div className="score-panel">
              <h2>
                Your Score:{" "}
                {score}/
                {
                  selectedExperiment
                    .questions
                    .length
                }
              </h2>

              <p>
                {score ===
                selectedExperiment
                  .questions
                  .length
                  ? "🎉 Excellent! You are ready to continue."
                  : "Review the answers marked in red and learn from your mistakes."}
              </p>

              <button
                className="primary-button"
                onClick={() => {
                  setAnswers(
                    new Array(
                      selectedExperiment
                        .questions
                        .length
                    ).fill(null)
                  );

                  setQuizSubmitted(
                    false
                  );
                }}
              >
                Try Again
              </button>

              <button
                className="home-link"
                onClick={
                  continueToLab
                }
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
    selectedExperiment?.id ===
      "python"
  ) {
    return (
      <main className="labready-page">
        <button
          className="back-button"
          onClick={() =>
            setPage("quiz")
          }
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
            EXPERIMENT OBJECTIVE
          </div>

          <h2>
            Calculate the average of three
            numbers.
          </h2>

          <div className="objective-steps">
            <div>
              <span>01</span>
              Take three numbers as input.
            </div>

            <div>
              <span>02</span>
              Calculate their average.
            </div>

            <div>
              <span>03</span>
              Display the result.
            </div>
          </div>
        </section>

        <section className="lab-objective">
          <div className="objective-label">
            TEST INPUT
          </div>

          <h2>
            Enter the three numbers for this run.
          </h2>

          <div className="python-input-grid">
            <label>
              First Number
              <input
                className="physics-input"
                type="number"
                step="any"
                value={
                  pythonInput.first
                }
                onChange={(event) =>
                  updatePythonInput(
                    "first",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Second Number
              <input
                className="physics-input"
                type="number"
                step="any"
                value={
                  pythonInput.second
                }
                onChange={(event) =>
                  updatePythonInput(
                    "second",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Third Number
              <input
                className="physics-input"
                type="number"
                step="any"
                value={
                  pythonInput.third
                }
                onChange={(event) =>
                  updatePythonInput(
                    "third",
                    event.target.value
                  )
                }
              />
            </label>
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
              setCode(
                event.target.value
              )
            }
            spellCheck="false"
          />

          <div className="button-row">
            <button
              className="primary-button"
              onClick={
                checkPythonCode
              }
              disabled={
                checkingCode
              }
            >
              {checkingCode
                ? "⏳ Checking..."
                : "▶ Run Code"}
            </button>

            <button
              className="secondary-button"
              onClick={
                resetCode
              }
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
              {
                codeResult.title
              }
            </h2>

            <p>
              {
                codeResult.message
              }
            </p>

            {codeResult.hint && (
              <div className="hint-box">
                <strong>
                  💡 LabReady Hint
                </strong>

                <p>
                  {
                    codeResult.hint
                  }
                </p>
              </div>
            )}
          </section>
        )}

        {pythonReport && (
          <section className="physics-result-section">
            <div className="physics-section-heading">
              <div>
                <div className="objective-label">
                  LAB REPORT
                </div>

                <h2>
                  Expected vs Actual
                </h2>

                <p>
                  LabReady compares the expected result
                  with the output produced by your program.
                </p>
              </div>
            </div>

            <div className="physics-summary">
              <div className="summary-card">
                <span>
                  Input
                </span>

                <strong>
                  {
                    pythonReport.first
                  }
                  ,{" "}
                  {
                    pythonReport.second
                  }
                  ,{" "}
                  {
                    pythonReport.third
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Expected
                </span>

                <strong>
                  {
                    pythonReport.expectedAverage.toFixed(
                      2
                    )
                  }
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Actual
                </span>

                <strong>
                  {pythonReport.actualAverage !==
                  null
                    ? pythonReport.actualAverage.toFixed(
                        2
                      )
                    : "—"}
                </strong>
              </div>

              <div className="summary-card">
                <span>
                  Attempts
                </span>

                <strong>
                  {
                    pythonReport.attempts
                  }
                </strong>
              </div>
            </div>

            <div className="troubleshooting-list">
              <h3>
                Output Comparison
              </h3>

              <div className="troubleshooting-item">
                <span>
                  ✓
                </span>

                <p>
                  <strong>
                    Expected Output:
                  </strong>{" "}
                  {
                    pythonReport.expectedOutput
                  }
                </p>
              </div>

              <div className="troubleshooting-item">
                <span>
                  →
                </span>

                <p>
                  <strong>
                    Your Output:
                  </strong>{" "}
                  {
                    pythonReport.actualOutput
                  }
                </p>
              </div>
            </div>
          </section>
        )}

        {pythonCompleted && (
          <section className="experiment-complete-card">
            <div className="complete-icon">
              🏁
            </div>

            <div className="complete-content">
              <div className="objective-label">
                EXPERIMENT COMPLETE
              </div>

              <h2>
                Great! Your Python experiment is complete.
              </h2>

              <p>
                Your program ran successfully and produced
                the expected result.
              </p>

              <div className="completion-stats">
                <div>
                  <span>
                    Experiment
                  </span>

                  <strong>
                    Python Average
                  </strong>
                </div>

                <div>
                  <span>
                    Expected Average
                  </span>

                  <strong>
                    {pythonReport?.expectedAverage.toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    Verified ✓
                  </strong>
                </div>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setPage(
                  "experiments"
                );
                resetPythonState();
              }}
            >
              Finish Experiment →
            </button>
          </section>
        )}

        <section className="learning-section">
          <h2>
            How LabReady helps you
          </h2>

          <div className="learning-card">
            <div className="number">
              01
            </div>

            <div>
              <h3>
                Understand the Objective
              </h3>

              <p>
                Understand what the program is
                expected to accomplish.
              </p>
            </div>
          </div>

          <div className="learning-card">
            <div className="number">
              02
            </div>

            <div>
              <h3>
                Write Your Code
              </h3>

              <p>
                Build your Python solution using
                the concepts learned during preparation.
              </p>
            </div>
          </div>

          <div className="learning-card">
            <div className="number">
              03
            </div>

            <div>
              <h3>
                Compare Your Result
              </h3>

              <p>
                Compare your program's output with
                the expected result.
              </p>
            </div>
          </div>

          <div className="learning-card">
            <div className="number">
              04
            </div>

            <div>
              <h3>
                Review Your Lab Report
              </h3>

              <p>
                See your inputs, expected output,
                actual output and attempts.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================
     PHYSICS LAB
  ========================================= */

  if (
    page === "physicsLab" &&
    selectedExperiment?.id ===
      "physics_ohm"
  ) {
    const selectedTroubleshooting =
      troubleshootingProblem &&
      troubleshootingProblem !==
        "success"
        ? troubleshootingFlows[
            troubleshootingProblem
          ]
        : null;

    return (
      <main className="labready-page">
        <button
          className="back-button"
          onClick={() =>
            setPage("quiz")
          }
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
            Record voltage and current readings,
            calculate resistance, and analyse the
            V–I relationship.
          </p>
        </section>

        <section className="lab-objective">
          <div className="objective-label">
            EXPERIMENT OBJECTIVE
          </div>

          <h2>
            Study the relationship between
            voltage, current and resistance.
          </h2>

          <div className="objective-steps">
            <div>
              <span>01</span>
              Record voltage and current readings.
            </div>

            <div>
              <span>02</span>
              Calculate resistance using R = V / I.
            </div>

            <div>
              <span>03</span>
              Analyse consistency and the V–I graph.
            </div>
          </div>
        </section>

        <section className="physics-lab-panel">
          <div className="physics-panel-heading">
            <div>
              <div className="objective-label">
                OBSERVATION TABLE
              </div>

              <h2>
                Voltage &amp; Current Readings
              </h2>
            </div>

            <button
              className="secondary-button"
              onClick={
                addPhysicsReading
              }
            >
              + Add Reading
            </button>
          </div>

          <div className="physics-table-wrapper">
            <table className="physics-table">
              <thead>
                <tr>
                  <th>
                    Reading
                  </th>

                  <th>
                    Voltage (V)
                  </th>

                  <th>
                    Current (A)
                  </th>

                  <th>
                    Resistance (Ω)
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {physicsReadings.map(
                  (
                    reading,
                    index
                  ) => {
                    const analysedReading =
                      physicsAnalysis?.processed?.find(
                        (item) =>
                          item.id ===
                          reading.id
                      );

                    const resistance =
                      analysedReading?.resistance;

                    return (
                      <tr
                        key={
                          reading.id
                        }
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <input
                            className="physics-input"
                            type="number"
                            step="any"
                            value={
                              reading.voltage
                            }
                            onChange={(
                              event
                            ) =>
                              updatePhysicsReading(
                                reading.id,
                                "voltage",
                                event.target.value
                              )
                            }
                            placeholder="e.g. 2"
                          />
                        </td>

                        <td>
                          <input
                            className="physics-input"
                            type="number"
                            step="any"
                            value={
                              reading.current
                            }
                            onChange={(
                              event
                            ) =>
                              updatePhysicsReading(
                                reading.id,
                                "current",
                                event.target.value
                              )
                            }
                            placeholder="e.g. 0.2"
                          />
                        </td>

                        <td>
                          {Number.isFinite(
                            resistance
                          )
                            ? resistance.toFixed(
                                2
                              )
                            : "—"}
                        </td>

                        <td>
                          {analysedReading ? (
                            <span
                              className={`reading-status ${analysedReading.status}`}
                            >
                              {analysedReading.status ===
                              "valid"
                                ? "✓ Valid"
                                : analysedReading.status ===
                                  "warning"
                                ? "⚠ Review"
                                : "✕ Invalid"}
                            </span>
                          ) : (
                            <span className="reading-status">
                              —
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-reading-button"
                            onClick={() =>
                              deletePhysicsReading(
                                reading.id
                              )
                            }
                            disabled={
                              physicsReadings.length <=
                              1
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="physics-action-row">
            <button
              className="primary-button"
              onClick={
                analyzePhysicsExperiment
              }
            >
              Calculate &amp; Analyse →
            </button>

            <button
              className="secondary-button"
              onClick={
                resetPhysicsReadings
              }
            >
              Reset Readings
            </button>
          </div>
        </section>

        {physicsAnalysis && (
          <section className="physics-analysis-section">
            {!physicsAnalysis.success ? (
              <div className="physics-feedback-box warning">
                <h2>
                  ⚠ More Data Needed
                </h2>

                <p>
                  {
                    physicsAnalysis.feedback
                  }
                </p>

                <div className="troubleshooting-list">
                  <h3>
                    LabReady Troubleshooting
                  </h3>

                  {physicsAnalysis.troubleshooting.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="troubleshooting-item"
                      >
                        <span>
                          •
                        </span>

                        <p>
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="physics-summary">
                  <div className="summary-card">
                    <span>
                      Valid Readings
                    </span>

                    <strong>
                      {
                        physicsAnalysis
                          .validReadings
                          .length
                      }
                    </strong>
                  </div>

                  <div className="summary-card">
                    <span>
                      Avg. Resistance
                    </span>

                    <strong>
                      {
                        physicsAnalysis.averageResistance.toFixed(
                          2
                        )
                      }{" "}
                      Ω
                    </strong>
                  </div>

                  <div className="summary-card">
                    <span>
                      Variation
                    </span>

                    <strong>
                      {
                        physicsAnalysis.variation.toFixed(
                          2
                        )
                      }
                      %
                    </strong>
                  </div>

                  <div className="summary-card">
                    <span>
                      Consistency
                    </span>

                    <strong>
                      {
                        physicsAnalysis.consistency
                      }
                    </strong>
                  </div>
                </div>

                <div
                  className={`physics-feedback-box ${
                    physicsAnalysis.consistency ===
                    "Inconsistent"
                      ? "danger"
                      : physicsAnalysis.consistency ===
                        "Needs Review"
                      ? "warning"
                      : "success"
                  }`}
                >
                  <h2>
                    {physicsAnalysis.consistency ===
                    "Inconsistent"
                      ? "⚠ Measurements Need Attention"
                      : physicsAnalysis.consistency ===
                        "Needs Review"
                      ? "⚠ Review Your Measurements"
                      : "✓ Experiment Looks Good"}
                  </h2>

                  <p>
                    {
                      physicsAnalysis.feedback
                    }
                  </p>

                  {physicsAnalysis.invalidReadings &&
                    physicsAnalysis
                      .invalidReadings
                      .length >
                      0 && (
                      <div className="invalid-reading-note">
                        <strong>
                          Invalid readings detected:
                        </strong>{" "}
                        {
                          physicsAnalysis
                            .invalidReadings
                            .length
                        }
                      </div>
                    )}

                  <div className="troubleshooting-list">
                    <h3>
                      LabReady Feedback
                    </h3>

                    {physicsAnalysis.troubleshooting.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="troubleshooting-item"
                        >
                          <span>
                            •
                          </span>

                          <p>
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <section className="physics-result-section">
                  <div className="physics-section-heading">
                    <div>
                      <div className="objective-label">
                        GRAPHICAL ANALYSIS
                      </div>

                      <h2>
                        Voltage–Current Relationship
                      </h2>

                      <p>
                        A visual representation of the
                        measured voltage and current values.
                      </p>
                    </div>
                  </div>

                  {renderPhysicsGraph()}
                </section>

                {physicsAnalysis.consistency !==
                  "Consistent" && (
                  <section className="troubleshooting-panel">
                    {!troubleshootingOpen && (
                      <button
                        className="troubleshooting-main-button"
                        onClick={
                          startTroubleshooting
                        }
                      >
                        🛠 No, there's a problem
                      </button>
                    )}

                    {troubleshootingOpen &&
                      troubleshootingProblem ===
                        null && (
                        <section className="troubleshooting-interface">
                          <div className="troubleshooting-interface-header">
                            <div className="troubleshooting-header-icon">
                              🛠
                            </div>

                            <div>
                              <div className="objective-label">
                                INTERACTIVE TROUBLESHOOTING
                              </div>

                              <h2>
                                Let's find out what went wrong
                              </h2>

                              <p>
                                LabReady will guide you through
                                the problem step by step.
                              </p>
                            </div>
                          </div>

                          <div className="troubleshooting-selection">
                            <h3>
                              What problem are you facing?
                            </h3>

                            <div className="troubleshooting-options">
                              {Object.entries(
                                troubleshootingFlows
                              ).map(
                                (
                                  [
                                    key,
                                    flow,
                                  ]
                                ) => (
                                  <button
                                    key={
                                      key
                                    }
                                    className="troubleshooting-option"
                                    onClick={() =>
                                      selectTroubleshootingProblem(
                                        key
                                      )
                                    }
                                  >
                                    <span>
                                      {
                                        flow.icon
                                      }
                                    </span>

                                    <strong>
                                      {
                                        flow.title
                                      }
                                    </strong>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </section>
                      )}

                    {troubleshootingOpen &&
                      troubleshootingProblem &&
                      troubleshootingProblem !==
                        "success" && (
                        <section className="troubleshooting-interface">
                          <div className="troubleshooting-interface-header">
                            <div className="troubleshooting-header-icon">
                              🛠
                            </div>

                            <div>
                              <div className="objective-label">
                                GUIDED TROUBLESHOOTING
                              </div>

                              <h2>
                                Work through the issue step by step
                              </h2>

                              <p>
                                Check each possibility before moving
                                to the next one.
                              </p>
                            </div>
                          </div>

                          <div className="troubleshooting-guide">
                            <div className="troubleshooting-problem-banner">
                              <span>
                                {
                                  selectedTroubleshooting?.icon
                                }
                              </span>

                              <div>
                                <span>
                                  Current problem
                                </span>

                                <strong>
                                  {
                                    selectedTroubleshooting?.title
                                  }
                                </strong>
                              </div>
                            </div>

                            <div className="cause-box">
                              <h3>
                                Possible causes
                              </h3>

                              <div className="cause-list">
                                {selectedTroubleshooting?.causes.map(
                                  (
                                    cause,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        index
                                      }
                                      className="cause-item"
                                    >
                                      <span>
                                        {index +
                                          1}
                                      </span>

                                      <p>
                                        {cause}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="guided-step-card">
                              <div className="guided-step-number">
                                Step{" "}
                                {
                                  troubleshootingStep +
                                    1
                                }{" "}
                                of{" "}
                                {
                                  selectedTroubleshooting
                                    ?.steps
                                    .length
                                }
                              </div>

                              <h3>
                                {
                                  selectedTroubleshooting
                                    ?.steps[
                                    troubleshootingStep
                                  ]
                                    ?.title
                                }
                              </h3>

                              <p>
                                {
                                  selectedTroubleshooting
                                    ?.steps[
                                    troubleshootingStep
                                  ]
                                    ?.text
                                }
                              </p>
                            </div>

                            <div className="troubleshooting-actions">
                              <button
                                className="secondary-button"
                                onClick={
                                  backToProblemSelection
                                }
                              >
                                ← Choose Another Problem
                              </button>

                              {troubleshootingStep <
                              selectedTroubleshooting
                                ?.steps
                                .length -
                                1 ? (
                                <button
                                  className="primary-button"
                                  onClick={
                                    nextTroubleshootingStep
                                  }
                                >
                                  Next Check →
                                </button>
                              ) : (
                                <button
                                  className="primary-button"
                                  onClick={
                                    markTroubleshootingSolved
                                  }
                                >
                                  I've Fixed It ✓
                                </button>
                              )}
                            </div>

                            <button
                              className="still-not-working-button"
                              onClick={
                                backToProblemSelection
                              }
                            >
                              Still Not Working? →
                            </button>
                          </div>
                        </section>
                      )}

                    {troubleshootingOpen &&
                      troubleshootingProblem ===
                        "success" && (
                        <section className="experiment-complete-card">
                          <div className="complete-icon">
                            🏁
                          </div>

                          <div className="complete-content">
                            <div className="objective-label">
                              EXPERIMENT COMPLETE
                            </div>

                            <h2>
                              Great! Your experiment worked.
                            </h2>

                            <p>
                              Your readings have been analysed
                              and the experiment was completed
                              successfully.
                            </p>

                            <div className="completion-stats">
                              <div>
                                <span>
                                  Readings recorded
                                </span>

                                <strong>
                                  {
                                    physicsAnalysis
                                      .validReadings
                                      .length
                                  }
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Avg. resistance
                                </span>

                                <strong>
                                  {
                                    physicsAnalysis.averageResistance.toFixed(
                                      2
                                    )
                                  }{" "}
                                  Ω
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Variation
                                </span>

                                <strong>
                                  {
                                    physicsAnalysis.variation.toFixed(
                                      2
                                    )
                                  }%
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Consistency
                                </span>

                                <strong>
                                  {
                                    physicsAnalysis.consistency
                                  }
                                </strong>
                              </div>
                            </div>
                          </div>

                          <button
                            className="primary-button"
                            onClick={() => {
                              setPage(
                                "experiments"
                              );

                              resetTroubleshootingState();
                            }}
                          >
                            Finish Experiment →
                          </button>
                        </section>
                      )}
                  </section>
                )}
              </>
            )}
          </section>
        )}
      </main>
    );
  }

  return null;
}

export default App;