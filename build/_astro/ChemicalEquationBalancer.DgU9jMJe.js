import { j as jsxRuntimeExports } from './jsx-runtime.XI9uIe3W.js';
import { R as React, r as reactExports } from './index.B2C10fzS.js';
import { c as createLucideIcon } from './createLucideIcon.ovprW0HO.js';

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("ArrowRight", __iconNode$1);

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("RefreshCw", __iconNode);

function formatMolecule(formula) {
  const parts = formula.split(/(\d+)/).filter((part) => part !== "");
  return parts.map((part, index) => {
    if (/^\d+$/.test(part)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("sub", { children: part }, index);
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: part }, index);
    }
  });
}
const ChemicalEquationDisplay = ({ coefficients, molecules, reactantCount }) => {
  console.table({ coefficients, molecules, reactantCount });
  const renderMolecule = (coef, formula) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { margin: "0 4px" }, children: [
    coef !== 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: coef }),
    formatMolecule(formula)
  ] });
  const reactants = molecules.slice(0, reactantCount).map((formula, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    renderMolecule(coefficients[index], formula),
    index < reactantCount - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " + " })
  ] }, index));
  const products = molecules.slice(reactantCount).map((formula, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    renderMolecule(coefficients[reactantCount + index], formula),
    index < molecules.slice(reactantCount).length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " + " })
  ] }, index));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        fontFamily: '"Times New Roman", serif',
        fontSize: "1.5em",
        display: "flex",
        alignItems: "center"
      },
      children: [
        reactants,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { margin: "0 8px" }, children: "→" }),
        products
      ]
    }
  );
};

/**
 * Hàm phân tích công thức hóa học, ví dụ "Na(NO3)2", thành đối tượng
 * ánh xạ mỗi nguyên tố với số lượng xuất hiện của nó.
 */
