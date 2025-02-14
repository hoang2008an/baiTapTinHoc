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
  console.log(reactantsCount)
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
export default buildMatrix