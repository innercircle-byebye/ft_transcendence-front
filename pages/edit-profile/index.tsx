import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import Navbar from '@/components/navigation-bar/Navbar';
import InputImage from '@/components/inputs/InputImage';
import { IUser } from '@/typings/db';
import useInput from '@/hooks/useInput';
import InputNickname from '@/components/inputs/InputNickname';
import InputEmail from '@/components/inputs/InputEmail';
import Switch from '@/components/edit-profile-page/Switch';
import PageContainer from '@/components/edit-profile-page/PageContainer';
import ContentContainer from '@/components/edit-profile-page/ContentContainer';

const EditProfile = ({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(userData.imagePath);
  const [nickname, onChangeNickname, setNickname] = useInput<string>(userData.nickname);
  const [email, onChangeEmail, setEmail] = useInput(userData.email);
  const [emailError, setEmailError] = useState(false);
  const [isStatusPublic, setIsStatePublic] = useState(userData.isStatusPublic);
  const [isHistoryPublic, setIsHistoryPublic] = useState(userData.isHistoryPublic);

  const onClickResetNickname = useCallback(() => {
    setNickname(userData.nickname);
  }, [setNickname, userData.nickname]);

  const onClickResetEmail = useCallback(() => {
    setEmail(userData.email);
  }, [setEmail, userData.email]);

  const onClickSwitchState = useCallback(() => {
    setIsStatePublic((prev) => !prev);
  }, []);

  const onClickSwitchHistory = useCallback(() => {
    setIsHistoryPublic((prev) => !prev);
  }, []);

  const onClickReset = useCallback((e) => {
    e.preventDefault();
    setNickname(userData.nickname);
    setEmail(userData.email);
    setPreviewImagePath(userData.imagePath);
    setImageFile(null);
    setIsStatePublic(userData.isStatusPublic);
    setIsHistoryPublic(userData.isHistoryPublic);
  },
  [setNickname, userData.nickname, userData.email, userData.imagePath,
    userData.isStatusPublic, userData.isHistoryPublic, setEmail]);

  useEffect(() => {
    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }, [imageFile, previewImagePath, userData.imagePath]);

  return (
    <PageContainer>
      <ContentContainer>
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
            onClick={onClickReset}
          >
            Reset
          </button>
          <button
            className="bg-sky-600 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
        </div>
      </ContentContainer>
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

interface IProps {
  userData: IUser;
}

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const userData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      userData,
    },
  };
};

export default EditProfile;