function parseFormula(formula) {
    let index = 0;
  
    // Hàm đệ quy để phân tích nhóm (có thể là cả phân tử hoặc nhóm trong ngoặc)
    function parseGroup() {
      const counts = {};
      while (index < formula.length && formula[index] !== ')') {
        if (formula[index] === '(') {
          index++; // Bỏ qua dấu '('
          const innerCounts = parseGroup();
          if (formula[index] !== ')') {
            throw new Error(`Lỗi: Dấu ngoặc không khớp trong công thức: ${formula}`);
          }
          index++; // Bỏ qua dấu ')'
          const multiplier = parseNumber();
          // Nhân số đếm bên trong ngoặc với hệ số nhân
          for (const elem in innerCounts) {
            counts[elem] = (counts[elem] || 0) + innerCounts[elem] * multiplier;
          }
        } else {
          const element = parseElement();
          const count = parseNumber();
          counts[element] = (counts[element] || 0) + count;
        }
      }
      return counts;
    }
  
    // Hàm phân tích biểu tượng nguyên tố (ví dụ: "H", "Na", "Cl")
    function parseElement() {
      const match = formula.substring(index).match(/^[A-Z][a-z]?/);
      if (!match) {
        throw new Error(`Lỗi: Nguyên tố không hợp lệ tại vị trí ${index} trong công thức: ${formula}`);
      }
      index += match[0].length;
      return match[0];
    }
  
    // Hàm phân tích số sau nguyên tố hoặc nhóm; mặc định là 1 nếu không có số
    function parseNumber() {
      const match = formula.substring(index).match(/^\d+/);
      if (match) {
        index += match[0].length;
        return parseInt(match[0], 10);
      }
      return 1;
    }
  
    return parseGroup();
  }
  
  /**
   * Xác thực và tiền xử lý chuỗi phương trình:
   * - Loại bỏ khoảng trắng.
   * - Kiểm tra các ký tự không hợp lệ.
   * - Kiểm tra mũi tên phản ứng (chỉ cho phép duy nhất 1 mũi tên: "->" hoặc "=").
   */
  function validateAndPreprocess(equation) {
    // Loại bỏ tất cả khoảng trắng
    equation = equation.replace(/\s+/g, '');
    
    // Cho phép các ký tự: A-Z, a-z, 0-9, dấu ngoặc, dấu cộng, dấu trừ, dấu bằng, và dấu '>' (cho mũi tên)
    if (!/^[A-Za-z0-9()+\-=>]+$/.test(equation)) {
      throw new Error("Lỗi: Phương trình chứa ký tự không hợp lệ.");
    }
    
    // Kiểm tra mũi tên phản ứng: phải có duy nhất 1 mũi tên ("->" hoặc "=")
    const arrowMatches = equation.match(/(->|=)/g);
    if (!arrowMatches) {
      throw new Error("Lỗi: Không tìm thấy mũi tên phản ứng (-> hoặc =) trong phương trình.");
    }
    if (arrowMatches.length > 1) {
      throw new Error("Lỗi: Phương trình chứa nhiều mũi tên phản ứng.");
    }
    
    return equation;
  }
  
  /**
   * Tách phương trình thành phản ứng và sản phẩm dựa vào mũi tên (-> hoặc =).
   */
  function splitEquation(equation) {
    let reactants, products;
    if (equation.includes("->")) {
      [reactants, products] = equation.split("->");
    } else if (equation.includes("=")) {
      [reactants, products] = equation.split("=");
    } else {
      // Điều này có thể không xảy ra do hàm validateAndPreprocess đã kiểm tra.
      throw new Error("Lỗi: Không tìm thấy mũi tên phản ứng (-> hoặc =) trong phương trình.");
    }
    return { reactants, products };
  }
  
  /**
   * Phân tích một bên của phương trình (phản ứng hoặc sản phẩm).
   * Tách chuỗi theo dấu '+' và đảm bảo rằng không có hệ số trước công thức phân tử.
   */
  function parseSide(sideString) {
    if (sideString.trim() === "") return [];
    return sideString.split('+').map(mol => {
      // Kiểm tra xem phân tử không được bắt đầu bằng số (hệ số)
      if (/^\d/.test(mol)) {
        throw new Error(`Lỗi: Phân tử "${mol}" không được chứa hệ số.`);
      }
      return { formula: mol, elements: parseFormula(mol) };
    });
  }
  
  /**
   * Xây dựng ma trận biểu diễn phương trình hóa học.
   *
   * - Mỗi cột ứng với một phân tử (phản ứng trước, sản phẩm sau).
   * - Mỗi hàng ứng với một nguyên tố.
   * - Ở phản ứng, số đếm là số dương; ở sản phẩm, số đếm là số âm.
   *
   * Trả về đối tượng chứa:
   * - matrix: mảng 2D số.
   * - elements: mảng chứa các nguyên tố (mỗi hàng).
   * - molecules: mảng công thức phân tử (theo thứ tự cột trong ma trận).
   */
  function buildMatrix(equation) {
    // Bước 1: Xác thực và tiền xử lý
    equation = validateAndPreprocess(equation);
  
    // Bước 2: Tách thành phản ứng và sản phẩm
    const { reactants: reactantsStr, products: productsStr } = splitEquation(equation);
  
    // Bước 3: Phân tích mỗi bên thành các phân tử
    const reactants = parseSide(reactantsStr);
    const reactantsCount = reactants.length;
    const products = parseSide(productsStr);
  
    // Kết hợp tất cả các phân tử (phản ứng được liệt kê trước, sau đó là sản phẩm)
    const molecules = [...reactants, ...products];
  
    // Bước 4: Thu thập các nguyên tố duy nhất từ tất cả các phân tử
    const elementSet = new Set();
    molecules.forEach(mol => {
      Object.keys(mol.elements).forEach(el => elementSet.add(el));
    });
    const elements = Array.from(elementSet);
  
    // Bước 5: Xây dựng ma trận:
    // Mỗi hàng là một nguyên tố, mỗi cột là số đếm của nguyên tố đó trong phân tử.
    // Ở phản ứng: số dương, ở sản phẩm: số âm.
    const matrix = elements.map(el => {
      const row = [];
      reactants.forEach(mol => row.push(mol.elements[el] || 0));
      products.forEach(mol => row.push(- (mol.elements[el] || 0)));
      return row;
    });
  console.log(reactantsCount);
    return { matrix, elements,reactantsCount, molecules: molecules.map(mol => mol.formula) };
  }
  
  // ----- Ví dụ sử dụng -----
  try {
    // Ví dụ phương trình (lưu ý: không được có hệ số)
    const equationString = "Na(NO3)2 + H2 -> NaNO3 + HNO3";
    
    const result = buildMatrix(equationString);
    
    console.log("Ma trận:");
    console.table(result.matrix);
    
    console.log("Các nguyên tố (hàng):", result.elements);
    console.log("Các phân tử (cột):", result.molecules);
    
    /*
      Ví dụ với phương trình "Na(NO3)2+H2O->NaNO3+HNO3":
      
      Các nguyên tố: [ 'Na', 'N', 'O', 'H' ]
      Các phân tử: [ 'Na(NO3)2', 'H2O', 'NaNO3', 'HNO3' ]
      
      Ma trận (phản ứng dương, sản phẩm âm):
         Na   H2O   NaNO3   HNO3
      Na:   1     0      -1      0
      N:    2     0      -1     -1
      O:    6     1      -3     -3
      H:    0     2       0     -1
    */
  } catch (error) {
    console.error("Lỗi:", error.message);
  }

