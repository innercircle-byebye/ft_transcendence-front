const GameScreen = () => {
  // 향후 props 를 통해서 이름을 받아온다.
  const player1 = 'mykang';
  const player2 = 'kycho';
  // 향후 state or websocket 을 통해서 score 를 받아온다.
  const score1 = 0;
  const score2 = 0;

  return (
    <div className="absolute w-full h-full">
      {/* player info bar */}
      <div className="flex justify-evenly items-center bg-gray-600 text-white h-1/12">
        <div>
          {`${player1}`}
        </div>
        <div>
          {`${score1} : ${score2}`}
        </div>
        <div>
          {`${player2}`}
        </div>
      </div>
      <div className="bg-gray-400 h-11/12">
        game screen
      </div>
    </div>
  );
};

export default GameScreen;
