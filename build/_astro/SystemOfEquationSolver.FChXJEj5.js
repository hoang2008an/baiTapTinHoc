import { j as jsxRuntimeExports } from './jsx-runtime.XI9uIe3W.js';
import { r as reactExports } from './index.B2C10fzS.js';
/* empty css                        */
import { c as createLucideIcon } from './createLucideIcon.ovprW0HO.js';

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["line", { x1: "5", x2: "19", y1: "9", y2: "9", key: "1nwqeh" }],
  ["line", { x1: "5", x2: "19", y1: "15", y2: "15", key: "g8yjpy" }]
];
const Equal = createLucideIcon("Equal", __iconNode$1);

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("Plus", __iconNode);

/**
 * Solves a system of n linear equations with n variables using Gaussian elimination.
 * @param {number[][]} A - The coefficient matrix (n x n).
 * @param {number[]} b - The constant vector (length n).
 * @returns {string|number[]} Returns the solution vector x, "No Solution", or "Infinite Solutions".
 */
function solveLinearSystem(A, b) {
    const n = A.length;
  
    // Validate input dimensions.
    if (!Array.isArray(A) || !Array.isArray(b) || b.length !== n) {
      throw new Error("Invalid input dimensions: Ensure A is n x n and b is length n.");
    }
    for (let i = 0; i < n; i++) {
      if (A[i].length !== n) {
        throw new Error("Invalid matrix dimensions: Every row of A must have length n.");
      }
    }
  
    // Create the augmented matrix [A | b]
    let M = [];
    for (let i = 0; i < n; i++) {
      M[i] = A[i].slice();
      M[i].push(b[i]); // Add b as the last column
    }
  
    // Forward elimination: convert M to an upper triangular matrix.
    for (let k = 0; k < n; k++) {
      // Partial Pivoting: Find the row with the largest absolute value in column k.
      let maxRow = k;
      let maxVal = Math.abs(M[k][k]);
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(M[i][k]) > maxVal) {
          maxVal = Math.abs(M[i][k]);
          maxRow = i;
        }
      }
  
      // If the pivot is effectively zero, check for special cases.
      if (Math.abs(M[maxRow][k]) < 1e-12) {
        // Swap is unnecessary because all elements below it are zero too.
        continue; // Move to the next column
      }
  
      // Swap the current row with the pivot row.
      if (maxRow !== k) {
        [M[k], M[maxRow]] = [M[maxRow], M[k]];
      }
  
      // Eliminate entries below the pivot.
      for (let i = k + 1; i < n; i++) {
        let factor = M[i][k] / M[k][k];
        for (let j = k; j <= n; j++) {
          M[i][j] -= factor * M[k][j];
        }
      }
    }
  
    // Check for special cases (No solution or Infinite solutions)
    for (let i = 0; i < n; i++) {
      let allZero = true;
      for (let j = 0; j < n; j++) {
        if (Math.abs(M[i][j]) > 1e-12) {
          allZero = false;
          break;
        }
      }
  
      if (allZero) {
        if (Math.abs(M[i][n]) > 1e-12) {
          return "No Solution"; // Contradiction: 0 = nonzero
        }
        return "Infinite Solutions"; // A row of all zeros means free variables
      }
    }
  
    // Back substitution: solve for x in the upper triangular system.
    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= M[i][j] * x[j];
      }
      x[i] = sum / M[i][i];
    }
  
    return x;
  }
  
  // Example usage:
  (function () {
    // Unique Solution Example
    const A1 = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ];
    const b1 = [8, -11, -3];
  
    // No Solution Example (Inconsistent System)
    const A2 = [
      [1, -2, 3],
      [2, -4, 6],
      [1, 1, 1],
    ];
    const b2 = [5, 10, 7];
  
    // Infinite Solutions Example (Dependent Equations)
    const A3 = [
      [1, -2, 3],
      [2, -4, 6],
      [3, -6, 9],
    ];
    const b3 = [5, 10, 15];
  
    console.log("Unique Solution:", solveLinearSystem(A1, b1)); // Expected output: [2, 3, -1]
    console.log("No Solution:", solveLinearSystem(A2, b2)); // Expected output: "No Solution"
    console.log("Infinite Solutions:", solveLinearSystem(A3, b3)); // Expected output: "Infinite Solutions"
  })();

