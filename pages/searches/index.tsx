import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import SearchProfileCard from '@/components/searches-page/SearchProfileCard';
import PageContainer from '@/components/searches-page/PageContainer';
import Navbar from '@/components/navigation-bar/Navbar';
import ContentContainer from '@/components/searches-page/ContentContainer';

const Searches = () => {
  const router = useRouter();
  const { search } = router.query;
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);

  return (
    <PageContainer>
      <ContentContainer>
        <p className="text-xl text-gray-700">{`Search '${search}'`}</p>
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-7">
            {
              allUserData?.filter((data) => (data.nickname.includes(`${search}`)))
                .map((user) => <SearchProfileCard key={user.userId + user.nickname} user={user} />)
            }
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  );
};

Searches.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export default Searches;
