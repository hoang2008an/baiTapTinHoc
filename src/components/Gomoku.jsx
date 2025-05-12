import React, { useState, useEffect, useRef } from 'react';
import "../styles/global.css"; // Đảm bảo đường dẫn này chính xác

const GomokuGame = () => {
  const boardSize = 8;
  const winLength = 5;
  const maxRetries = 5;
  // --- QUAN TRỌNG: Thay thế bằng API Key của bạn ---
  const GEMINI_API_KEY = "AIzaSyCvSNKbFBHppw0p_Wet3jjz-GkdaGmvNaU"; // <<< THAY THẾ KEY CỦA BẠN VÀO ĐÂY
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=AIzaSyCvSNKbFBHppw0p_Wet3jjz-GkdaGmvNaU";

  const createEmptyBoard = () =>
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [humanSide, setHumanSide] = useState(null);
  const [showSideSelection, setShowSideSelection] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

  const aiAbortControllerRef = useRef(null);

  const checkWinner = (currentBoard, row, col, player) => {
    const directions = [ [0, 1], [1, 0], [1, 1], [1, -1] ];
    for (let [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < winLength; i++) {
        const r = row + dx * i; const c = col + dy * i;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) count++; else break;
      }
      for (let i = 1; i < winLength; i++) {
        const r = row - dx * i; const c = col - dy * i;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) count++; else break;
      }
      if (count >= winLength) return true;
    }
    return false;
  };

  const checkDraw = (currentBoard) => {
    return currentBoard.every(row => row.every(cell => cell !== null));
  };

  const handleClick = (row, col) => {
    if (winner || isDraw || board[row][col] || loadingAI || (aiEnabled && !humanSide)) return;
    if (aiEnabled && humanSide && currentPlayer !== humanSide) return; // Chỉ người chơi mới được click khi đến lượt

    const newBoard = board.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? currentPlayer : cell)) : r
    );
    setBoard(newBoard); // Cập nhật bàn cờ ngay

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }

    if (checkDraw(newBoard)) {
        setIsDraw(true);
        return;
    }

    // Đổi lượt ngay sau khi người chơi đi (trước khi gọi AI)
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // Không gọi AI trực tiếp từ đây nữa, useEffect sẽ xử lý
  };

  const getAIMove = async (currentBoard, aiPlayer) => {
     // Guard đầu tiên: Nếu AI bị tắt thì không làm gì cả
    if (!aiEnabled) {
        console.log("getAIMove called but AI is disabled.");
        setLoadingAI(false); // Đảm bảo tắt loading nếu lỡ bật
        return;
    }
    // Chỉ bắt đầu loading nếu AI thực sự được bật
    setLoadingAI(true);

    const yourPiece = aiPlayer;
    const opponentPiece = aiPlayer === 'X' ? 'O' : 'X';
    const boardString = currentBoard.map(row => row.map(cell => cell ? cell : '.').join(' ')).join('\n');
    const promptText = `Bạn là một AI chơi Gomoku (Cờ Caro) trên bàn cờ ${boardSize}x${boardSize}. Mục tiêu là đạt được ${winLength} quân cờ liên tiếp (ngang, dọc, hoặc chéo).
Bàn cờ hiện tại được biểu diễn dưới đây, trong đó:
- '.' đại diện cho ô trống.
- '${yourPiece}' đại diện cho quân cờ CỦA BẠN.
- '${opponentPiece}' đại diện cho quân cờ của ĐỐI THỦ.

Đến lượt bạn đi (${yourPiece}).

Hãy phân tích trạng thái bàn cờ sau:
${boardString}

Nhiệm vụ của bạn là xác định nước đi TỐT NHẤT TIẾP THEO cho ${yourPiece}. Hãy cân nhắc các yếu tố sau:
1.  Có nước đi nào giúp bạn (${yourPiece}) thắng ngay lập tức không?
2.  Có nước đi nào của đối thủ (${opponentPiece}) cần phải chặn ngay lập tức không (ví dụ: họ có ${winLength - 1} quân liên tiếp)?
3.  Nếu không có các trường hợp trên, hãy chọn nước đi giúp bạn tạo ra lợi thế tấn công (ví dụ: tạo chuỗi 3 hoặc 4 quân mở) hoặc phòng thủ chiến lược.

Chỉ trả về nước đi của bạn dưới dạng một đối tượng JSON duy nhất có cấu trúc:
{
  "row": <số hàng (từ 0 đến ${boardSize - 1})>,
  "col": <số cột (từ 0 đến ${boardSize - 1})>
}
Ví dụ: {"row": 3, "col": 4}

KHÔNG thêm bất kỳ giải thích, lời chào, hay văn bản nào khác ngoài đối tượng JSON được yêu cầu. Đảm bảo tọa độ trả về nằm trong phạm vi bàn cờ và ô đó phải trống (là '.').`;

    let attempt = 0;
    let validMoveFound = false;
    let move = null;

    if (aiAbortControllerRef.current) {
        aiAbortControllerRef.current.abort(); // Hủy cái cũ nếu có
    }
    const controller = new AbortController();
    aiAbortControllerRef.current = controller;

    try { // Bọc toàn bộ vòng lặp trong try...finally để đảm bảo cleanup
        while (attempt < maxRetries && !validMoveFound) {
            // Guard trong vòng lặp: Kiểm tra AI có còn bật không trước mỗi lần thử
            if (!aiEnabled || controller.signal.aborted) {
                 console.log("AI disabled or request aborted during retry loop.");
                 // Không cần set loading false ở đây vì finally sẽ làm
                 return;
            }
            attempt++;
            console.log(`AI Move Attempt: ${attempt}/${maxRetries}`);

            try {
                console.log("Đang gửi prompt cho AI:", promptText);
                const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                    })
                });

                // -------- Guard quan trọng sau await fetch --------
                if (!aiEnabled || controller.signal.aborted) {
                    console.log("AI disabled or request aborted after fetch response.");
                    // Không cần set loading false ở đây vì finally sẽ làm
                    return;
                }
                // --------------------------------------------------

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Lỗi API:", response.status, response.statusText, errorData);
                    if (response.status === 400 || response.status === 401 || response.status === 403 || response.status >= 500) {
                        break;
                    }
                    continue;
                }

                const data = await response.json();
                 // -------- Guard sau await response.json() --------
                 if (!aiEnabled || controller.signal.aborted) {
                    console.log("AI disabled or request aborted after parsing JSON.");
                    return;
                }
                // --------------------------------------------------
                console.log("Phản hồi thô từ AI:", JSON.stringify(data));

                if (data?.promptFeedback?.blockReason) {
                    console.error("Prompt bị chặn:", data.promptFeedback.blockReason);
                    continue;
                }
                const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                 if (!outputText) {
                    console.error("Không có text trong phản hồi:", data);
                    continue;
                 }
                console.log("Text nhận được:", outputText);

                let jsonStr = outputText.replace(/```(json)?/gi, '').replace(/```/g, '').trim();
                let parsed;
                try {
                    parsed = JSON.parse(jsonStr);
                } catch (jsonError) {
                    console.error("Lỗi parse JSON:", jsonStr, jsonError);
                    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        try { parsed = JSON.parse(jsonMatch[0]); } catch (e) { continue; }
                    } else { continue; }
                }

                if ( parsed && typeof parsed.row === "number" && typeof parsed.col === "number" &&
                     parsed.row >= 0 && parsed.row < boardSize && parsed.col >= 0 && parsed.col < boardSize &&
                     !currentBoard[parsed.row][parsed.col] )
                {
                    move = { row: parsed.row, col: parsed.col };
                    validMoveFound = true;
                    console.log("Nước đi hợp lệ từ AI:", move);
                } else {
                    console.error("Nước đi không hợp lệ:", parsed, `Ô có giá trị: ${currentBoard[parsed?.row]?.[parsed?.col] ?? 'ngoài bàn cờ'}`);
                    console.log("Board khi AI nhận:", boardString);
                }

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log("Fetch request cho AI đã bị hủy.");
                    return; // Thoát khỏi hàm, finally sẽ xử lý loading
                }
                console.error("Lỗi fetch/xử lý AI lần", attempt, error);
                if (attempt < maxRetries) {
                    // Guard trước khi đợi:
                    if (!aiEnabled || controller.signal.aborted) return;
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } // Kết thúc while

        // -------- Guard cuối cùng trước khi cập nhật state --------
        if (!aiEnabled) {
            console.log("AI disabled before applying move.");
            return; // Finally sẽ tắt loading
        }
        // -------------------------------------------------------

        if (validMoveFound) {
            const { row, col } = move;
            // Tạo newBoard dựa trên currentBoard được truyền vào, không phải state board cũ
            const newBoardAfterAIMove = currentBoard.map((r, i) =>
                i === row ? r.map((cell, j) => (j === col ? aiPlayer : cell)) : r
            );
            setBoard(newBoardAfterAIMove); // Cập nhật state board chính thức

            if (checkWinner(newBoardAfterAIMove, row, col, aiPlayer)) {
                setWinner(aiPlayer);
            } else if (checkDraw(newBoardAfterAIMove)) {
                setIsDraw(true);
            } else {
                // Chỉ đổi lượt nếu không thắng/hòa
                setCurrentPlayer(humanSide); // Sau khi AI đi, luôn là lượt của người
            }
        } else {
            console.error("Không nhận được nước đi hợp lệ từ AI sau", maxRetries, "lần thử.");
            // Trả lượt lại cho người nếu AI bó tay
             if (aiEnabled) { // Kiểm tra lại lần nữa cho chắc
                setCurrentPlayer(humanSide);
                alert("AI không thể tìm thấy nước đi hợp lệ. Lượt của bạn.");
             }
        }
    } finally {
        // Đảm bảo controller được dọn dẹp và loading tắt đi
        if (aiAbortControllerRef.current === controller) { // Chỉ clear ref nếu nó vẫn là controller của lần gọi này
             aiAbortControllerRef.current = null;
        }
        setLoadingAI(false);
        console.log("AI execution finished or aborted. Loading set to false.");
    }
  };

  // --- Toggle AI: Abort ngay khi tắt ---
  const handleAIToggle = (checked) => {
    if (!checked && aiAbortControllerRef.current) {
      console.log("Tắt AI, hủy yêu cầu AI đang chạy...");
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
      setLoadingAI(false); // Đảm bảo tắt loading ngay lập tức
    }
    setAiEnabled(checked);
    resetGame(checked); // Reset game với trạng thái AI mới
  };

  const resetGame = (isAiCurrentlyEnabled) => {
    console.log("Resetting game. AI enabled:", isAiCurrentlyEnabled);

    // Hủy yêu cầu AI đang chạy (nếu có) khi reset
    if (aiAbortControllerRef.current) {
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
    }
    setLoadingAI(false); // Luôn tắt loading khi reset

    setBoard(createEmptyBoard());
    setWinner(null);
    setIsDraw(false);
    setHumanSide(null);
    setCurrentPlayer(null);
    setShowSideSelection(isAiCurrentlyEnabled);

    if (!isAiCurrentlyEnabled) {
       setCurrentPlayer('X'); // Người chơi X đi trước khi không có AI
    }
  };

  const chooseSide = (side) => {
    if (!aiEnabled) return;
    console.log("Choosing side:", side);
    setHumanSide(side);
    setCurrentPlayer('X'); // Luôn bắt đầu với lượt của X
    setShowSideSelection(false);
    // Không gọi AI từ đây, useEffect sẽ xử lý
  };

  // --- useEffect để gọi AI khi đến lượt ---
  useEffect(() => {
    // Điều kiện để AI đi: AI đang bật, đã chọn phe, đến lượt AI, game chưa kết thúc
    const isAITurn = aiEnabled && humanSide && currentPlayer && currentPlayer !== humanSide && !winner && !isDraw;

    if (isAITurn) {
      console.log(`useEffect triggered: AI's turn (Player ${currentPlayer})`);
      // Gọi AI với board hiện tại và quân cờ của AI (currentPlayer)
      // Sử dụng một bản sao của board để tránh stale state tiềm ẩn nếu getAIMove mất nhiều thời gian
      const boardSnapshot = board.map(row => [...row]);
      getAIMove(boardSnapshot, currentPlayer);
    }
  }, [aiEnabled, humanSide, currentPlayer, winner, isDraw, board]); // Phụ thuộc vào các state này

   // --- useEffect Cleanup cho unmount ---
   useEffect(() => {
    return () => {
      if (aiAbortControllerRef.current) {
        console.log("Hủy yêu cầu AI do component unmount.");
        aiAbortControllerRef.current.abort();
        aiAbortControllerRef.current = null;
        // Không cần setLoadingAI(false) ở đây vì component sắp unmount
      }
    };
  }, []); // Chỉ chạy khi unmount

  // --- Render component (Không thay đổi) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
          {/* Tiêu đề */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Gomoku AI
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Bàn cờ {boardSize}x{boardSize}, cần {winLength} quân liên tiếp để thắng.
              Thử sức với Gemini AI!
            </p>
             {GEMINI_API_KEY === "YOUR_GEMINI_API_KEY" && aiEnabled && (
               <p className="mt-2 text-sm text-red-600 font-semibold">
                 ⚠️ Vui lòng thay thế "YOUR_GEMINI_API_KEY" bằng API Key của bạn trong code để AI hoạt động!
               </p>
             )}
          </div>

          {/* Bật/Tắt AI và lựa chọn phe */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => handleAIToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-md font-medium text-gray-900">
                Chơi với AI
              </span>
            </label>

            {aiEnabled && showSideSelection && (
              <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0">
                 <span className="text-gray-700 font-medium mb-2 sm:mb-0 sm:mr-3">Bạn muốn chơi quân:</span>
                <button
                  onClick={() => chooseSide('X')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  X (Đi trước)
                </button>
                <button
                  onClick={() => chooseSide('O')}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  O (Đi sau)
                </button>
              </div>
            )}
          </div>

          {/* Trạng thái trò chơi */}
          <div className="text-center h-10 flex items-center justify-center">
            {winner ? (
              <strong className={`text-2xl font-bold ${winner === 'X' ? 'text-blue-700' : 'text-red-700'}`}>
                🎉 Người chiến thắng: {winner} {aiEnabled && humanSide && winner !== humanSide ? "(Máy)" : ""} 🎉
              </strong>
            ) : isDraw ? (
               <strong className="text-2xl font-bold text-gray-700">
                 🤝 Hòa cờ! 🤝
               </strong>
            ): currentPlayer ? (
              <span className="text-xl text-gray-800">
                Lượt của:{' '}
                <strong className={`font-bold ${currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                   {currentPlayer}
                </strong>
                {aiEnabled && humanSide && (
                    <span className="text-gray-600 ml-1">
                        {currentPlayer === humanSide ? "(Bạn)" : "(Máy)"}
                    </span>
                )}
              </span>
            ) : (
               aiEnabled && showSideSelection ? (
                  <span className="text-lg text-gray-600 animate-pulse">
                     Vui lòng chọn phe của bạn...
                  </span>
               ) : (
                 <span className="text-lg text-gray-600">
                     {!aiEnabled ? 'X đi trước' : 'Sẵn sàng bắt đầu!'}
                 </span>
               )
            )}
            {loadingAI && (
              <span className="ml-3 inline-flex items-center text-gray-500">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Máy đang suy nghĩ...
              </span>
            )}
          </div>

          {/* Bàn cờ */}
          <div className={`flex justify-center transition-opacity duration-300 ${loadingAI ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div
             className="grid gap-0.5 bg-gray-400 p-1 rounded shadow-md w-full max-w-md md:max-w-lg"
             style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
             >
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleClick(i, j)}
                    className={`aspect-square border border-gray-300 flex items-center justify-center transition-colors duration-150
                      ${cell === 'X' ? 'bg-blue-100 text-blue-700' : cell === 'O' ? 'bg-red-100 text-red-700' : 'bg-white'}
                      ${!cell && !winner && !isDraw && (!aiEnabled || (aiEnabled && currentPlayer === humanSide && !loadingAI))
                        ? 'cursor-pointer hover:bg-yellow-100'
                        : 'cursor-default'}
                       text-2xl sm:text-3xl font-bold rounded-sm
                      `}
                    aria-label={`Ô ${i}, ${j}: ${cell || 'Trống'}`}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nút Đặt lại */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => resetGame(aiEnabled)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GomokuGame;