import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import InputEmail from '@/components/inputs/InputEmail';
import InputNickname from '@/components/inputs/InputNickname';
import useInput from '@/hooks/useInput';
import InputImage from '@/components/inputs/InputImage';
import PageContainer from '@/components/create-profile-page/PageContainer';
import ContentContainer from '@/components/create-profile-page/ContentContainer';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

const CreateProfile = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(
    userInitialData.imagePath,
  );
  const [nickname, onChangeNickname, setNickname] = useInput<string>(
    userInitialData.nickname,
  );
  const [email, onChangeEmail, setEmail] = useInput<string>(userInitialData.email);
  const [emailError, setEmailError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);

  const onClickResetNickname = useCallback(() => {
    setNickname(userInitialData.nickname);
  }, [setNickname, userInitialData.nickname]);

  const onClickResetEmail = useCallback(() => {
    setEmail(userInitialData.email);
  }, [setEmail, userInitialData.email]);

  const onClickReset = useCallback(
    (e) => {
      e.preventDefault();
      setNickname(userInitialData.nickname);
      setEmail(userInitialData.email);
      setPreviewImagePath(userInitialData.imagePath);
      setImageFile(null);
    },
    [
      userInitialData.email,
      userInitialData.imagePath,
      userInitialData.nickname,
      setEmail,
      setNickname,
    ],
  );

  const onSubmitCreateProfile = useCallback(
    (e) => {
      e.preventDefault();
      if (nickname.trim().length && email.trim().length && !emailError && !nicknameError) {
        const formData = new FormData();
        if (imageFile) {
          formData.append('image', imageFile);
        }
        formData.append('nickname', nickname);
        formData.append('email', email);
        axios
          .post('/api/user/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              withCredentials: 'true',
            },
          })
          .then(() => {
            router.push('/');
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center', theme: 'colored' });
          });
      }
    },
    [email, emailError, imageFile, nickname, nicknameError, router],
  );

  useEffect(() => {
    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }, [imageFile, previewImagePath]);

  useEffect(() => {
    if (allUserData) {
      if (nickname !== userInitialData.nickname
        && allUserData.find((data) => data.nickname === nickname)) {
        setNicknameError(true);
      } else {
        setNicknameError(false);
      }
    }
  }, [allUserData, nickname, userInitialData.nickname]);

  return (
    <PageContainer>
      <ContentContainer>
        <div className="text-6xl text-gray-700">Create Profile</div>
        <form
          className="flex flex-col items-center"
          onSubmit={onSubmitCreateProfile}
        >
          <InputImage size={56} previewImagePath={previewImagePath} setImageFile={setImageFile} />
          <InputNickname
            nickname={nickname}
            onChangeNickname={onChangeNickname}
            onClickResetNickname={onClickResetNickname}
            nicknameError={nicknameError}
          />
          <InputEmail
            email={email}
            onChangeEmail={onChangeEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            onClickResetEmail={onClickResetEmail}
          />
          <div className="w-56 flex items-center justify-evenly">
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
        </form>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default CreateProfile;
