import { SpeakerphoneIcon } from '@heroicons/react/outline';

const AnnouncementList = () => (
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
        {/* align-middle 이 적용되지 않아서 y축 padding 을 적용하여 text 를 중앙정렬시켰습니다. */}
        <div className="bg-sky-200 rounded-md py-2">list1</div>
        <div className="bg-sky-200 rounded-md py-2">list2</div>
        <div className="bg-sky-200 rounded-md py-2">list3</div>
      </div>
    </div>
);

export default AnnouncementList;
