import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '@/components/navigation-bar/Navbar';
import InputImage from '@/components/inputs/InputImage';
import useInput from '@/hooks/useInput';
import InputNickname from '@/components/inputs/InputNickname';
import InputEmail from '@/components/inputs/InputEmail';
import Switch from '@/components/edit-profile-page/Switch';
import PageContainer from '@/components/edit-profile-page/PageContainer';
import ContentContainer from '@/components/edit-profile-page/ContentContainer';

const EditProfile = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(userInitialData.imagePath);
  const [nickname, onChangeNickname, setNickname] = useInput<string>(userInitialData.nickname);
  const [email, onChangeEmail, setEmail] = useInput(userInitialData.email);
  const [emailError, setEmailError] = useState(false);
  const [isStatusPublic, setIsStatePublic] = useState(userInitialData.isStatusPublic);
  const [isHistoryPublic, setIsHistoryPublic] = useState(userInitialData.isHistoryPublic);

  const onClickResetNickname = useCallback(() => {
    setNickname(userInitialData.nickname);
  }, [setNickname, userInitialData.nickname]);

  const onClickResetEmail = useCallback(() => {
    setEmail(userInitialData.email);
  }, [setEmail, userInitialData.email]);

  const onClickSwitchState = useCallback(() => {
    setIsStatePublic((prev: boolean) => !prev);
  }, []);

  const onClickSwitchHistory = useCallback(() => {
    setIsHistoryPublic((prev: boolean) => !prev);
  }, []);

  const onClickReset = useCallback((e) => {
    e.preventDefault();
    setNickname(userInitialData.nickname);
    setEmail(userInitialData.email);
    setPreviewImagePath(userInitialData.imagePath);
    setImageFile(null);
    setIsStatePublic(userInitialData.isStatusPublic);
    setIsHistoryPublic(userInitialData.isHistoryPublic);
  },
  [setNickname, userInitialData.nickname, userInitialData.email, userInitialData.imagePath,
    userInitialData.isStatusPublic, userInitialData.isHistoryPublic, setEmail]);

  const onClickCancel = useCallback(() => {
    router.push(`/profile/${userInitialData.nickname}`);
  }, [router, userInitialData.nickname]);

  const onSubmitEditProfile = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData();
    if (imageFile) {
      formData.append('imagePath', imageFile);
    }
    if (nickname !== userInitialData.nickname) formData.append('nickname', nickname);
    if (email !== userInitialData.email) formData.append('email', email);
    if (isStatusPublic !== userInitialData.isStatusPublic) formData.append('isStatusPublic', isStatusPublic.toString());
    if (isHistoryPublic !== userInitialData.isHistoryPublic) formData.append('isStatusPublic', isStatusPublic.toString());
    axios.patch('/api/user/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        withCredentials: 'true',
      },
    }).then(() => {
      router.push('/');
    }).catch(() => {
      toast.error('프로필 수정에 실패했습니다.', { position: 'bottom-center', theme: 'colored' });
    });
  }, [email, imageFile, isHistoryPublic, isStatusPublic, nickname, router, userInitialData]);

  useEffect(() => {
    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }, [imageFile, previewImagePath, userInitialData.imagePath]);

  return (
    <PageContainer>
      <ContentContainer onClickReset={onClickReset}>
        <form onSubmit={onSubmitEditProfile} className="flex flex-col items-center">
          <InputImage size={72} previewImagePath={previewImagePath} setImageFile={setImageFile} />
          <InputNickname
            nickname={nickname}
            onChangeNickname={onChangeNickname}
            onClickResetNickname={onClickResetNickname}
          />
          <InputEmail
            email={email}
            onChangeEmail={onChangeEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            onClickResetEmail={onClickResetEmail}
          />
          <Switch title="상태공개 / 비공개" isLeft={isStatusPublic} onClickSwitch={onClickSwitchState} />
          <Switch title="기록공개 / 비공개" isLeft={isHistoryPublic} onClickSwitch={onClickSwitchHistory} />
          <div className="w-72 flex items-center justify-evenly">
            <button
              className="bg-white text-sky-600 border-sky-600 border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClickCancel}
            >
              Cancel
            </button>
            <button
              className="bg-sky-600 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

EditProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

export default EditProfile;