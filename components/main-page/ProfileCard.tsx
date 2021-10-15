import { IUser } from "@/typings/db";
import Image from "next/image";
import { VFC } from "react";

interface Props {
  userData: IUser;
}

const ProfileCard: VFC<Props> = ({userData}) => {
  console.log("userData:", userData);
  console.log(userData.imagePath)
  return (
    <div className="bg-gray-200 flex flex-col w-1/5 space-y-2 text-center rounded-2xl">
      <div className="flex justify-center">
        {/* 상위 width 1/5 의 1/2 를 적용하고, 중앙 정렬을 위해서 상위 div 설정했습니다. */}
        <div className="border-4 border-opacity-100 rounded-full w-1/2">
          {/* <Image src="/Logo.png" alt="Profile Image" width="100" height="100" /> */}
          <Image src={`${userData.imagePath}`} alt="Profile Image" width="100" height="100"/>
        </div>
      </div>
      {/* <div className="p-1">name</div> */}
      <div className="p-1">{userData.nickname}</div>
      <div className="p-1">History</div>
      <div className="p-1">rate</div>
    </div>
  );
};

export default ProfileCard;
