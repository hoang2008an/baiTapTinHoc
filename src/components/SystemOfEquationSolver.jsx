import React, { useState } from 'react';
import { Plus, Equal } from 'lucide-react';
import SystemSolver from '../utils/system_of_equation_solver.js';
import "../styles/global.css";

function LinearEquationSystem() {
  const [size, setSize] = useState('3');
  const [coefficients, setCoefficients] = useState(
    Array(3).fill().map(() => Array(3).fill(''))
  );
  const [constants, setConstants] = useState(Array(3).fill(''));
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    const validSize = Math.max(1, Math.min(100, parseInt(newSize) || 1));
    setCoefficients(Array(validSize).fill().map(() => Array(validSize).fill('')));
    setConstants(Array(validSize).fill(''));
  };

  const validateNumber = (value) => {
    if (value === '') return '';
    const normalizedValue = value.replace(',', '.');
    return !isNaN(normalizedValue) ? normalizedValue : '';
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
    setCoefficients(Array(s).fill().map(() => Array(s).fill('')));
    setConstants(Array(s).fill(''));
    setError('');
    setResult(null);
  };

  const handleSubmit = () => {
    setError('');
    const validCoefficients = coefficients.map(row => row.map(val => val === '' ? 0 : parseFloat(val)));
    const validConstants = constants.map(val => val === '' ? 0 : parseFloat(val));
    try {
      setResult(SystemSolver(validCoefficients, validConstants));
    } catch(e) {
      setError(e.message);
    }
  };

  const getVariableName = (index) => {
    const subscript = (index + 1).toString().split('').map(digit => 
      '₀₁₂₃₄₅₆₇₈₉'[parseInt(digit)]
    ).join('');
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full space-y-6">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Hệ phương trình tuyến tính
          </h2>
          
          <div className="flex items-center gap-2">
            <label className="text-gray-600">Kích thước hệ:</label>
            <div className={inputContainerClass}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={size}
                onChange={(e) => handleSizeChange(e.target.value)}
                className={`w-20 px-2 py-1 ${inputBaseClass}`}
              />
            </div>
          </div>

          <div className="space-y-8 w-full">
            {coefficients.map((equation, eqIndex) => (
              <div 
                key={eqIndex} 
                className="flex flex-wrap items-center justify-center gap-y-4 pb-4 border-b border-gray-200"
              >
                {equation.map((coeff, varIndex) => (
                  <div key={varIndex} className="flex items-center">
                    {varIndex > 0 && (
                      <Plus className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
                    )}
                    <div className="flex items-center">
                      <div className={inputContainerClass}>
                        <input
                          type="text"
                          inputMode="decimal"
                          defaultValue={0}
                          value={coeff}
                          onChange={(e) => handleCoefficientChange(eqIndex, varIndex, e.target.value)}
                          className={inputBaseClass}
                          placeholder="0"
                        />
                      </div>
                      <span className="ml-1 text-lg font-medium whitespace-nowrap">
                        {getVariableName(varIndex)}
                      </span>
                    </div>
                  </div>
                ))}
                <Equal className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
                <div className={inputContainerClass}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={constants[eqIndex]}
                    onChange={(e) => handleConstantChange(eqIndex, e.target.value)}
                    className={inputBaseClass}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Đặt lại
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg 
                       hover:bg-gray-900 focus:outline-none focus:ring-2 
                       focus:ring-gray-800 focus:ring-opacity-50
                       transition-all duration-200 ease-in-out hover:shadow-lg"
            >
              Giải
            </button>
          </div>

          {result !== null && (
            <div className="bg-white rounded-xl shadow-lg p-4 mt-4 w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kết quả:</h3>
              {typeof result === 'string' ? (
                <p className="text-gray-700">
                  {result === 'Infinite Solutions'
                    ? 'Vô số nghiệm'
                    : result === 'No Solution'
                      ? 'Vô nghiệm'
                      : result}
                </p>
              ) : Array.isArray(result) ? (
                <ul className="list-disc list-inside text-gray-700">
                  {result.map((val, i) => (
                    <li key={i}>{getVariableName(i)} = {val}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LinearEquationSystem;