/**
 * Hàm rref: Tính dạng bậc thang giảm (RREF) của một ma trận.
 *
 * @param {number[][]} matrix - Ma trận đầu vào.
 * @param {number} tolerance - Sai số cho phép.
 * @returns {Object} - Đối tượng chứa:
 *    - rref: ma trận RREF.
 *    - pivotColumns: mảng chỉ số các cột là pivot.
 */
function rref(matrix, tolerance = 1e-12) {
    let A = matrix.map(row => row.slice());
    const m = A.length, n = A[0].length;
    const pivotColumns = [];
    let row = 0;
    for (let col = 0; col < n; col++) {
      // Tìm hàng có phần tử khác 0 ở cột col (từ hàng hiện tại trở xuống)
      let pivotRow = -1;
      for (let r = row; r < m; r++) {
        if (Math.abs(A[r][col]) > tolerance) {
          pivotRow = r;
          break;
        }
      }
      if (pivotRow === -1) continue;
      // Hoán đổi hàng hiện tại với pivotRow
      [A[row], A[pivotRow]] = [A[pivotRow], A[row]];
      pivotColumns.push(col);
      // Chuẩn hóa hàng pivot: chia toàn bộ hàng cho giá trị pivot
      const pivotVal = A[row][col];
      for (let c = col; c < n; c++) {
        A[row][c] /= pivotVal;
      }
      // Loại trừ phần tử ở cột col của các hàng khác
      for (let r = 0; r < m; r++) {
        if (r !== row) {
          const factor = A[r][col];
          for (let c = col; c < n; c++) {
            A[r][c] -= factor * A[row][c];
          }
        }
      }
      row++;
      if (row >= m) break;
    }
    return { rref: A, pivotColumns };
  }
  
  /**
   * Hàm nullspaceBasis: Tìm cơ sở của không gian nghiệm (nullspace) của A*x = 0.
   *
   * @param {number[][]} A - Ma trận hệ số (m x n).
   * @param {number} tolerance - Sai số cho phép.
   * @returns {number[][]} - Mảng các vector (mỗi vector có độ dài n) tạo thành cơ sở nullspace.
   */
  function nullspaceBasis(A, tolerance = 1e-12) {
    A.length; const n = A[0].length;
    const { rref: R, pivotColumns } = rref(A, tolerance);
    const freeColumns = [];
    for (let j = 0; j < n; j++) {
      if (!pivotColumns.includes(j)) {
        freeColumns.push(j);
      }
    }
    const basis = [];
    // Với mỗi cột tự do, xây dựng vector cơ sở
    for (let freeCol of freeColumns) {
      const v = Array(n).fill(0);
      v[freeCol] = 1;
      // Với mỗi hàng có pivot, thiết lập v[pivot] = -R[i][freeCol]
      for (let i = 0; i < pivotColumns.length; i++) {
        const p = pivotColumns[i];
        v[p] = -R[i][freeCol];
      }
      basis.push(v);
    }
    return basis;
  }
  
  /**
   * Hàm gcd: Tìm ước số chung lớn nhất của hai số.
   */
  function gcd(a, b) {
    if (!b) return Math.abs(a);
    return gcd(b, a % b);
  }
  
  /**
   * Hàm lcm: Tìm bội chung nhỏ nhất của hai số.
   */
  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }
  
  /**
   * Hàm lcmOfArray: Tìm bội chung nhỏ nhất của một mảng số.
   */
  function lcmOfArray(arr) {
    return arr.reduce((acc, val) => lcm(acc, val), 1);
  }
  
  /**
   * Hàm approximateFraction: Chuyển một số thực thành xấp xỉ phân số {num, den}
   * sử dụng thuật toán phân số liên tục.
   *
   * Ví dụ: approximateFraction(0.5384615, 1e-10) trả về { num: 7, den: 13 }.
   *
   * @param {number} x - Số thực cần chuyển.
   * @param {number} tolerance - Sai số cho phép.
   * @returns {Object} - Đối tượng chứa { num, den }.
   */
  function approximateFraction(x, tolerance = 1e-10) {
    if (x === 0) return { num: 0, den: 1 };
    let sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    
    if (Math.abs(x - Math.round(x)) < tolerance) {
      return { num: sign * Math.round(x), den: 1 };
    }
    
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = x;
    
    while (true) {
      const a = Math.floor(b);
      const h = a * h1 + h2;
      const k = a * k1 + k2;
      const approx = h / k;
      if (Math.abs(approx - x) < tolerance) {
        return { num: sign * h, den: k };
      }
      h2 = h1; h1 = h;
      k2 = k1; k1 = k;
      b = 1 / (b - a);
    }
  }
  
  /**
   * Hàm scaleToIntegerAndNormalize:
   * Chuyển một vector hệ số (các giá trị thực) thành dạng số nguyên tố (primitive integer vector).
   * - Xấp xỉ mỗi hệ số dưới dạng phân số, lấy mẫu số và tính LCM của các mẫu số.
   * - Nhân vector với LCM rồi rút gọn bằng cách chia cho GCD của toàn bộ vector.
   *
   * @param {number[]} coeffs - Vector hệ số.
   * @param {number} tolerance - Sai số cho phép.
   * @returns {number[]} - Vector hệ số dạng nguyên tố.
   */
  function scaleToIntegerAndNormalize(coeffs, tolerance = 1e-10) {
    const denominators = coeffs.map(coef => {
      const fraction = approximateFraction(coef, tolerance);
      return fraction.den;
    });
    
    const commonDenom = lcmOfArray(denominators);
    const scaled = coeffs.map(coef => Math.round(coef * commonDenom));
    const overallGCD = scaled.reduce((acc, val) => gcd(acc, val), scaled[0]);
    return scaled.map(val => val / overallGCD);
  }
