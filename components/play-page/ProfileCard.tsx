import { VFC } from 'react';
import Image from 'next/image';

const ProfileCard: VFC = () => (
  <div className="py-10 px-8 rounded-md bg-gray-200">
    <div className="flex justify-center mb-4 p-2">
      <div className="w-60 h-60 rounded-full overflow-hidden">
        <Image src="/favicon.ico" width={300} height={300} alt="Avatar" />
      </div>
    </div>
    <div className="py-2 text-center mb-4">
      <h2 className="text-5xl">jiwlee</h2>
    </div>
    <div className="py-2 text-center flex flex-col bg-gray-400 mx-16 rounded-md">
      <p className="text-xl">승률: 70%</p>
      <p className="text-xl">10전 7승 3패</p>
    </div>
  </div>
);

export default ProfileCard;
