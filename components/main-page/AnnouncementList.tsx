import { useState } from 'react';
import useSWR from 'swr';
import { SpeakerphoneIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import fetcher from '@/utils/fetcher';
import { IAnnouncement } from '@/typings/db';
import AnnouncementModal from './AnnouncementModal';

const AnnouncementList = () => {
  const { data: announcementData } = useSWR<IAnnouncement[]>(
    '/api/admin/announcement',
    fetcher,
  );

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const onClickMethod = (id: number) => {
    setClickedIndex(id);
  };

  const onCloseModal = () => {
    setClickedIndex(null);
  };

  if (!announcementData?.length) {
    return (
      <div className="bg-gray-700 flex flex-col py-6 space-y-3 rounded-2xl w-full">
        <div className="flex flex-row space-x-3 text-white justify-center items-center">
          <div className="w-6 h-6">
            <SpeakerphoneIcon />
          </div>
          <div className="text-2xl">Announcement</div>
        </div>
        <div className="h-full flex justify-center items-center text-white">
          <span>공지사항이 없습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 flex flex-col py-6 space-y-3 rounded-2xl">
      <div className="flex flex-row space-x-3 text-white justify-center items-center">
        <div className="w-6 h-6">
          <SpeakerphoneIcon />
        </div>
        <div className="text-2xl">Announcement</div>
      </div>
      <div className="flex flex-col mx-4">
        <div className="max-h-48 overflow-y-auto space-y-3">
          {announcementData?.map((item: IAnnouncement) => (
            <div className="px-4 py-1 bg-sky-200 rounded-md font-light" key={item.announcementId}>
              <button
                type="button"
                className="w-full py-2"
                onClick={() => onClickMethod(item.announcementId)}
              >
                <div className="flex w-full">
                  <span className="w-3/4 flex justify-start">{item.title}</span>
                  <span className="w-1/4">{dayjs(item.createdAt).format('YYYY-MM-DD')}</span>
                </div>
                <AnnouncementModal
                  item={item}
                  isShow={clickedIndex === item.announcementId}
                  onCloseModal={onCloseModal}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementList;
