import { j as jsxRuntimeExports } from './jsx-runtime.XI9uIe3W.js';
import { r as reactExports } from './index.B2C10fzS.js';
/* empty css                        */

const GomokuGame = () => {
  const boardSize = 8;
  const winLength = 5;
  const maxRetries = 5;
  const createEmptyBoard = () => Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  const [board, setBoard] = reactExports.useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = reactExports.useState("X");
  const [winner, setWinner] = reactExports.useState(null);
  const [aiEnabled, setAiEnabled] = reactExports.useState(false);
  const [loadingAI, setLoadingAI] = reactExports.useState(false);
  const [humanSide, setHumanSide] = reactExports.useState(null);
  const [showSideSelection, setShowSideSelection] = reactExports.useState(false);
  const aiAbortControllerRef = reactExports.useRef(null);
  const checkWinner = (board2, row, col, player) => {
    const directions = [
      [0, 1],
      // ngang
      [1, 0],
      // dọc
      [1, 1],
      // chéo chính
      [1, -1]
      // chéo phụ
    ];
    for (let [dx, dy] of directions) {
      let count = 1;
      let r = row + dx, c = col + dy;
      while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board2[r][c] === player) {
        count++;
        r += dx;
        c += dy;
      }
      r = row - dx;
      c = col - dy;
      while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board2[r][c] === player) {
        count++;
        r -= dx;
        c -= dy;
      }
      if (count >= winLength) return true;
    }
    return false;
  };
  const handleClick = (row, col) => {
    if (winner || board[row][col]) return;
    if (aiEnabled && humanSide && currentPlayer !== humanSide) return;
    if (currentPlayer === null) return;
    const newBoard = board.map(
      (r, i) => i === row ? r.map((cell, j) => j === col ? currentPlayer : cell) : r
    );
    setBoard(newBoard);
    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }
    if (aiEnabled && humanSide) {
      const next = currentPlayer === humanSide ? humanSide === "X" ? "O" : "X" : humanSide;
      setCurrentPlayer(next);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };
  const getAIMove = async () => {
    if (!aiEnabled) return;
    setLoadingAI(true);
    const aiSide = humanSide ? humanSide === "X" ? "O" : "X" : "O";
    const boardString = board.map((row2) => row2.map((cell) => cell ? cell : ".").join(" ")).join("\n");
    const promptText = `Bạn đang chơi Gomoku trên bàn cờ 8x8. Bàn cờ được biểu diễn dưới dạng chuỗi nhiều dòng, trong đó mỗi dòng đại diện cho một hàng và mỗi ký tự là một trong các: '.' cho ô trống, 'X' cho quân của bạn, và 'O' cho quân đối thủ. Điều kiện thắng là có 5 quân liên tiếp (ngang, dọc hoặc chéo). Đến lượt bạn, và bạn đang chơi với phe ${aiSide}. Hãy phân tích bàn cờ để xác định nước đi tốt nhất cho ${aiSide} — cho dù đó là để giành chiến thắng ngay lập tức, chặn đường đối thủ, hay tạo lợi thế. Trả về nước đi của bạn dưới dạng đối tượng JSON với hai trường số: "row" và "col" (cả hai đều tính từ 0). Không bao gồm văn bản bổ sung nào.
Trạng thái bàn cờ:
${boardString}`;
    let attempt = 0;
    let validMoveFound = false;
    let move = null;
    while (attempt < maxRetries && !validMoveFound && aiEnabled) {
      attempt++;
      try {
        const controller = new AbortController();
        aiAbortControllerRef.current = controller;
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=AIzaSyCvSNKbFBHppw0p_Wet3jjz-GkdaGmvNaU",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }]
            })
          }
        );
        const data = await response.json();
        const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!outputText) {
          console.error("Không có phản hồi từ AI trong lần thử", attempt);
          continue;
        }
        let jsonStr = outputText.replace(/```(json)?/gi, "").replace(/```/g, "").trim();
        let parsed;
        try {
          parsed = JSON.parse(jsonStr);
        } catch (jsonError) {
          console.error("Không thể phân tích JSON từ phản hồi AI:", jsonStr);
          continue;
        }
        if (typeof parsed.row === "number" && typeof parsed.col === "number" && parsed.row >= 0 && parsed.row < boardSize && parsed.col >= 0 && parsed.col < boardSize && !board[parsed.row][parsed.col]) {
          move = { row: parsed.row, col: parsed.col };
          validMoveFound = true;
        } else {
          console.error("Nước đi không hợp lệ từ AI:", parsed);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Yêu cầu nước đi từ AI đã bị hủy.");
          setLoadingAI(false);
          return;
        }
        console.error("Lỗi khi lấy nước đi từ AI trong lần thử", attempt, error);
      }
    }
    if (!aiEnabled) {
      setLoadingAI(false);
      return;
    }
    if (!validMoveFound) {
      console.error("Không nhận được nước đi hợp lệ từ AI sau", maxRetries, "lần thử.");
      setLoadingAI(false);
      return;
    }
    const { row, col } = move;
    const newBoard = board.map(
      (r, i) => i === row ? r.map((cell, j) => j === col ? aiSide : cell) : r
    );
    setBoard(newBoard);
    if (checkWinner(newBoard, row, col, aiSide)) {
      setWinner(aiSide);
    } else {
      if (aiEnabled && humanSide) {
        setCurrentPlayer(humanSide);
      } else {
        setCurrentPlayer(aiSide === "X" ? "O" : "X");
      }
    }
    setLoadingAI(false);
  };
  reactExports.useEffect(() => {
    if (aiEnabled && humanSide && currentPlayer && currentPlayer !== humanSide && !winner && !loadingAI) {
      getAIMove();
    }
  }, [aiEnabled, humanSide, currentPlayer, winner, loadingAI]);
  reactExports.useEffect(() => {
    if (!aiEnabled && aiAbortControllerRef.current) {
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
      setLoadingAI(false);
    }
  }, [aiEnabled]);
  const handleAIToggle = (checked) => {
    setAiEnabled(checked);
    setHumanSide((prev) => prev ? prev === "X" ? "O" : "X" : "X");
  };
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    if (aiEnabled) {
      setHumanSide(null);
      setCurrentPlayer(null);
      setShowSideSelection(true);
    } else {
      setCurrentPlayer("X");
    }
  };
  const chooseSide = (side) => {
    setHumanSide(side);
    setCurrentPlayer("X");
    setShowSideSelection(false);
    if (side === "O") {
      setTimeout(() => {
        if (!winner && currentPlayer === "X") {
          getAIMove();
        }
      }, 100);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-6 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gomoku" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-gray-600", children: "Bàn cờ 8x8, cần 5 quân liên tiếp để thắng. Bật chế độ AI để chơi với máy." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: aiEnabled,
            onChange: (e) => handleAIToggle(e.target.checked),
            className: "sr-only peer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-gray-700", children: "Bật AI" })
      ] }),
      showSideSelection && aiEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => chooseSide("X"),
            className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
            children: "Chơi với X"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => chooseSide("O"),
            className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
            children: "Chơi với O"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      winner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-2xl text-green-700", children: [
        "Người chiến thắng: ",
        winner
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-gray-800", children: currentPlayer ? `Lượt hiện tại: ${currentPlayer} ${aiEnabled && humanSide ? currentPlayer === humanSide ? "(Người)" : "(Máy)" : ""}` : "Đang chờ lựa chọn phe..." }),
      loadingAI && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-gray-500", children: "(Máy đang tính...)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-8 gap-1 w-96", children: board.map(
      (row, i) => row.map((cell, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: () => handleClick(i, j),
          className: `w-10 h-10 border border-gray-300 flex items-center justify-center rounded ${cell ? "bg-gray-200" : "bg-white"} ${!cell && !winner && (!aiEnabled || aiEnabled && currentPlayer === humanSide) ? "cursor-pointer hover:bg-gray-100" : "cursor-default"}`,
          children: cell
        },
        `${i}-${j}`
      ))
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: resetGame,
        className: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition duration-200",
        children: "Đặt lại trò chơi"
      }
    ) })
  ] }) }) });
};

export { GomokuGame as default };
