import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import reissueToken from '@/utils/reissueTokens';
import { IUser } from '@/typings/db';
import InputEmail from '@/components/inputs/InputEmail';
import InputNickname from '@/components/inputs/InputNickname';
import useInput from '@/hooks/useInput';
import InputImage from '@/components/inputs/InputImage';
import PageContainer from '@/components/create-profile-page/PageContainer';
import ContentContainer from '@/components/create-profile-page/ContentContainer';

const CreateProfile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(userData.imagePath);
  const [nickname, onChangeNickname, setNickname] = useInput<string>(userData.nickname);
  const [email, onChangeEmail, setEmail] = useInput(userData.email);
  const [emailError, setEmailError] = useState(false);

  const onClickResetNickname = useCallback(() => {
    setNickname(userData.nickname);
  }, [setNickname, userData.nickname]);

  const onClickResetEmail = useCallback(() => {
    setEmail(userData.email);
  }, [setEmail, userData.email]);

  const onClickReset = useCallback(
    (e) => {
      e.preventDefault();
      setNickname(userData.nickname);
      setEmail(userData.email);
      setPreviewImagePath(userData.imagePath);
      setImageFile(null);
    },
    [
      userData.email,
      userData.imagePath,
      userData.nickname,
      setEmail,
      setNickname,
    ],
  );

  const onSubmitCreateProfile = useCallback(
    (e) => {
      e.preventDefault();
      if (nickname && email && !emailError) {
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
    [email, emailError, imageFile, nickname, router],
  );

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
        <form
          className="flex flex-col items-center"
          onSubmit={onSubmitCreateProfile}
        >
          <InputImage size={56} previewImagePath={previewImagePath} setImageFile={setImageFile} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';

  if (
    !context.req.cookies[refresh_token]
    || !context.req.cookies[access_token]
  ) {
    return reissueToken(
      context,
      access_token,
      refresh_token,
      '/create-profile',
    );
  }

  const userData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const { status } = userData;
  if (status !== process.env.STATUS_NOT_REGISTER) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};

export default CreateProfile;
