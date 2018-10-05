import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {



    render() {
      return (
         <button className="square" onClick={this.props.onClick} style={ {color:this.props.highlight? 'red':'black'}}>
              {this.props.value}
          </button> 
      );
    }
 }

  //Example of a functional component
 /* function Square(props){
      return (
          <button className="square" onClick={props.onClick} style={ {color:props.highlight? 'red':'black'}}>
              {props.value}
          </button> 
      )
  }*/
  

  class Board extends React.Component {

    //Static var
    BOARD_SIZE = 3;

    renderSquare(i, highlight) {
      return (
        <Square
            key={i}
            value={ this.props.squares[i] } 
            onClick={ () => this.props.onClick(i)}
            highlight={highlight}
        />
      );
    }
  
    render() {
  
      let squares = [];
      for(let i = 0 ; i  < this.BOARD_SIZE; i++){
        let line = [];
        for(let j = 0; j < this.BOARD_SIZE; j++){
          let index = i * this.BOARD_SIZE +  j;
          let highlight =this.props.winners && this.props.winners.indexOf(index)>= 0;
          line.push(this.renderSquare(index, highlight));
        }
        squares.push( <div className="board-row" key={i}>{line}</div> );
      }
      return squares;
    }
  }

  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            ascending: true
        }
    }


    toogleAscendingOrder(){
      let reversedHistory = this.state.history.reverse();
      this.setState({
        history: reversedHistory,
        ascending: !this.state.ascending,
        xIsNext: true
      });
    }

    jumpTo(step){
        this.setState({
            //history: this.state.history.slice(0, step + 1),
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            stepSelected: step
        })
    }
    
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //veify if there is a winner before changing state values
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: parseInt(i / 3)  + 1 ,
                row: (i % 3) + 1,
                step: history.length
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        
        const moves = history.map( (step, move) => {
            
            const desc =  ( (this.state.ascending && move === 0) || (!this.state.ascending && move === history.length -1 )) 
              ? 'Go to game start' : 'Go to move # ' + step.step  + ' - Row: ' + step.col + ', col: ' + step.row;
            return (
                <li key={move} >
                    <button
                      onClick={() => this.jumpTo(move)}
                      style={ (this.state.stepNumber === move) ? { color: 'red'} :{} } >{desc}</button>
                </li> 
            );
        });
        let status;
        if (winner) {
          status = 'Winner: ' + (!this.state.xIsNext ? 'X' : 'O');
        } else if(!winner && itsFilled(current.squares)) {
          status = "It's a Draw";
        }else{
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


      return (
        <div>
          <Clock></Clock>
          <div className="game">

            <div className="game-board">

              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winners={winner}
              />
            </div>
            <div className="game-info">
              <div> {status} </div>
              <ol> {moves} </ol>
            </div>


            <div> <button onClick={() => this.toogleAscendingOrder()}> Toogle order</button></div>
          </div>
        </div>
        
         
            
         
      );
    }
  }
  
  // ========================================
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }

  function itsFilled(squares){
    for(let i = 0; i < squares.length; i++){
      if(squares[i]  == null){
        return false;
      }
    }
    return true;
  }



//----------------------------------



class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);

  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}



  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  