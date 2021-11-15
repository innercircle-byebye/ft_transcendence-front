import { VFC } from 'react';

interface IProps {
  show: boolean;
  onCloseModal: () => void;
}

const GameRuleModal: VFC<IProps> = ({ show, onCloseModal }) => {
  if (!show) { return null; }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <div className="bg-amber-50 p-10 relative">
        <span className="text-2xl">게임 규칙</span>
        <p>
          퐁게임은 게임상의 라켓을 위아래로 조작하여 반대편의 두 번째 라켓을 조작하는 다른 플레이어와 맞붙는 게임입니다.
          점수는 한 플레이어가 상대편에게 공을 돌려주지 못했을시 다른 플레이어가 획득하게 됩니다.
        </p>
        <li>1p, 2p 모두 ready 버튼을 누르면 게임이 시작됩니다.</li>
        <li>기준 점수에 먼저 달성한사람이 새로운 방장(1p)이 됩니다.</li>
        <li>게임중간에 플레이어가 나가면 나간 플레이어는 패배로 처리됩니다.</li>
        <li>게임방에 1p,2p가 모두 있는 상황에서 1p가 방에서 나가면 2p가 새로운 방장(1p)이 됩니다.</li>
        <li>
          게임방에 2p는 없고 1p만 있는 상황에서 1p가 나갔을때,
          관전자가 있으면 관전자중에 가장 위에 있는 사람이 새로운 방장(1p)이 되고 관전자가 없으면 방이 폭파됩니다.
        </li>
        <li>2p 자리가 비어있을때, 관전자들에게 참여하기 버튼이 활성화되고, 관전자중에서 참여하기 버튼을 먼저누른사람이 2p가됩니다.</li>
        <li>게임 옵션은 방장(1p)만 변경할 수 있는데 게임중인 상태에서는 변경불가하고 게임시작전이나 게임이 끝났을때만 변경가능합니다.</li>
        <button type="button" onClick={onCloseModal} className="absolute right-3 top-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GameRuleModal;
