import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback, useState } from "react";

const CreateChannel = () => {
  const router = useRouter();
  const [channelName, setChannelName] = useState('');
  const [maxMemberNum, setMaxMemberNum] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteMembers, setInviteMembers] = useState([]);

  const onChangeChannelName = useCallback((e) => {
    setChannelName(e.target.value);
  }, []);

  const onChangeMaxMemberNum = useCallback((e) => {
    setMaxMemberNum(e.target.value);
  }, []);

  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="w-screen h-full flex flex-col items-center justify-center">
      <div className="text-5xl">Create Chat Channel</div>
      <input className="px-6 py-4 rounded-full bg-gray-100 text-xl" placeholder="채널명" type="text" value={channelName} onChange={onChangeChannelName} />
      <div>
        최대인원수
        <input type="number" min={10} value={maxMemberNum} onChange={onChangeMaxMemberNum} />
      </div>
      <div>
        <div>Private / Public</div>
        <div className="flex items-center justify-center w-full mb-12">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only checked:translate-x-full" />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </div>
          </label>
        </div>
      </div>
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
  );
}

CreateChannel.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="bg-gray-300 flex flex-row p-4 space-x-4 h-auto flex-1">
        <main>{page}</main>
      </div>
    </div>
  );
};


export default CreateChannel;