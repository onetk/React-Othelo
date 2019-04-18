import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import ReactDOM from 'react-dom';
import './index.css';
// import { Link } from 'react-scroll';


function Square(props) {
  return (
    <button className="square board-koma-white" onClick={props.onClick}>
      {props.value === null ? <span>{null}</span> :
        (props.value === "●" ? <span className="whiter">{"●"}</span> :
          <span className="blacker">{"●"}</span>)}
    </button >
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
      xIsNext: true,
      display: true
    };
  }

  handleClick(i) {
    // player turn
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // 勝利条件の判定
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (calculatePlayer(squares).length !== 0) {
      // console.log(calculatePlayer(squares));
      squares[i] = this.state.xIsNext ? "●" : "○";
      const squaresChange = calculateTable(squares, i);
      // const changeNum = squaresChange.filter((v, i) => squares[i] !== v).length;

      if (JSON.stringify(squares) === JSON.stringify(squaresChange)) {
        squares[i] = null
      } else {
        //  盤上の計算を行ったものを代入する形
        this.setState({
          history: history.concat([{ squares: squaresChange }]),
          stepNumber: history.length,
          xIsNext: this.state.xIsNext
        });

        // npc turn
        // Playerサイドの打つ手の0かの判定
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        (async () => {
          await sleep(1000);
          this.setState({
            history: history.concat([{ squares: calculateNPC(squaresChange) }]),
          });
        })();

      }
    } else {
      if (calculateNPC(squares) !== squares) {
        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
        (async () => {
          await sleep(1000);
          this.setState({
            history: history.concat([{ squares: calculateNPC(squares) }]),
          });
        })();
      }
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: true
      // xIsNext: (step % 2) === 0
    });
  }

  state = {
    url: '//download.blender.org/durian/trailer/sintel_trailer-480p.mp4',
    playing: true,
    muted: true,
    playbackRate: 1.0,
    loop: false
  }


  onPlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }

  onPause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }
  onProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onEnded = () => {
    console.log('onEnded')
    this.setState({ playing: this.state.loop });
    this.setState({ display: false });
  }
  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration });
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

    const url = (winner === "●") ?
      "https://res.cloudinary.com/onetk/video/upload/v1555556016/youWin.mp4" : "https://res.cloudinary.com/onetk/video/upload/v1555556013/youLose.mp4";
    let status;

    if (winner) {
      status = "Winner: ";
      console.log("video prepare")
      var video =
        <ReactPlayer
          controls
          url={url}
          playing={true}
          loop={false}
          playbackRate={1.0}
          muted={false}
          onReady={() => console.log('onReady')}
          onStart={() => console.log('onStart')}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onBuffer={() => console.log('onBuffer')}
          onSeek={e => console.log('onSeek', e)}
          onEnded={this.onEnded}
          onError={e => console.log('onError', e)}
          onProgress={this.onProgress}
          onDuration={this.onDuration}
        />

    } else {
      status = "Next player: ";
    }

    const squares = current.squares.slice()
    var results = {};
    for (let i = 0; i < squares.length; i++) {
      var koma = squares[i]
      results[koma] = (results[koma] > 0) ? results[koma] + 1 : 1;
    }

    return (
      <section>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={i => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div className="game-status">{status}
              {winner === null ?
                (this.state.xIsNext ?
                  <span className="whiter">{"●"}</span> : <span className="blacker">{"●"}</span>) :
                (winner === "●" ?
                  <span className="whiter">{"●"}</span> : <span className="blacker">{"●"}</span>)}
              <br></br> {results["●"]}-{results["○"]}</div>
            <ol className="game-move">{moves}</ol>
          </div>
        </div>
        {this.state.display ? video : null}
      </section>
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
  console.log(results)
  // oxゲーム
  if (squares.indexOf(null) < 0) {
    var winner_side = (results[koma] === 32) ? ('draw') :
      ((results['●'] > 32) ? '●' : '○');
    console.log(winner_side);
    return winner_side;
  }
  return null;
}

function calculateTable(squaresCalc, thisTime) {

  var table = squaresCalc.slice();

  // left part
  for (var left = 1; left <= thisTime % 8; left++) {
    if (table[thisTime - left] === squaresCalc[thisTime]) {
      for (let i = 1; i < left; i++) {
        table[thisTime - i] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime - left] === null) {
      break;
    }
  }
  //  right part
  for (var right = 1; right <= 7 - (thisTime % 8); right++) {
    if (table[thisTime + right] === squaresCalc[thisTime]) {
      for (let i = 1; i < right; i++) {
        table[thisTime + i] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime + right] === null) {
      break;
    }
  }
  //  upper part
  for (var upper = 1; upper <= thisTime / 8; upper++) {
    if (table[thisTime - upper * 8] === squaresCalc[thisTime]) {
      for (let i = 1; i < upper; i++) {
        table[thisTime - i * 8] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime - upper * 8] === null) {
      break;
    }
  }
  //  downer part
  for (var downer = 1; downer <= 8 - (thisTime / 8); downer++) {
    if (table[thisTime + downer * 8] === squaresCalc[thisTime]) {
      for (let i = 1; i < downer; i++) {
        table[thisTime + i * 8] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime + downer * 8] === null) {
      break;
    }
  }

  //  upper right part
  for (var upperR = 1; upperR <= 7 - (thisTime % 8); upperR++) {
    if (table[thisTime - upperR * 7] === squaresCalc[thisTime]) {
      for (let i = 1; i < upperR; i++) {
        table[thisTime - i * 7] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime - upperR * 7] === null) {
      break;
    }
  }

  //  downer right part
  for (var downerR = 1; downerR <= 7 - (thisTime % 8); downerR++) {
    if (table[thisTime + downerR * 9] === squaresCalc[thisTime]) {
      for (let i = 1; i < downerR; i++) {
        table[thisTime + i * 9] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime + downerR * 9] === null) {
      break;
    }
  }

  //  upper left part
  for (var upperL = 1; upperL <= thisTime % 8; upperL++) {
    if (table[thisTime - upperL * 9] === squaresCalc[thisTime]) {
      for (let i = 1; i < upperL; i++) {
        table[thisTime - i * 9] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime - upperL * 9] === null) {
      break;
    }
  }

  //  downer left part
  for (var downerL = 1; downerL <= thisTime % 8; downerL++) {
    if (table[thisTime + downerL * 7] === squaresCalc[thisTime]) {
      for (let i = 1; i < downerL; i++) {
        table[thisTime + i * 7] = squaresCalc[thisTime];
      }
      break;
    } else if (table[thisTime + downerL * 7] === null) {
      break;
    }
  }

  return table;

}

function calculatePlayer(squares) {
  var squaresPlayerCalc = squares.slice();
  var calcs = Array(64).fill(null)

  squaresPlayerCalc.forEach(function (value, index) {
    if (squaresPlayerCalc[index] == null) {
      squaresPlayerCalc[index] = "●";
      calcs[index] = calculateTable(squaresPlayerCalc, index).filter((v, i) => squaresPlayerCalc[i] !== v).length
      squaresPlayerCalc[index] = null;
    }
  });
  // console.log(calcs);

  var max_list = calcs.reduce((arr, val, i) => (val === Math.max.apply(null, calcs) && arr.push(i), arr), []);
  // console.log(max_list);
  return max_list;
}


function calculateNPC(squaresChange) {
  var tables = squaresChange;
  var calcs = Array(64).fill(null)

  squaresChange.forEach(function (value, index) {
    if (squaresChange[index] == null) {
      squaresChange[index] = "○";
      calcs[index] = calculateTable(squaresChange, index).filter((v, i) => squaresChange[i] !== v).length
      squaresChange[index] = null;

    }
  });
  var max_list = calcs.reduce((arr, val, i) => (val === Math.max.apply(null, calcs) && arr.push(i), arr), []);

  var choise = Math.floor(Math.random() * (max_list.length));

  tables[max_list[choise]] = "○";
  tables = calculateTable(squaresChange, max_list[choise]);
  return tables
}