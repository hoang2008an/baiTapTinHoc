import React, { useState } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import RenderedEquation from './RenderedEquation';
import buildMatrix from '../utils/parse_chemical_equation.js';
import getSampleSolutionsForSystem from '../utils/chemical_equations balancer.js'
const ChemicalBalancer = () => {
  const [equation, setEquation] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  // console.log(result)
  const handleBalance = () => {
    if (!equation.trim()) {
      setError('Vui lòng nhập phương trình hóa học');
      setResult(null);
      return;
    }
    
    try {
      const matrix = buildMatrix(equation);
      const coefficients= getSampleSolutionsForSystem(matrix.matrix);
      setResult({reactantsCount:matrix.reactantsCount,coefficients:coefficients,molecules:matrix.molecules});
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const handleReset = () => {
    setEquation('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          {/* Tiêu đề */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Cân Bằng Phương Trình Hóa Học
            </h1>
            <p className="mt-2 text-gray-600">
              Nhập phương trình hóa học của bạn vào bên dưới để cân bằng
            </p>
          </div>

          {/* Phần nhập liệu */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="Ví dụ: H2 + O2 = H2O"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Các nút */}
            <div className="flex gap-4">
              <button
                onClick={handleBalance}
                className="flex-1 bg-gray-800 text-white rounded-lg 
                       hover:bg-gray-900 focus:outline-none focus:ring-2 
                       focus:ring-gray-800 focus:ring-opacity-50
                       font-medium flex items-center justify-center gap-2 transition duration-200"
              >
                <ArrowRight size={20} />
                Cân Bằng
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition duration-200"
              >
                <RefreshCw size={20} />
                Đặt Lại
              </button>
            </div>
          </div>

          {/* Phần kết quả */}
          {(result || error) && (
            <div className={`rounded-lg p-6 ${error ? 'bg-red-50' : 'bg-green-50'}`}>
              {error ? (
                <div className="text-red-600">
                  {error}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Phương trình đã cân bằng:
                  </h2>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    {result && result.coefficients.map((coeff, idx) => <RenderedEquation key={idx} coefficients={coeff} reactantCount={result.reactantsCount} molecules={result.molecules} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemicalBalancer;