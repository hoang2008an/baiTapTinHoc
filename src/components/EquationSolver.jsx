import React, { useState } from 'react';
import "../styles/global.css";
import solve_eqn from '../utils/equation_solver.js';
const EquationSolver = () => {
  // State cho các hệ số của đa thức (mặc định 5 hệ số)
  const [coefficients, setCoefficients] = useState(Array(5).fill(''));
  const [error, setError] = useState('');
  // State cho kết quả dưới dạng object (bao gồm mảng nghiệm và kiểu nghiệm)
  const [result, setResult] = useState();
  // State cho kết quả dạng chuỗi (sẽ tự cập nhật sau)
  const [resultString, setResultString] = useState('');

  // Xử lý thay đổi giá trị hệ số
  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số, dấu phẩy hoặc dấu chấm
    if (value === '' || /^-?\d*[,.]?\d*$/.test(value)) {
      const newCoefficients = [...coefficients];
      newCoefficients[index] = value;
      setCoefficients(newCoefficients);
      setError('');
    }
  };

  // Xử lý đặt lại toàn bộ input và kết quả
  const handleReset = () => {
    console.log("Đặt lại");
    setCoefficients(Array(5).fill(''));
    setError('');
    setResult(null);
    setResultString('');
  };

  // Xử lý khi bấm nút "Giải Phương Trình"
  const handleSubmit = (e) => {
    e.preventDefault();
    const numericCoefficients = coefficients.map(coeff => {
      // Chuẩn hoá giá trị (thay dấu phẩy thành dấu chấm) và chuyển sang số
      const normalizedCoeff = (coeff || '0').replace(',', '.');
      return parseFloat(normalizedCoeff);
    });

    // Kiểm tra nếu có giá trị không hợp lệ
    const hasInvalidInput = numericCoefficients.some(val => isNaN(val));
    if (hasInvalidInput) {
      setError('Vui lòng nhập số hợp lệ cho tất cả các hệ số');
      return;
    }

    // Ở đây bạn có thể gọi hàm giải phương trình đa thức thực tế
    // Ví dụ: const computedResult = solvePolynomial(numericCoefficients);
    // Hiện tại, kết quả mẫu được thiết lập cố định:


    // Cập nhật state cho kết quả dạng chuỗi (có thể thay đổi theo logic của bạn sau)
    setResultString(solve_eqn(numericCoefficients.reverse()));
  };

  return (
    <div
      className="justify-self-center w-max mx-auto p-6 bg-white/90 rounded-lg shadow-md backdrop-blur-sm"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Giải Phương Trình Đa Thức
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {coefficients
            .map((coeff, index) => (
              <div
                key={index}
                className="relative group flex items-end border-b-2 border-gray-300 focus-within:border-gray-800"
              >
                <input
                  type="text"
                  inputMode="decimal"
                  value={coeff}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-24 p-0 bg-transparent outline-none transition-colors text-right font-sans text-xl text-gray-800"
                  placeholder="0"
                />
                {index > 0 && (
                  <span className="ml-1 font-sans text-xl text-gray-800">
                    {index === 1 ? (
                      <>x +</>
                    ) : (
                      <>
                        x
                        <sup style={{ fontSize: '0.75em' }}>
                          {index === 2 ? '2' : index === 3 ? '3' : '4'}
                        </sup>
                        {' +'}
                      </>
                    )}
                  </span>
                )}
                {/* Đường kẻ gạch dưới chuyển màu khi hover */}
                <div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 
                             scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </div>
            ))
            .reverse()}
          <div className="font-sans relative group flex items-center">= 0</div>
        </div>

        {error && (
          <div className="text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg 
                       hover:bg-gray-900 focus:outline-none focus:ring-2 
                       focus:ring-gray-800 focus:ring-opacity-50
                       transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            Giải Phương Trình
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-lg 
                       hover:bg-gray-600 focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-opacity-50
                       transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            Đặt lại
          </button>
        </div>
      </form>

      {/* Hiển thị kết quả dạng object nếu có */}
      {result && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold mb-2">Nghiệm</h3>
          <p className="text-gray-700 mb-2">Loại: {result.type}</p>
          <div className="space-y-1">
            {result.roots.map((root, index) => (
              <p key={index} className="font-mono">
                x{index + 1} = {root}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị kết quả dạng chuỗi nếu có */}
      {resultString && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold mb-2">Kết quả </h3>
          <p className="text-gray-700 font-sans">{resultString}</p>
        </div>
      )}
    </div>
  );
};

export default EquationSolver;