/**
 * Hàm ensurePositiveCoeffs:
 * Kiểm tra và điều chỉnh vector nghiệm sao cho tất cả các hệ số đều > 0.
 * Nếu tất cả các hệ số đều dương, trả về vector đó.
 * Nếu tất cả đều âm, nhân với -1 rồi trả về.
 * Nếu hỗn hợp (một số dương, một số âm) thì trả về null.
 *
 * @param {number[]} sol - Vector nghiệm (đã được rút gọn thành dạng số nguyên tố).
 * @returns {number[]|null} - Vector nghiệm với tất cả các hệ số dương hoặc null nếu không thể.
 */
function ensurePositiveCoeffs(sol) {
    const allPositive = sol.every(x => x > 0);
    const allNegative = sol.every(x => x < 0);
    if (allPositive) return sol;
    if (allNegative) return sol.map(x => -x);
    return null;
  }
  
  /**
   * Hàm generateSampleSolutions:
   * Cho một cơ sở của không gian nghiệm (nullspace basis) với chiều d ≥ 1,
   * hàm này sinh ra các nghiệm mẫu dưới dạng tổ hợp tuyến tính của các vector cơ sở,
   * với các tham số được thử từ tập {0,1,2} (loại trừ trường hợp tất cả bằng 0).
   * Chỉ sinh tối đa maxSamples nghiệm có thỏa điều kiện rằng tất cả các hệ số đều dương.
   *
   * @param {number[][]} basis - Mảng các vector cơ sở của nullspace.
   * @param {number} maxSamples - Số mẫu nghiệm tối đa cần sinh.
   * @returns {number[][]} - Mảng các nghiệm mẫu (dạng số nguyên tố) có tất cả các hệ số dương.
   */
  function generateSampleSolutions(basis, maxSamples = 5) {
    const d = basis.length;
    const samples = [];
    // Nếu chỉ có 1 vector cơ sở, chỉ có nghiệm duy nhất (up-to-scaling)
    if (d === 1) {
      const sol = scaleToIntegerAndNormalize(basis[0]);
      const posSol = ensurePositiveCoeffs(sol);
      if (posSol) samples.push(posSol);
      return samples;
    }
    
    // Sinh các tổ hợp tham số cho d chiều từ tập {0,1,2} (loại trừ trường hợp tất cả bằng 0)
    const params = [];
    function generateParams(current, depth) {
      if (depth === d) {
        if (current.some(x => x !== 0)) {
          params.push(current.slice());
        }
        return;
      }
      for (let val of [0, 1, 2]) {
        current.push(val);
        generateParams(current, depth + 1);
        current.pop();
      }
    }
    generateParams([], 0);
    
    // Sắp xếp các tham số theo tổng giá trị tuyệt đối (ưu tiên nghiệm đơn giản)
    params.sort((a, b) => {
      const sumA = a.reduce((acc, v) => acc + Math.abs(v), 0);
      const sumB = b.reduce((acc, v) => acc + Math.abs(v), 0);
      return sumA - sumB;
    });
    
    for (const param of params) {
      const n = basis[0].length;
      const candidate = Array(n).fill(0);
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < n; j++) {
          candidate[j] += param[i] * basis[i][j];
        }
      }
      // Loại trừ nghiệm zero
      if (candidate.every(val => Math.abs(val) < 1e-12)) continue;
      const scaledCandidate = scaleToIntegerAndNormalize(candidate);
      const posCandidate = ensurePositiveCoeffs(scaledCandidate);
      if (!posCandidate) continue;
      // Tránh trùng lặp
      if (!samples.some(sample => 
        sample.length === posCandidate.length && sample.every((v, i) => v === posCandidate[i])
      )) {
        samples.push(posCandidate);
      }
      if (samples.length >= maxSamples) break;
    }
    
    return samples;
  }
  
  /**
   * Hàm getSampleSolutionsForSystem:
   * Cho ma trận A của hệ phương trình homogen A*x = 0,
   * hàm này tính cơ sở không gian nghiệm và sau đó trả về nghiệm duy nhất (nếu nullspace 1 chiều)
   * hoặc một số mẫu nghiệm (nếu không gian nghiệm có chiều > 1) sao cho tất cả các hệ số đều > 0.
   *
   * @param {number[][]} A - Ma trận hệ số (m x n).
   * @param {number} maxSamples - Số mẫu nghiệm tối đa cần xuất.
   * @returns {number[][]} - Mảng các nghiệm (mỗi nghiệm là vector số nguyên tố với các hệ số > 0).
   */
  function getSampleSolutionsForSystem(A, maxSamples = 5) {
    const basis = nullspaceBasis(A);
    if (basis.length === 0) {
      throw new Error("Không tìm thấy nghiệm phi tầm thường.");
    }
    if (basis.length === 1) {
      const sol = scaleToIntegerAndNormalize(basis[0]);
      const posSol = ensurePositiveCoeffs(sol);
      if (posSol) return [posSol];
      else throw new Error("Không tìm thấy nghiệm thỏa điều kiện tất cả các hệ số dương.");
    } else {
      return generateSampleSolutions(basis, maxSamples);
    }
  }
  
  /* --- Ví dụ Sử Dụng --- */
  
  // Giả sử ta có một hệ phương trình cân bằng hóa học với ma trận A (m x n).
  // Các hàng tương ứng với các nguyên tố, các cột với các phân tử:
  // Ví dụ: đối với phương trình "Na(NO3)2 + H2O -> NaNO3 + HNO3"
  // Ta mong muốn tất cả các hệ số (của phản ứng lẫn sản phẩm) đều > 0.
  const A = [
    [ 1,  0,  -1,  0 ],  // Na: các phân tử: Na(NO3)2, H2O, NaNO3, HNO3
    [ 0,  2,  0,  -1 ],  // H
    [ 2,  0,  -1,  -1 ],  // N
    [ 6,  0,  -3,  -3 ]   // O
  ];
  
  try {
    const solutions = getSampleSolutionsForSystem(A, 5);
    console.log("Các nghiệm mẫu (dạng số nguyên tố, với tất cả hệ số > 0):");
    solutions.forEach((sol, idx) => {
      console.log(`Nghiệm ${idx + 1}:`, sol);
    });
  } catch (error) {
    console.error("Lỗi:", error.message);
  }

