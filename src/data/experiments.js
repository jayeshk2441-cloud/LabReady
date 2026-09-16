export const experiments = {
  python: {
    id: "python",
    title: "Python Programming",
    icon: "🐍",
    description:
      "Practice programming, identify mistakes, and troubleshoot your lab code.",

    preparation: [
      {
        id: 1,
        title: "Python Basics",
        content:
          "Review variables, values, data types, expressions, and basic Python syntax.",
        example: 'name = "LabReady"',
      },
      {
        id: 2,
        title: "Input & Output",
        content:
          "Understand how input() receives data from the user and print() displays output.",
        example: 'name = input("Enter your name: ")',
      },
      {
        id: 3,
        title: "Operators",
        content:
          "Review arithmetic operators used for calculations.",
        example: "total = a + b",
      },
      {
        id: 4,
        title: "Common Mistakes",
        content:
          "Pay attention to spelling, brackets, indentation, variables, and operators.",
        example: "print(total)",
      },
      {
        id: 5,
        title: "Quick Review",
        content:
          "Recall the main concepts before attempting the readiness questions.",
        example:
          "Variables → Input → Processing → Output",
      },
    ],

    questions: [
      {
        question:
          "Which keyword is used to define a function in Python?",
        options: ["function", "def", "fun", "define"],
        answer: 1,
        explanation:
          "The def keyword is used to define a function in Python.",
      },
      {
        question:
          "Which symbol is used for a comment in Python?",
        options: ["//", "#", "/*", "--"],
        answer: 1,
        explanation:
          "Python uses # for a single-line comment.",
      },
      {
        question:
          "Which function is commonly used to display output in Python?",
        options: ["display()", "show()", "print()", "output()"],
        answer: 2,
        explanation:
          "The print() function is commonly used to display output.",
      },
    ],
  },

  physics_ohm: {
    id: "physics_ohm",
    title: "Physics Experiment",
    icon: "⚡",
    description:
      "Prepare for your physics experiment with concepts, procedure, and common mistakes.",

    preparation: [
      {
        id: 1,
        title: "Ohm's Law",
        content:
          "Review the relationship between voltage, current, and resistance.",
        example: "V = I × R",
      },
      {
        id: 2,
        title: "Circuit Components",
        content:
          "Identify the resistor, ammeter, voltmeter, cell, and connecting wires.",
        example:
          "Ammeter → Current\nVoltmeter → Voltage",
      },
      {
        id: 3,
        title: "Connections",
        content:
          "Review the correct way to connect measuring instruments in the circuit.",
        example:
          "Ammeter → Series\nVoltmeter → Parallel",
      },
      {
        id: 4,
        title: "Measurements",
        content:
          "Understand how voltage and current values are recorded during the experiment.",
        example:
          "Record V and I for different readings.",
      },
      {
        id: 5,
        title: "Common Mistakes",
        content:
          "Check polarity, loose connections, and incorrect instrument placement.",
        example:
          "Always verify the circuit before taking readings.",
      },
    ],

    questions: [
      {
        question:
          "What is the SI unit of resistance?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        answer: 2,
        explanation:
          "Resistance is measured in ohms (Ω).",
      },
      {
        question:
          "Which instrument is connected in series to measure current?",
        options: [
          "Voltmeter",
          "Ammeter",
          "Galvanometer",
          "Wattmeter",
        ],
        answer: 1,
        explanation:
          "An ammeter is connected in series to measure current.",
      },
      {
        question:
          "Which formula represents Ohm's Law?",
        options: ["V = IR", "P = VI", "R = VI", "I = VR"],
        answer: 0,
        explanation:
          "Ohm's Law is V = I × R.",
      },
    ],
  },
};