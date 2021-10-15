import { IAnnouncement } from "@/typings/db";
import fetcher from "@/utils/fetcher";
import { SpeakerphoneIcon } from "@heroicons/react/outline";
import axios from "axios";
import useSWR from "swr";

const AnnouncementList = () => {
  // api 호출
  // GET http://localhost:3005/api/admin/announcement
  /* 안되니까 SWR 로 변경해보자
  const announcementData: IAnnouncement = axios
    .get(`${process.env.BACK_API_PATH}/api/admin/announcement`, {
      withCredentials: true,
    })
    .then((res) => res.data);
  */

  const { data: announcementData } = useSWR<IAnnouncement>(
    "/api/admin/announcement",
    fetcher
  );
  console.log("Announcement:", announcementData);
  // console.log(Object.entries(announcementData));  이 코드는 error 가 발생합니다.

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
        {/* 객체를 array 로 바꿔야하는 군요... 할 수 있을 것 같은데... 일단 error 없이 되긴함 */}
        {announcementData?.map((item: IAnnouncement) => (
          <div key={item.announcementId} className="bg-sky-200 rounded-md py-2">
              <a>{item.title}</a>
          </div>
        ))}
        {/* align-middle 이 적용되지 않아서 y축 padding 을 적용하여 text 를 중앙정렬시켰습니다. */}
        <div className="bg-sky-200 rounded-md py-2">list1</div>
        <div className="bg-sky-200 rounded-md py-2">list2</div>
        <div className="bg-sky-200 rounded-md py-2">list3</div>
      </div>
    </div>
  );
};

export default AnnouncementList;
