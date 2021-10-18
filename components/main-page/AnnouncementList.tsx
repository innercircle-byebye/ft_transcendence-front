import { IAnnouncement } from "@/typings/db";
import fetcher from "@/utils/fetcher";
import { SpeakerphoneIcon } from "@heroicons/react/outline";
import { useState } from "react";
import useSWR from "swr";
import AnnouncementModal from "./AnnouncementModal";

const AnnouncementList = () => {
  // api 호출
  // GET http://localhost:3005/api/admin/announcement
  const { data: announcementData } = useSWR<IAnnouncement[]>( // api 의 결과값이 array
    "/api/admin/announcement",
    fetcher
  );

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const onClickMethod = (id: number) => {
    setClickedIndex(id);
  };

  const onCloseModal = () => {
    setClickedIndex(null);
  };

  return (
    <div className="bg-gray-700 flex flex-col w-1/5 text-center py-6 space-y-6 rounded-2xl">
      {/* justify-center 를 사용하여 하위 element 들을 가운데 정렬, items-center 를 사용하여 icon 화면 정중앙으로 배치 */}
      <div className="flex flex-row h-1/5 space-x-6 text-white justify-center items-center">
        <div className="w-4 h-4">
          <SpeakerphoneIcon />
        </div>
        <div>Announcement</div>
      </div>
      <div className="flex flex-col space-y-4 mx-4 rounded-lg">
        {/* 향후 list 로 관리 scroll 기능으로 확장 예정 */}
        <div className="h-8 overflow-y-auto space-y-3">
          {announcementData?.map((item: IAnnouncement) => (
            <div
              className="bg-sky-200 rounded-md py-2"
              key={item.announcementId}
            >
              <button onClick={() => onClickMethod(item.announcementId)}>
                <a>{item.title}</a>
              </button>
              <AnnouncementModal
                item={item}
                isShow={clickedIndex === item.announcementId}
                onCloseModal={onCloseModal}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementList;
