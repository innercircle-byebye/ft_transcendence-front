import React, { useCallback, VFC } from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import BlockedItem from './BlockedItem';

interface IProps {
  show: boolean;
}

const BlockedList: VFC<IProps> = ({ show }) => {
  const { data: blockedData, revalidate: revalidateBlockedData } = useSWR<IUser[]>('/api/block/list', fetcher);

  const onClickCancelBlockUser = useCallback((blockedUser: IUser) => {
    axios.delete(`/api/block/${blockedUser.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${blockedUser.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
      revalidateBlockedData();
    }).catch(() => {
      toast.error(`${blockedUser.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [revalidateBlockedData]);

  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {blockedData?.map((data) => (
          <div key={data.userId + data.nickname} className="py-1">
            <BlockedItem blockedUser={data} onClickCancelBlockUser={onClickCancelBlockUser} />
          </div>
        ))}
      </Scrollbars>
    </div>
  );
};

export default BlockedList;
