import React, { useCallback, VFC } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useInput from '@/hooks/useInput';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const SearchDM: VFC = () => {
  const router = useRouter();
  const [searchNickname, onChangeSearchNickname] = useInput('');
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher, {
    dedupingInterval: 10000,
  });

  const onClickSendDM = useCallback((nickname: string) => {
    router.push(`/chat/dm/${nickname}`);
  }, [router]);

  return (
    <>
      <div className="w-full bg-white border border-gray-900 flex flex-row items-center rounded-full px-3 py-1 space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sky-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input type="text" value={searchNickname} onChange={onChangeSearchNickname} placeholder="Search Nickname" className="text-lg font-semibold text-sky-700 w-full outline-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-3">
        {allUserData?.map((data) => {
          if (searchNickname) {
            if (!data.nickname.includes(searchNickname)) {
              return null;
            }
          }
          return (
            <div key={data.userId}>
              <div className="grid grid-cols-2 justify-items-center items-center w-full h-auto border-2 border-coolGray-500 bg-coolGray-100 rounded-xl px-5 py-2 text-lg">
                <div className="w-full flex justify-start">{data.nickname}</div>
                <div className="w-full flex justify-end">
                  <button type="button" onClick={() => onClickSendDM(data.nickname)}>
                    <a className="flex items-center bg-blue-400 font-semibold text-gray-900 px-3 py-2 rounded-xl text-xs sm:text-sm md:text-base">
                      DM보내기
                    </a>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchDM;
