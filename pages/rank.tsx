import { ReactElement } from "react";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import styles from "@/styles/Home.module.css";

const dummyRankDatas = [
  "1 | Jane | 30000",
  "2 | John | 20000",
  "3 | Tom | 20000",
  "4 | Tom | 20000",
  "5 | Tom | 20000",
  "6 | Tom | 20000",
  "7 | Tom | 20000",
  "8 | Tom | 20000",
  "9 | Tom | 20000",
  "10 | Tom | 20000",
  "11 | Tom | 20000",
  "12 | Tom | 20000",
  "13 | Tom | 20000",
];

const dummyPaginationButtonTexts = ["<", "1", "2", "3", "4", "5", ">"];

const Rank = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rank - Pong&Chat</title>
        <meta name="description" content="Rank - Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-10/12 h-4/6 grid gap-8 grid-cols-3 border border-gray-700">
        <div className="">
          <div className="bg-gray-200 rounded-md">
            <div>
              <div>Image</div>
            </div>
            <div>
              <p>Fox</p>
            </div>
          </div>
          <div>
            <button className="px-2 py-1 rounded-md bg-amber-300 text-gray-700">
              내 Rank 보기
            </button>
          </div>
        </div>
        <div className="col-span-2 h-full">
          <div>
            <h1>Ranks</h1>
          </div>
          <div className=" bg-gray-300 rounded-md">
            <div>
              <ul>
                <li>Rank | Name | Point</li>
                {dummyRankDatas.map((rankData) => (
                  <li key={rankData}>{rankData}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-gray-50">
                {dummyPaginationButtonTexts.map((aginationButtonText) => (
                  <button
                    key={aginationButtonText}
                    className="mx-px px-2 py-1 bg-amber-300 text-gray-700"
                  >
                    {aginationButtonText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
