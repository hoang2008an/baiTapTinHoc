import React from 'react';

/**
 * Hàm formatMolecule chuyển đổi chuỗi công thức hóa học
 * thành một mảng các React node, trong đó các số được bao
 * bởi thẻ <sub> để hiển thị dạng chỉ số dưới.
 *
 * Ví dụ: "H2O" thành [ "H", <sub>2</sub>, "O" ]
 */
function formatMolecule(formula) {
  // Tách chuỗi công thức theo các số (giữ lại số bằng cách sử dụng nhóm bắt)
  const parts = formula.split(/(\d+)/).filter(part => part !== '');
  return parts.map((part, index) => {
    // Nếu phần là số, hiển thị nó ở dạng chỉ số dưới (<sub>)
    if (/^\d+$/.test(part)) {
      return <sub key={index}>{part}</sub>;
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}

/**
 * Component hiển thị phương trình hóa học
 *
 * Props:
 * - coefficients: Mảng số hệ số của từng phân tử (theo thứ tự).
 * - molecules: Mảng chuỗi công thức của phân tử.
 * - reactantCount: Số phân tử ở bên phản ứng (reactants).
 *
 * Ví dụ:
 *   coefficients = [1, 1, 1, 1]
 *   molecules = ["Na(NO3)2", "H2O", "NaNO3", "HNO3"]
 *   reactantCount = 2
 *
 * Sẽ hiển thị: Na(NO3)2 + H2O → NaNO3 + HNO3
 */
const ChemicalEquationDisplay = ({ coefficients, molecules, reactantCount }) => {
    console.table({ coefficients, molecules, reactantCount })
  // Hàm hiển thị 1 phân tử với hệ số (nếu hệ số khác 1 mới hiển thị)
  const renderMolecule = (coef, formula) => (
    <span style={{ margin: '0 4px' }}>
      {coef !== 1 && <span>{coef}</span>}
      {formatMolecule(formula)}
    </span>
  );
  
  // Tách và hiển thị phản ứng (reactants)
  const reactants = molecules.slice(0, reactantCount).map((formula, index) => (
    <React.Fragment key={index}>
      {renderMolecule(coefficients[index], formula)}
      {index < reactantCount - 1 && <span> + </span>}
    </React.Fragment>
  ));
  
  // Tách và hiển thị sản phẩm (products)
  const products = molecules.slice(reactantCount).map((formula, index) => (
    <React.Fragment key={index}>
      {renderMolecule(coefficients[reactantCount + index], formula)}
      {index < molecules.slice(reactantCount).length - 1 && <span> + </span>}
    </React.Fragment>
  ));
  
  return (
    <div
      style={{
        fontFamily: '"Times New Roman", serif',
        fontSize: '1.5em',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {reactants}
      <span style={{ margin: '0 8px' }}>→</span>
      {products}
    </div>
  );
};

export default ChemicalEquationDisplay;
