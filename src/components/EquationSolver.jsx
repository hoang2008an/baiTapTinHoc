import React, { useState } from 'react';
import "../styles/global.css";

const EquationSolver = () => {
  const [coefficients, setCoefficients] = useState(Array(5).fill(''));
  const [error, setError] = useState('');
  const [result, setResult] = useState();

  const handleChange = (index, value) => {
    if (value === '' || /^-?\d*[,.]?\d*$/.test(value)) {
      const newCoefficients = [...coefficients];
      newCoefficients[index] = value;
      setCoefficients(newCoefficients);
      setError('');
    }
  };

  const handleReset = () => {
    console.log("reset")
    setCoefficients(Array(5).fill(''));
    setError('');
    setResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericCoefficients = coefficients.map(coeff => {
      const normalizedCoeff = (coeff || '0').replace(',', '.');
      return parseFloat(normalizedCoeff);
    });

    const hasInvalidInput = numericCoefficients.some(val => isNaN(val));

    if (hasInvalidInput) {
      setError('Please enter valid numbers for all coefficients');
      return;
    }

    setResult({
      roots: ['2 + 3i', '2 - 3i', '-1'],
      type: 'Complex and Real Roots'
    });
  };

  // Build the equation from highest degree to constant term,
  // using <sup> for exponents.
  // const renderEquation = () => {
  //   const numericCoefficients = coefficients.map(coeff => {
  //     const normalizedCoeff = (coeff || '0').replace(',', '.');
  //     return parseFloat(normalizedCoeff);
  //   });

  //   const elements = [];
  //   // Loop from highest power (4) down to 0
  //   for (let power = numericCoefficients.length - 1; power >= 0; power--) {
  //     const coeff = numericCoefficients[power];
  //     if (coeff !== 0) {
  //       const termElements = [];
  //       // Add sign: if this isn’t the first term, add " + " or " - "
  //       if (elements.length > 0) {
  //         termElements.push(coeff > 0 ? ' + ' : ' - ');
  //       } else if (coeff < 0) {
  //         termElements.push('-');
  //       }
  //       const absCoeff = Math.abs(coeff);
  //       if (power === 0) {
  //         // Constant term
  //         termElements.push(absCoeff.toString());
  //       } else {
  //         if (absCoeff !== 1) {
  //           termElements.push(absCoeff.toString());
  //         }
  //         termElements.push('x');
  //         if (power > 1) {
  //           termElements.push(
  //             <sup
  //               key={`sup-${power}`}
  //               className="align-top"
  //               style={{ fontSize: '0.75em' }}
  //             >
  //               {power}
  //             </sup>
  //           );
  //         }
  //       }
  //       elements.push(<span key={power}>{termElements}</span>);
  //     }
  //   }
  //   return elements.length > 0 ? elements : '0';
  // };

  return (
    <div className="justify-self-center w-max mx-auto p-6 bg-white/90 rounded-lg shadow-md backdrop-blur-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Polynomial Equation Solver
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6"  >
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {coefficients.map((coeff, index) => (
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
                      <sup
                        className=""
                        style={{ fontSize: '0.75em' }}
                      >
                        {index === 2 ? '2' : index === 3 ? '3' : '4'}
                      </sup>
                      {' +'}
                    </>
                  )}
                </span>
              )}
              {/* Adjusted positioning: now at bottom-0 so it overlaps the container’s border */}
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 
                           scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              />
            </div>
          )).reverse()}
          <div className="font-sans relative group flex items-center">= 0</div>
        </div>

        {error && (
          <div className="text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        {/* Changed font-mono to font-serif for a more math‑like look */}
        {/* <div
          className="text-lg font-serif py-6 px-4 bg-gray-50 rounded-lg shadow-inner
                     border border-gray-200 my-6 text-center overflow-x-auto text-gray-800"
        >
          {renderEquation()} = 0
        </div> */}

       

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg 
                       hover:bg-gray-900 focus:outline-none focus:ring-2 
                       focus:ring-gray-800 focus:ring-opacity-50
                       transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            Solve Equation
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-lg 
                       hover:bg-gray-600 focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-opacity-50
                       transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            Reset
          </button>
        </div>
      </form>
      {result && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Solution</h3>
            <p className="text-gray-700 mb-2">Type: {result.type}</p>
            <div className="space-y-1">
              {result.roots.map((root, index) => (
                <p key={index} className="font-mono">
                  x{index + 1} = {root}
                </p>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default EquationSolver;
