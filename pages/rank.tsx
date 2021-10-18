import { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import styles from '@/styles/Home.module.css';

const dummyUserProfile = {
  avatarURL: 'https://picsum.photos/400/400',
  username: 'Fox',
};

const dummyRankDatas = [
  { rank: 1, username: 'Jane', xp: 30000 },
  { rank: 2, username: 'John', xp: 20000 },
  { rank: 3, username: 'Tom1', xp: 20000 },
  { rank: 4, username: 'Tom2', xp: 20000 },
  { rank: 5, username: 'Tom3', xp: 20000 },
  { rank: 6, username: 'Tom4', xp: 20000 },
  { rank: 7, username: 'Tom5', xp: 20000 },
  { rank: 8, username: 'Tom6', xp: 20000 },
  { rank: 9, username: 'Tom7', xp: 20000 },
  { rank: 10, username: 'Tom8', xp: 20000 },
  { rank: 11, username: 'Tom9', xp: 20000 },
  { rank: 12, username: 'Tom10', xp: 20000 },
  { rank: 13, username: 'Tom11', xp: 20000 },
];

const dummyPaginationLinkTexts = ['<', '1', '2', '3', '4', '5', '>'];

const Rank = () => (
    <div className={styles.container}>
      <Head>
        <title>Rank - Pong&Chat</title>
        <meta name="description" content="Rank - Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid gap-8 grid-cols-3 py-8 w-8/12 max-w-screen-xl h-full">
        {/* 사용자 정보 */}
        <div>
          <div className="py-12 mb-6 rounded-md bg-gray-200">
            <div className="flex justify-center mb-4">
              <div className="w-72 h-72 rounded-full overflow-hidden">
                <Image
                  src={dummyUserProfile.avatarURL}
                  width={300}
                  height={300}
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="py-2 text-center">
              <h2 className="text-5xl">{dummyUserProfile.username}</h2>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <a className="px-2 py-1 rounded-md text-lg bg-amber-300 text-gray-700">
                내 Rank 보기
              </a>
            </Link>
          </div>
        </div>
        {/* 랭크 정보 */}
        <div className="col-span-2 h-full">
          <div className="mb-4">
            <h1 className="text-4xl leading-10">Ranks</h1>
          </div>
          <div className="p-4 rounded-md bg-gray-300 ">
            <div className="text-lg">
              <ul>
                <li>Rank | Name | Point</li>
                {dummyRankDatas.map((rankData) => (
                  <li key={rankData.username}>
                    {rankData.rank} | {rankData.username} | {rankData.xp}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="inline-block rounded-md border border-gray-50 overflow-hidden bg-gray-50">
                {dummyPaginationLinkTexts.map((paginationLinkText) => (
                  <Link href="/" key={paginationLinkText}>
                    <a className="mx-px px-2 py-1 bg-amber-300 text-gray-700">
                      {paginationLinkText}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
