import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";

const CreateChannel = () => {
  const router = useRouter();
  const [channelName, setChannelName] = useState('');
  const [maxMemberNum, setMaxMemberNum] = useState(3);
  const [isPrivate, setIsPrivate] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChangeChannelName = useCallback((e) => {
    setChannelName(e.target.value);
  }, []);

  const onChangeMaxMemberNum = useCallback((e) => {
    setMaxMemberNum(e.target.value);
  }, []);

  const onClickSwitch = useCallback((e) => {
    e.preventDefault();
    setIsPrivate((prev) => !prev);
  }, []);

  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (maxMemberNum < 3) {
      setMaxMemberNum(3);
    }
  }, [maxMemberNum]);

  return (
    <div className="w-screen h-full flex flex-col items-center space-y-20">
      <div className="mt-20 text-5xl">Create Chat Channel</div>
      <div className="flex flex-col items-center justify-evenly space-y-10">
        <input className="px-6 py-4 w-56 rounded-full bg-gray-100 text-xl" placeholder="채널명" type="text" value={channelName} onChange={onChangeChannelName} />
        <div className="flex flex-row items-center space-x-6">
          <div className="ml-3 text-gray-700 font-medium">최대인원수</div>
          <input className="px-6 py-4 w-24 rounded-full bg-gray-100 text-xl" type="number" min={3} value={maxMemberNum} onChange={onChangeMaxMemberNum} />
        </div>


        <div className="flex flex-row items-center justify-center space-x-6">
          <div className="ml-3 text-gray-700 font-medium">
            Public / Private
          </div>
          <button className="relative" onClick={onClickSwitch}>
            {/* <input type="checkbox" id="toggleB" className="sr-only" /> */}
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            {isPrivate ? (<div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>) :
              (<div className="absolute right-1 top-1 bg-red-400 w-6 h-6 rounded-full transition"></div>)}
          </button>
        </div>


        <div>invite member</div>
        <div className="space-x-4">
          <button
            className="bg-gray-400 text-white py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClickCancel}
          >
            CANCEL
          </button>
          <button
            className="bg-amber-600 text-white py-3 px-10 rounded-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            SAVE
        </button>
        </div>
      </div>
    </div>
  );
}

CreateChannel.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="bg-gray-300 flex flex-row h-auto flex-1">
        <main>{page}</main>
      </div>
    </div>
  );
};


export default CreateChannel;