function LinearEquationSystem() {
  const [size, setSize] = reactExports.useState("3");
  const [coefficients, setCoefficients] = reactExports.useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [constants, setConstants] = reactExports.useState(Array(3).fill(""));
  const [error, setError] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    const validSize = Math.max(1, Math.min(100, parseInt(newSize) || 1));
    setCoefficients(Array(validSize).fill().map(() => Array(validSize).fill("")));
    setConstants(Array(validSize).fill(""));
  };
  const validateNumber = (value) => {
    if (value === "") return "";
    const normalizedValue = value.replace(",", ".");
    return !isNaN(normalizedValue) ? normalizedValue : "";
  };
  const handleCoefficientChange = (eqIndex, varIndex, value) => {
    const validValue = validateNumber(value);
    const newCoefficients = [...coefficients];
    newCoefficients[eqIndex][varIndex] = validValue;
    setCoefficients(newCoefficients);
  };
  const handleConstantChange = (index, value) => {
    const validValue = validateNumber(value);
    const newConstants = [...constants];
    newConstants[index] = validValue;
    setConstants(newConstants);
  };
  const resetForm = () => {
    const s = parseInt(size) || 1;
    setCoefficients(Array(s).fill().map(() => Array(s).fill("")));
    setConstants(Array(s).fill(""));
    setError("");
    setResult(null);
  };
  const handleSubmit = () => {
    setError("");
    const validCoefficients = coefficients.map((row) => row.map((val) => val === "" ? 0 : parseFloat(val)));
    const validConstants = constants.map((val) => val === "" ? 0 : parseFloat(val));
    try {
      setResult(solveLinearSystem(validCoefficients, validConstants));
    } catch (e) {
      setError(e.message);
    }
  };
  const getVariableName = (index) => {
    const subscript = (index + 1).toString().split("").map(
      (digit) => "₀₁₂₃₄₅₆₇₈₉"[parseInt(digit)]
    ).join("");
    return `x${subscript}`;
  };
  const inputBaseClass = `
    w-16 
    text-center 
    bg-transparent 
    outline-none 
    relative
    transition-all
    duration-300
    focus:outline-none
    [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:m-0
    [&::-webkit-outer-spin-button]:m-0
  `;
  const inputContainerClass = `
    relative
    inline-block
    before:absolute
    before:bottom-0
    before:left-0
    before:right-0
    before:h-[1px]
    before:bg-gray-300
    after:absolute
    after:bottom-0
    after:left-1/2
    after:right-1/2
    after:h-[2px]
    after:bg-black
    after:transition-all
    after:duration-300
    hover:after:left-0
    hover:after:right-0
    focus-within:after:left-0
    focus-within:after:right-0
  `;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: "Hệ phương trình tuyến tính" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-gray-600", children: "Kích thước hệ:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: inputContainerClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          inputMode: "numeric",
          pattern: "[0-9]*",
          value: size,
          onChange: (e) => handleSizeChange(e.target.value),
          className: `w-20 px-2 py-1 ${inputBaseClass}`
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8 w-full", children: coefficients.map((equation, eqIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center justify-center gap-y-4 pb-4 border-b border-gray-200",
        children: [
          equation.map((coeff, varIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            varIndex > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-gray-400 mx-1 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: inputContainerClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  inputMode: "decimal",
                  defaultValue: 0,
                  value: coeff,
                  onChange: (e) => handleCoefficientChange(eqIndex, varIndex, e.target.value),
                  className: inputBaseClass,
                  placeholder: "0"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-lg font-medium whitespace-nowrap", children: getVariableName(varIndex) })
            ] })
          ] }, varIndex)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Equal, { className: "h-4 w-4 text-gray-400 mx-2 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: inputContainerClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              inputMode: "decimal",
              value: constants[eqIndex],
              onChange: (e) => handleConstantChange(eqIndex, e.target.value),
              className: inputBaseClass,
              placeholder: "0"
            }
          ) })
        ]
      },
      eqIndex
    )) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: resetForm,
          className: "px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200",
          children: "Đặt lại"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSubmit,
          className: "px-6 py-2.5 bg-gray-800 text-white rounded-lg \r\n                       hover:bg-gray-900 focus:outline-none focus:ring-2 \r\n                       focus:ring-gray-800 focus:ring-opacity-50\r\n                       transition-all duration-200 ease-in-out hover:shadow-lg",
          children: "Giải"
        }
      )
    ] }),
    result !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-4 mt-4 w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Kết quả:" }),
      typeof result === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700", children: result === "Infinite Solutions" ? "Vô số nghiệm" : result === "No Solution" ? "Vô nghiệm" : result }) : Array.isArray(result) ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside text-gray-700", children: result.map((val, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        getVariableName(i),
        " = ",
        val
      ] }, i)) }) : null
    ] })
  ] }) }) });
}

export { LinearEquationSystem as default };
