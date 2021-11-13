import { VFC } from 'react';

interface IProps {
  player1: string;
  player2: string;
}

const PlayerInfo: VFC<IProps> = ({ player1, player2 }) => (
  <div className="w-full h-full">
    <table className="border-collapse w-full h-full">
      <tbody>
        <tr className="h-1/4">
          <td className="border w-1/2 text-center">{player1}</td>
          <td className="border w-1/2 text-center">{player2}</td>
        </tr>
        <tr>
          <td className="border">
            <div>
              {player1}
            </div>
            <div>
              빈칸
            </div>
          </td>
          <td className="border">
            <div>
              {player2}
            </div>
            <div>
              빈칸
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PlayerInfo;
