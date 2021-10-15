import { IChannel, IUser } from "@/typings/db";
import fetcher from "@/utils/fetcher";
import { useCallback, useState, VFC } from "react";
import useSWR from "swr";

const ChannelList: VFC = ({}) => {
  const { data: userData } = useSWR<IUser>("/api/user/me", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? "http://localhost:3000/api/channels" : null,
    fetcher
  );
  const [channelCollapse, setChannelCollapse] = useState(false);

  const onClickCreateNew = useCallback(() => {}, []);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="border-2 border-gray-500 bg-white rounded-2xl p-2 flex flex-row items-center space-x-2">
        <button onClick={onClickCreateNew}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-sky-700 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div>Create New</div>
      </div>
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <button onClick={toggleChannelCollapse} className="px-1">
          {channelCollapse ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
        Channels
      </div>
      <div className="flex flex-col space-y-1">
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <span
                key={channel.name}
                className="w-full px-2 py-1 border-b-2 flex justify-between hover:bg-gray-300"
              >
                # {channel.name}
                {channel.private && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            );
          })}
      </div>
      <button className="w-full bg-sky-700 text-sky-100 hover:bg-gray-300 hover:text-sky-700 flex flex-row justify-between items-center rounded-full px-3 py-1">
        <div>Search Channels</div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ChannelList;
