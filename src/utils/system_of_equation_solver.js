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
export default solveLinearSystem