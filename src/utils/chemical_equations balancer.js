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
    const m = A.length, n = A[0].length;
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
export default getSampleSolutionsForSystem;  