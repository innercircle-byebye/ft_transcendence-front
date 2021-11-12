import {
  ChangeEvent, useCallback, useRef, useState,
} from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import ContentContainer from '@/components/create-profile-page/ContentContainer';
import PageContainer from '@/components/create-profile-page/PageContainer';

const TwoFactorAuth = () => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [authNum, setAuthNum] = useState<string>('');

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (value.length >= 1) {
      setAuthNum((prev) => prev + value);
      if (+name < 5) {
        inputRefs.current[+name + 1].value = '';
        inputRefs.current[+name + 1].focus();
      }
    }
  };

  const onSubmitAuthNum = useCallback((e) => {
    e.preventDefault();
    axios.post('/auth/2fa/authenticate', {
      twoFactorAuthCode: authNum,
    }, {
      headers: {
        withCredentials: 'true',
      },
    });
  }, [authNum]);

  return (
    <PageContainer>
      <ContentContainer>
        <div className="text-6xl text-gray-700">2Factor Authenticate</div>
        <form onSubmit={onSubmitAuthNum}>
          <div className="space-x-2">
            <input name="0" ref={(el) => { if (el) inputRefs.current[0] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
            <input name="1" ref={(el) => { if (el) inputRefs.current[1] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
            <input name="2" ref={(el) => { if (el) inputRefs.current[2] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
            <input name="3" ref={(el) => { if (el) inputRefs.current[3] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
            <input name="4" ref={(el) => { if (el) inputRefs.current[4] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
            <input name="5" ref={(el) => { if (el) inputRefs.current[5] = el; }} minLength={0} maxLength={1} onChange={onChangeInput} className="bg-sky-100 w-20 h-20 text-center text-5xl outline-none" />
          </div>
          <button type="button" className="bg-white text-sky-600 border-sky-600 border font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
            Send
          </button>
        </form>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

export default TwoFactorAuth;
