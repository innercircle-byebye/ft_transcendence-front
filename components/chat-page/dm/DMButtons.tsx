import { useRouter } from 'next/router';
import { useCallback, useState, VFC } from 'react';
import DMMemberModal from './DMMemberModal';

const DMButtons: VFC = () => {
  const router = useRouter();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const onClickMemberIcon = useCallback(() => {
    setShowMemberModal((prev) => !prev);
  }, []);

  const onClickExit = useCallback(() => {
    router.push('/chat');
  }, [router]);

  return (
    <>
      <div className="absolute right-16 flex flex-row">
        <button type="button" className={`hover:bg-sky-700 hover:text-white p-1 ${showMemberModal ? 'bg-sky-700 text-white' : ''}`} onClick={onClickMemberIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
        <button type="button" className="hover:bg-sky-700 hover:text-white p-1" onClick={onClickExit}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {showMemberModal && <DMMemberModal />}
    </>
  );
};

export default DMButtons;
