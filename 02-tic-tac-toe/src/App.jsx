import { useState } from "react";
import "./App.css"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinnerFrom, checkEndGame } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";
import { saveGameToStorage, resetGameStorage } from "./logic/storage/index.js";



// Renderizar Square 
function App() { 
  // son inmutables
  // si se modifican produce problemas de renderizado
  // los userstates siempre tienen que estar en el cuerpo del componente, no dentro de un if, loop, etc
  // la iniciacion del estado solo se ejecuta una vez
  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage ? JSON.parse(boardFromStorage):Array(9).fill(null);
  });

  const [turn, setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null)

  const resetGame = ()=>{
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
  };

  // funcion como parametro
  const updateBoard = (index)=>{
    // los datos del nuevo renderizado siempre son nuevos

    // no actualizamos esta posicion 
    // si ya tiene algo
    if(board[index] || winner) return;
   
    // se modifica/actualiza board
    // se hace una copia para evitar problemas
    const newBoard = [... board];
    newBoard[index] = turn;
    setBoard(newBoard);

    // cambia el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    // guardar aqui partida
    saveGameToStorage({
      board:newBoard,
      turn: newTurn
    })

    // Revisar si hay ganador 
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner){
      confetti();
      setWinner(newWinner);  
    } else if(checkEndGame(newBoard)){
      setWinner(false) // Empate
    }
  };

  return (
    // Se renderiza cada cuadrado(square) dentro del tablero
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square, index)=>{
            return(
              <Square
                key={index}
                index={index}
              //la funcion se puede pasar como parametro al componente square
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={ turn===TURNS.X }>
          {TURNS.X}
        </Square>
        <Square isSelected={ turn===TURNS.O }>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}></WinnerModal>

    </main>
  );
}

export default App
