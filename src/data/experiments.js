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

    // Question bank used for random quiz generation
    questionPool: [
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
          "Which symbol is used for a single-line comment in Python?",
        options: ["//", "#", "/*", "--"],
        answer: 1,
        explanation:
          "Python uses # for a single-line comment.",
      },
      {
        question:
          "Which function is commonly used to display output?",
        options: ["display()", "show()", "print()", "output()"],
        answer: 2,
        explanation:
          "The print() function is commonly used to display output.",
      },
      {
        question:
          "Which function is commonly used to take input from a user?",
        options: ["get()", "input()", "read()", "scan()"],
        answer: 1,
        explanation:
          "Python commonly uses input() to receive user input.",
      },
      {
        question:
          "Which symbol is used for multiplication in Python?",
        options: ["x", "*", "%", "^"],
        answer: 1,
        explanation:
          "The * operator is used for multiplication.",
      },
      {
        question:
          "Which data type is used for decimal numbers?",
        options: ["int", "str", "float", "bool"],
        answer: 2,
        explanation:
          "The float data type represents decimal numbers.",
      },
      {
        question:
          "What does len() commonly return?",
        options: [
          "The data type",
          "The length",
          "The memory address",
          "The last value",
        ],
        answer: 1,
        explanation:
          "len() returns the length of a sequence such as a string or list.",
      },
      {
        question:
          "Which operator is used for division in Python?",
        options: ["%", "//", "/", "\\"],
        answer: 2,
        explanation:
          "The / operator performs division.",
      },
      {
        question:
          "Which of these is a valid Python variable name?",
        options: [
          "2value",
          "my-value",
          "my_value",
          "class",
        ],
        answer: 2,
        explanation:
          "my_value is a valid Python variable name.",
      },
      {
        question:
          "What type of value does a comparison such as 5 > 3 produce?",
        options: [
          "String",
          "Boolean",
          "Float",
          "List",
        ],
        answer: 1,
        explanation:
          "A comparison produces a Boolean value: True or False.",
      },
      {
        question:
          "Which operator is used to find the remainder after division?",
        options: ["%", "/", "//", "**"],
        answer: 0,
        explanation:
          "The % operator returns the remainder of a division.",
      },
      {
        question:
          "What does the int() function commonly do?",
        options: [
          "Converts a value to an integer",
          "Prints an integer",
          "Creates a list",
          "Deletes a variable",
        ],
        answer: 0,
        explanation:
          "int() converts a compatible value to an integer.",
      },
    ],

    microPrep: [
      {
        id: 1,
        type: "concept",
        title: "Key Concept",
        heading: "Variables & Data Types",
        content:
          "Python variables store values such as numbers, text, and Boolean values.",
        example:
          'name = "LabReady"\nage = 18',
      },
      {
        id: 2,
        type: "concept",
        title: "Input & Output",
        heading: "Getting and Displaying Data",
        content:
          "Use input() to receive data and print() to display results.",
        example:
          'name = input("Enter your name: ")\nprint(name)',
      },
      {
        id: 3,
        type: "concept",
        title: "Processing",
        heading: "Basic Calculations",
        content:
          "Python can process values using arithmetic operators.",
        example:
          "total = a + b",
      },
      {
        id: 4,
        type: "mistake",
        title: "Common Mistake",
        heading: "Undefined Variable",
        content:
          "A variable must be assigned a value before you use it.",
        example:
          'name = "Jayesh"\nprint(name)',
      },
      {
        id: 5,
        type: "question",
        title: "Quick Check",
        heading: "Which function displays output?",
        options: [
          "input()",
          "print()",
          "display()",
          "show()",
        ],
        answer: 1,
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
        options: [
          "V = IR",
          "P = VI",
          "R = VI",
          "I = VR",
        ],
        answer: 0,
        explanation:
          "Ohm's Law is V = I × R.",
      },
    ],

    // Question bank used for random quiz generation
    questionPool: [
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
        options: [
          "V = IR",
          "P = VI",
          "R = VI",
          "I = VR",
        ],
        answer: 0,
        explanation:
          "Ohm's Law is V = I × R.",
      },
      {
        question:
          "Which instrument measures potential difference?",
        options: [
          "Ammeter",
          "Voltmeter",
          "Resistor",
          "Galvanometer",
        ],
        answer: 1,
        explanation:
          "A voltmeter measures potential difference.",
      },
      {
        question:
          "How is a voltmeter normally connected?",
        options: [
          "In series",
          "In parallel",
          "Without wires",
          "Only to the battery",
        ],
        answer: 1,
        explanation:
          "A voltmeter is connected in parallel across the component.",
      },
      {
        question:
          "How is an ammeter normally connected?",
        options: [
          "In parallel",
          "In series",
          "Across the battery only",
          "Outside the circuit",
        ],
        answer: 1,
        explanation:
          "An ammeter is connected in series so that current flows through it.",
      },
      {
        question:
          "What happens to resistance if voltage is 10 V and current is 2 A?",
        options: [
          "2 Ω",
          "5 Ω",
          "8 Ω",
          "20 Ω",
        ],
        answer: 1,
        explanation:
          "Using R = V/I, resistance = 10/2 = 5 Ω.",
      },
      {
        question:
          "What does the symbol I represent in Ohm's Law?",
        options: [
          "Voltage",
          "Current",
          "Resistance",
          "Power",
        ],
        answer: 1,
        explanation:
          "I represents electric current.",
      },
      {
        question:
          "What does the symbol R represent?",
        options: [
          "Current",
          "Voltage",
          "Resistance",
          "Energy",
        ],
        answer: 2,
        explanation:
          "R represents resistance.",
      },
      {
        question:
          "Which unit is used for electric current?",
        options: [
          "Ohm",
          "Volt",
          "Ampere",
          "Watt",
        ],
        answer: 2,
        explanation:
          "Electric current is measured in amperes (A).",
      },
      {
        question:
          "If the voltage is 12 V and resistance is 4 Ω, what is the current?",
        options: [
          "2 A",
          "3 A",
          "4 A",
          "48 A",
        ],
        answer: 1,
        explanation:
          "Using I = V/R, current = 12/4 = 3 A.",
      },
      {
        question:
          "If current increases while resistance remains constant, what happens to voltage?",
        options: [
          "Voltage decreases",
          "Voltage remains zero",
          "Voltage increases",
          "Voltage becomes negative",
        ],
        answer: 2,
        explanation:
          "From V = IR, increasing current at constant resistance increases voltage.",
      },
    ],

    microPrep: [
      {
        id: 1,
        type: "concept",
        title: "Key Concept",
        heading: "Ohm's Law",
        content:
          "Ohm's Law describes the relationship between voltage, current, and resistance.",
        example:
          "V = I × R",
      },
      {
        id: 2,
        type: "equipment",
        title: "Equipment",
        heading: "Circuit Components",
        content:
          "Identify the resistor, ammeter, voltmeter, cell, and connecting wires.",
        example:
          "Ammeter → Current\nVoltmeter → Voltage",
      },
      {
        id: 3,
        type: "concept",
        title: "Connections",
        heading: "Correct Instrument Connections",
        content:
          "The ammeter is connected in series while the voltmeter is connected in parallel.",
        example:
          "Ammeter → Series\nVoltmeter → Parallel",
      },
      {
        id: 4,
        type: "mistake",
        title: "Common Mistake",
        heading: "Incorrect Meter Connection",
        content:
          "Connecting a measuring instrument incorrectly can produce wrong readings.",
        example:
          "Check the connection before recording values.",
      },
      {
        id: 5,
        type: "question",
        title: "Quick Check",
        heading: "How is an ammeter connected?",
        options: [
          "In parallel",
          "In series",
          "Outside the circuit",
          "Only across the battery",
        ],
        answer: 1,
      },
    ],
  },
};