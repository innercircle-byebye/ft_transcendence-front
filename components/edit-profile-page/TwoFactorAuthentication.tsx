import React, {
  ChangeEvent,
  useCallback, useRef, useState, VFC,
} from 'react';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import Switch from './Switch';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

const TwoFactorAuthentication: VFC = () => {
  const { data: userData, revalidate } = useSWR<IUser>('/api/user/me', fetcher);
  const [is2Fa, setIs2Fa] = useState(userData?.isTwoFactorAuthEnabled);
  const [authNum, setAuthNum] = useState<string>('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const onClickSwitch2Fa = useCallback(() => {
    setAuthNum('');
    if (userData?.isTwoFactorAuthEnabled && is2Fa === true) {
      axios.post('/auth/2fa/turn_off', {}, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        revalidate();
        setIs2Fa(false);
        toast.success('2FA 인증을 비활성화했습니다.', { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error('2FA 인증을 비활성화하는데 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    } else {
      setIs2Fa((prev) => !prev);
    }
  }, [is2Fa, revalidate, userData?.isTwoFactorAuthEnabled]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (value.length >= 1) {
      if (+name === 0) {
        setAuthNum('');
      }
      setAuthNum((prev) => prev + value);
      if (+name < 5) {
        inputRefs.current[+name + 1].value = '';
        inputRefs.current[+name + 1].focus();
      }
    }
  };

  const onClickActivate2Fa = useCallback(() => {
    if (authNum.length === 6) {
      setIs2Fa(true);
      axios.post('/auth/2fa/turn_on', {
        twoFactorAuthCode: authNum,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        revalidate();
        setAuthNum('');
        toast.success('2FA 인증을 활성화했습니다.', { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        revalidate();
        setAuthNum('');
        let name = 0;
        while (+name < 6) {
          inputRefs.current[+name].value = '';
          name += 1;
        }
        toast.error('2FA 인증을 활성화하는데 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [authNum, revalidate]);

  return (
    <>
      <Switch title="2fa 비활성화 / 활성화" isLeft={!is2Fa} onClickSwitch={onClickSwitch2Fa} />
      {!userData?.isTwoFactorAuthEnabled && is2Fa && (
        <div className="flex items-center space-x-2">
          <Image
            alt="QRCode"
            width={150}
            height={150}
            src="/auth/2fa/generate"
          />
          <div className="space-x-2">
            <input name="0" ref={(el) => { if (el) inputRefs.current[0] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
            <input name="1" ref={(el) => { if (el) inputRefs.current[1] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
            <input name="2" ref={(el) => { if (el) inputRefs.current[2] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
            <input name="3" ref={(el) => { if (el) inputRefs.current[3] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
            <input name="4" ref={(el) => { if (el) inputRefs.current[4] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
            <input name="5" ref={(el) => { if (el) inputRefs.current[5] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="w-12 h-12 text-center text-xl" />
          </div>
          <button type="button" onClick={onClickActivate2Fa} className="bg-white text-sky-600 border-sky-600 border font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
            Send
          </button>
        </div>
      )}
    </>
  );
};

export default TwoFactorAuthentication;
