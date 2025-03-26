import React, { useState, useEffect, useRef } from 'react';
import "../styles/global.css"; // Đảm bảo đường dẫn này chính xác

const GomokuGame = () => {
  const boardSize = 8;
  const winLength = 5;
  const maxRetries = 5;
  // --- QUAN TRỌNG: Thay thế bằng API Key của bạn ---
  // --- KHÔNG commit key này lên Git công khai ---
  const GEMINI_API_KEY = "AIzaSyCvSNKbFBHppw0p_Wet3jjz-GkdaGmvNaU"; // <<< THAY THẾ KEY CỦA BẠN VÀO ĐÂY
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=AIzaSyCvSNKbFBHppw0p_Wet3jjz-GkdaGmvNaU";
  // Sử dụng model flash cho tốc độ nhanh hơn, hoặc gemini-1.5-pro-latest cho khả năng mạnh hơn

  // Tạo bàn cờ rỗng.
  const createEmptyBoard = () =>
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));

  // Trạng thái trò chơi.
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(null); // Bắt đầu là null cho đến khi chọn phe
  const [winner, setWinner] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [humanSide, setHumanSide] = useState(null); // 'X' hoặc 'O'
  const [showSideSelection, setShowSideSelection] = useState(false); // Hiển thị khi bật AI và chưa chọn phe
  const [isDraw, setIsDraw] = useState(false); // Trạng thái hòa cờ

  // Ref để lưu AbortController cho yêu cầu AI hiện tại.
  const aiAbortControllerRef = useRef(null);

  // --- Kiểm tra xem nước đi của người chơi tại (row, col) có thắng không.
  const checkWinner = (currentBoard, row, col, player) => {
    const directions = [
      [0, 1],   // ngang
      [1, 0],   // dọc
      [1, 1],   // chéo chính
      [1, -1],  // chéo phụ
    ];
    for (let [dx, dy] of directions) {
      let count = 1;
      // Kiểm tra về phía trước.
      for (let i = 1; i < winLength; i++) {
        const r = row + dx * i;
        const c = col + dy * i;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) {
          count++;
        } else {
          break; // Ngắt nếu không liên tục
        }
      }
      // Kiểm tra về phía sau.
      for (let i = 1; i < winLength; i++) {
        const r = row - dx * i;
        const c = col - dy * i;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && currentBoard[r][c] === player) {
          count++;
        } else {
          break; // Ngắt nếu không liên tục
        }
      }
      if (count >= winLength) return true;
    }
    return false;
  };

  // --- Kiểm tra hòa cờ
  const checkDraw = (currentBoard) => {
    // Hòa khi tất cả các ô đã được đi và không có người thắng
    return currentBoard.every(row => row.every(cell => cell !== null));
  };

  // --- Xử lý khi người dùng nhấp vào ô.
  const handleClick = (row, col) => {
    // Không cho phép đi khi: đã có người thắng, ô đã được đánh, đang chờ AI, chưa chọn phe (ở chế độ AI)
    if (winner || isDraw || board[row][col] || loadingAI || (aiEnabled && !humanSide)) return;
    // Ở chế độ AI, chỉ cho phép di chuyển khi đến lượt người
    if (aiEnabled && humanSide && currentPlayer !== humanSide) return;

    const newBoard = board.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? currentPlayer : cell)) : r
    );
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      return; // Kết thúc lượt nếu thắng
    }

    if (checkDraw(newBoard)) {
        setIsDraw(true);
        return; // Kết thúc lượt nếu hòa
    }

    // Đổi lượt.
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    // Nếu đang chơi với AI và đến lượt AI, gọi AI đi
    if (aiEnabled && humanSide && nextPlayer !== humanSide) {
      // Sử dụng setTimeout nhỏ để đảm bảo state `currentPlayer` cập nhật trước khi gọi AI
      // và cho phép re-render giao diện (hiển thị nước đi của người chơi)
      setTimeout(() => getAIMove(newBoard, nextPlayer), 100);
    }
  };

  // --- Lấy nước đi từ AI với cơ chế thử lại. (ĐÃ ĐƯỢC CẬP NHẬT)
  const getAIMove = async (currentBoard, aiPlayer) => {
    if (!aiEnabled || winner || isDraw) return; // Không gọi AI nếu game đã kết thúc hoặc AI bị tắt
    setLoadingAI(true);

    const yourPiece = aiPlayer;
    const opponentPiece = aiPlayer === 'X' ? 'O' : 'X';

    const boardString = currentBoard
      .map((row) => row.map((cell) => (cell ? cell : '.')).join(' '))
      .join('\n');

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

    // Hủy yêu cầu trước đó nếu có
    if (aiAbortControllerRef.current) {
        aiAbortControllerRef.current.abort();
        console.log("Đã hủy yêu cầu AI trước đó.");
    }
    // Tạo AbortController mới cho yêu cầu này.
    const controller = new AbortController();
    aiAbortControllerRef.current = controller;

    while (attempt < maxRetries && !validMoveFound && aiEnabled) { // Kiểm tra aiEnabled trong vòng lặp
      attempt++;
      console.log(`AI Move Attempt: ${attempt}/${maxRetries}`);

      try {
        console.log("Đang gửi prompt cho AI:", promptText);

        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal, // Gắn signal vào yêu cầu fetch
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            // generationConfig: {
            //   // responseMimeType: "application/json", // Thử bật nếu model hỗ trợ
            //   temperature: 0.6, // Giảm nhiệt độ để AI ít "sáng tạo" và đi nước chắc chắn hơn
            //   maxOutputTokens: 100, // Giới hạn token trả về
            //   // candidateCount: 1 // Chỉ cần 1 ứng viên tốt nhất
            // },
            //  safetySettings: [ // Cấu hình an toàn để tránh bị block oan
            //   { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            //   { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            //   { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            //   { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            // ],
          }
        ),
        });

        if (controller.signal.aborted) {
            console.log("Yêu cầu AI đã bị hủy trước khi nhận phản hồi.");
            // Không cần setLoadingAI(false) ở đây vì useEffect cleanup sẽ xử lý
            return; // Thoát hàm sớm
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Lỗi API:", response.status, response.statusText, errorData);
          // Nếu lỗi do API key hoặc lỗi server thì có thể dừng sớm
          if (response.status === 400 || response.status === 401 || response.status === 403 || response.status >= 500) {
             console.error("Lỗi nghiêm trọng từ API, dừng thử lại.");
             break; // Thoát vòng lặp while
          }
          continue; // Thử lại nếu là lỗi tạm thời
        }

        const data = await response.json();
        console.log("Phản hồi thô từ AI:", JSON.stringify(data));

        // Kiểm tra cấu trúc và lỗi safety ratings
        if (data?.promptFeedback?.blockReason) {
           console.error("Prompt bị chặn:", data.promptFeedback.blockReason, data.promptFeedback.safetyRatings);
           continue; // Thử lại với hy vọng lần sau không bị chặn (hoặc cần điều chỉnh prompt/safetySettings)
        }

        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!outputText) {
          console.error("Không có text trong phản hồi từ AI hoặc cấu trúc không đúng:", data);
          continue;
        }
        console.log("Text nhận được từ AI:", outputText);

        let jsonStr = outputText.replace(/```(json)?/gi, '').replace(/```/g, '').trim();
        console.log("Chuỗi JSON sau khi làm sạch:", jsonStr);

        let parsed;
        try {
          parsed = JSON.parse(jsonStr);
        } catch (jsonError) {
          console.error("Không thể phân tích JSON trực tiếp:", jsonStr, jsonError);
          // Thử tìm JSON trong chuỗi nếu có văn bản thừa
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
              console.log("Đã tìm và phân tích JSON từ chuỗi con:", parsed);
            } catch (nestedJsonError) {
              console.error("Vẫn lỗi khi phân tích JSON tìm được:", jsonMatch[0], nestedJsonError);
              continue;
            }
          } else {
            console.error("Không tìm thấy chuỗi JSON hợp lệ trong phản hồi.");
            continue;
          }
        }

        // Kiểm tra tính hợp lệ của nước đi RẤT QUAN TRỌNG
        if (
          parsed &&
          typeof parsed.row === "number" &&
          typeof parsed.col === "number" &&
          parsed.row >= 0 &&
          parsed.row < boardSize &&
          parsed.col >= 0 &&
          parsed.col < boardSize &&
          !currentBoard[parsed.row][parsed.col] // *** Đảm bảo ô phải trống ***
        ) {
          move = { row: parsed.row, col: parsed.col };
          validMoveFound = true;
          console.log("Nước đi hợp lệ từ AI:", move);
        } else {
          console.error(
            "Nước đi không hợp lệ từ AI:", parsed,
            `Ô [${parsed?.row}, ${parsed?.col}] có giá trị: ${currentBoard[parsed?.row]?.[parsed?.col] ?? 'ngoài bàn cờ'}`
          );
          // Log lại boardString để đối chiếu
          console.log("Trạng thái bàn cờ khi AI nhận được:", boardString);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log("Fetch request cho AI đã bị hủy.");
          // Thoát vòng lặp và hàm nếu request bị hủy
          setLoadingAI(false); // Đảm bảo tắt loading
          return;
        }
        console.error("Lỗi trong quá trình fetch hoặc xử lý phản hồi AI lần thử", attempt, error);
        // Thêm độ trễ nhỏ trước khi thử lại để tránh spam API khi có lỗi mạng tức thời
        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } // Kết thúc vòng lặp while

    // Dọn dẹp AbortController sau khi vòng lặp kết thúc hoặc bị hủy
    aiAbortControllerRef.current = null;

    // Kiểm tra lại aiEnabled sau vòng lặp, phòng trường hợp AI bị tắt trong khi fetch
    if (!aiEnabled) {
        console.log("AI đã bị tắt trong quá trình lấy nước đi.");
        setLoadingAI(false);
        return;
    }

    if (!validMoveFound) {
      console.error("Không nhận được nước đi hợp lệ từ AI sau", maxRetries, "lần thử.");
      // Xử lý khi AI thất bại: có thể cho người chơi đi tiếp, thông báo lỗi, hoặc tự động thua
      // Tạm thời chỉ tắt loading và cho người chơi đi tiếp
      setCurrentPlayer(humanSide); // Trả lượt lại cho người chơi
      setLoadingAI(false);
      alert("AI không thể tìm thấy nước đi hợp lệ. Lượt của bạn."); // Thông báo cho người dùng
      return;
    }

    // Thực hiện nước đi của AI
    const { row, col } = move;
    const newBoard = currentBoard.map((r, i) => // Sử dụng currentBoard thay vì state board cũ
      i === row ? r.map((cell, j) => (j === col ? aiPlayer : cell)) : r
    );
    setBoard(newBoard); // Cập nhật state board chính thức

    if (checkWinner(newBoard, row, col, aiPlayer)) {
      setWinner(aiPlayer);
    } else if (checkDraw(newBoard)) {
      setIsDraw(true);
    } else {
      // Chỉ đổi lượt nếu không có người thắng hoặc hòa
      setCurrentPlayer(humanSide); // Sau khi AI đi, luôn là lượt của người chơi
    }
    setLoadingAI(false);
  };


  // --- Xử lý bật/tắt AI ---
  const handleAIToggle = (checked) => {
    setAiEnabled(checked);
    resetGame(checked); // Gọi reset game khi bật/tắt AI
  };

  // --- Đặt lại trò chơi ---
  const resetGame = (isAiCurrentlyEnabled = aiEnabled) => { // Nhận trạng thái AI hiện tại hoặc mới
    console.log("Resetting game. AI enabled:", isAiCurrentlyEnabled);
    setBoard(createEmptyBoard());
    setWinner(null);
    setIsDraw(false);
    setHumanSide(null); // Luôn reset phe người chơi
    setCurrentPlayer(null); // Reset lượt đi, chờ chọn phe nếu là AI
    setShowSideSelection(isAiCurrentlyEnabled); // Hiển thị chọn phe nếu AI đang bật

    // Hủy yêu cầu AI đang chạy nếu có
    if (aiAbortControllerRef.current) {
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
      console.log("Đã hủy yêu cầu AI khi reset game.");
    }
    setLoadingAI(false); // Đảm bảo tắt loading

    // Nếu không bật AI, mặc định người chơi X đi trước
    if (!isAiCurrentlyEnabled) {
       setCurrentPlayer('X');
       setShowSideSelection(false); // Ẩn chọn phe
       setHumanSide(null); // Không cần humanSide khi không có AI
    }
  };

  // --- Xử lý lựa chọn phe cho một ván mới ở chế độ AI ---
  const chooseSide = (side) => {
    if (!aiEnabled) return; // Chỉ hoạt động khi AI bật
    console.log("Choosing side:", side);
    setHumanSide(side);
    setCurrentPlayer('X'); // Luôn bắt đầu với lượt của X
    setShowSideSelection(false); // Ẩn nút chọn phe

    // Nếu người chơi chọn O, thì AI (đóng vai X) sẽ di chuyển ngay.
    const aiPlayer = side === 'X' ? 'O' : 'X';
    if (side === 'O') {
      // AI đi trước (là X)
      // Dùng setTimeout để đảm bảo state đã cập nhật và giao diện re-render
      setTimeout(() => {
          // Kiểm tra lại các điều kiện trước khi gọi AI
          if (aiEnabled && humanSide === 'O' && currentPlayer === 'X' && !winner && !isDraw) {
             getAIMove(board, 'X'); // Gọi AI đi với bàn cờ hiện tại (rỗng) và phe 'X'
          } else {
             console.warn("Điều kiện không hợp lệ để AI đi trước:", {aiEnabled, humanSide, currentPlayer, winner, isDraw});
          }
      }, 200); // Tăng nhẹ độ trễ để chắc chắn
    }
  };

   // --- Cleanup effect để hủy yêu cầu fetch khi component unmount hoặc AI bị tắt ---
   useEffect(() => {
    // Trả về một hàm cleanup
    return () => {
      if (aiAbortControllerRef.current) {
        console.log("Hủy yêu cầu AI do component unmount hoặc AI tắt.");
        aiAbortControllerRef.current.abort();
        aiAbortControllerRef.current = null;
        // Đảm bảo tắt loading nếu đang loading khi bị hủy
        setLoadingAI(false);
      }
    };
  }, [aiEnabled]); // Chạy lại effect này khi aiEnabled thay đổi


  // --- Render component ---
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
             {/* Hiển thị API Key Warning */}
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

            {/* Chỉ hiển thị chọn phe khi AI bật và chưa chọn */}
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
          <div className="text-center h-10 flex items-center justify-center"> {/* Đảm bảo chiều cao cố định */}
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
                     Sẵn sàng bắt đầu!
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
             style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }} // CSS Grid chuẩn
             >
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleClick(i, j)}
                    className={`aspect-square border border-gray-300 flex items-center justify-center transition-colors duration-150
                      ${cell === 'X' ? 'bg-blue-100 text-blue-700' : cell === 'O' ? 'bg-red-100 text-red-700' : 'bg-white'}
                      ${!cell && !winner && !isDraw && (!aiEnabled || (aiEnabled && currentPlayer === humanSide && !loadingAI)) // Điều kiện cho phép click
                        ? 'cursor-pointer hover:bg-yellow-100' // Hover khi có thể click
                        : 'cursor-default'} // Không cho click
                       text-2xl sm:text-3xl font-bold rounded-sm // Tăng kích thước font và làm tròn nhẹ
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
              onClick={() => resetGame()} // Gọi reset không cần tham số, nó sẽ tự lấy aiEnabled hiện tại
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