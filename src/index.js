import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { Link } from 'react-scroll';


function Square(props) {
  return (
    <button className="square board-koma" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
      // <Square key={i} value={[i]} onClick={() => this.props.onClick(i)} />
    );
  }
  render() {

    const tableSquare = ([...Array(8).keys()]).map(row => (
      <div className="board-row" key={row}>
        {[...Array(8).keys()].map(col => this.renderSquare(col + row * 8))}
      </div>
    ));

    return (
      <div className="game-table">
        {tableSquare}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var initialTable = Array(64).fill(null)
    initialTable[27] = "○";
    initialTable[28] = "●";
    initialTable[35] = "●";
    initialTable[36] = "○";
    this.state = {
      history: [
        {
          squares: initialTable
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "●" : "○";
    if (JSON.stringify(squares) === JSON.stringify(calculateTable(squares, i))) {
      squares[i] = null
    } else {
      //  盤上の計算を行ったものを代入する形
      this.setState({
        history: history.concat([{ squares: calculateTable(squares, i) }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }



  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button type="button" className="btn btn-outline-light btn-size" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "●" : "○");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <ol className="game-move">{moves}</ol>

          <div style={{ float: "left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}></div>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {

  var results = {};
  for (let i = 0; i < squares.length; i++) {
    var koma = squares[i]
    results[koma] = (results[koma] > 0) ? results[koma] + 1 : 1;
  }
  // console.log('○', "amount", results["○"]);
  // console.log('●', "amount", results["●"]);
  // oxゲーム
  if (squares.indexOf(null) < 0) {
    var winner_side = (results[koma] === 32) ? ('draw') :
      ((results['●'] > 32) ? '●' : '○');
    return winner_side;
  }
  return null;
}

function calculateTable(squares, thisTime) {

  var table = squares;

  // left part
  for (var left = 1; left <= thisTime % 8; left++) {
    if (table[thisTime - left] == squares[thisTime]) {
      for (let i = 1; i < left; i++) {
        table[thisTime - i] = squares[thisTime];
      }
      break;
    } else if (table[thisTime - left] == null) {
      break;
    }
  }
  //  right part
  for (var right = 1; right <= 8 - (thisTime % 8); right++) {
    if (table[thisTime + right] == squares[thisTime]) {
      for (let i = 1; i < right; i++) {
        table[thisTime + i] = squares[thisTime];
      }
      break;
    } else if (table[thisTime + right] == null) {
      break;
    }
  }
  //  upper part
  for (var upper = 1; upper <= thisTime / 8; upper++) {
    if (table[thisTime - upper * 8] == squares[thisTime]) {
      for (let i = 1; i < upper; i++) {
        table[thisTime - i * 8] = squares[thisTime];
      }
      break;
    } else if (table[thisTime - upper * 8] == null) {
      break;
    }
  }
  //  downer part
  for (var downer = 1; downer <= 8 - (thisTime / 8); downer++) {
    if (table[thisTime + downer * 8] == squares[thisTime]) {
      for (let i = 1; i < downer; i++) {
        table[thisTime + i * 8] = squares[thisTime];
      }
      break;
    } else if (table[thisTime + downer * 8] == null) {
      break;
    }
  }

  //  upper right part
  for (var upperR = 1; upperR <= thisTime / 7; upperR++) {
    if (table[thisTime - upperR * 7] == squares[thisTime]) {
      for (let i = 1; i < upperR; i++) {
        table[thisTime - i * 7] = squares[thisTime];
      }
      break;
    } else if (table[thisTime - upperR * 7] == null) {
      break;
    }
  }

  //  upper right part
  for (var upperL = 1; upperL <= 8 - (thisTime / 9); upperL++) {
    if (table[thisTime + upperL * 9] == squares[thisTime]) {
      for (let i = 1; i < upperL; i++) {
        table[thisTime + i * 9] = squares[thisTime];
      }
      break;
    } else if (table[thisTime + upperL * 9] == null) {
      break;
    }
  }

  //  upper left part
  for (var upperL = 1; upperL <= thisTime / 9; upperL++) {
    if (table[thisTime - upperL * 9] == squares[thisTime]) {
      for (let i = 1; i < upperL; i++) {
        table[thisTime - i * 9] = squares[thisTime];
      }
      break;
    } else if (table[thisTime - upperL * 9] == null) {
      break;
    }
  }
  //  downer left part
  for (var upperR = 1; upperR <= 8 - (thisTime / 7); upperR++) {
    if (table[thisTime + upperR * 7] == squares[thisTime]) {
      for (let i = 1; i < upperR; i++) {
        table[thisTime + i * 7] = squares[thisTime];
      }
      break;
    } else if (table[thisTime + upperR * 7] == null) {
      break;
    }
  }


  return table;

}