const ChemicalBalancer = () => {
  const [equation, setEquation] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const handleBalance = () => {
    if (!equation.trim()) {
      setError("Vui lòng nhập phương trình hóa học");
      setResult(null);
      return;
    }
    try {
      const matrix = buildMatrix(equation);
      const coefficients = getSampleSolutionsForSystem(matrix.matrix);
      setResult({ reactantsCount: matrix.reactantsCount, coefficients, molecules: matrix.molecules });
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };
  const handleReset = () => {
    setEquation("");
    setResult(null);
    setError(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-6 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Cân Bằng Phương Trình Hóa Học" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-gray-600", children: "Nhập phương trình hóa học của bạn vào bên dưới để cân bằng" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: equation,
          onChange: (e) => setEquation(e.target.value),
          placeholder: "Ví dụ: H2 + O2 = H2O",
          className: "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-gray-900 placeholder-gray-400"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleBalance,
            className: "flex-1 bg-gray-800 text-white rounded-lg \r\n                       hover:bg-gray-900 focus:outline-none focus:ring-2 \r\n                       focus:ring-gray-800 focus:ring-opacity-50\r\n                       font-medium flex items-center justify-center gap-2 transition duration-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20 }),
              "Cân Bằng"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleReset,
            className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition duration-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20 }),
              "Đặt Lại"
            ]
          }
        )
      ] })
    ] }),
    (result || error) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg p-6 ${error ? "bg-red-50" : "bg-green-50"}`, children: error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600", children: error }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Phương trình đã cân bằng:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm", children: result && result.coefficients.map((coeff, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChemicalEquationDisplay, { coefficients: coeff, reactantCount: result.reactantsCount, molecules: result.molecules }, idx)) })
    ] }) })
  ] }) }) });
};

export { ChemicalBalancer as default };
