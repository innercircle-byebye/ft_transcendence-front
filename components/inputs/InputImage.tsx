import Image from 'next/image';
import {
  Dispatch, SetStateAction, useCallback, useRef, VFC,
} from 'react';

interface IProps {
  size: number;
  previewImagePath: string;
  setImageFile: Dispatch<SetStateAction<File | null>>;
}

const InputImage: VFC<IProps> = ({ size, previewImagePath, setImageFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChangeImage = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  }, [setImageFile]);

  const onClickUploadImage = useCallback((e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className={`relative bg-blue-300 w-${size} h-${size} mb-4 rounded-full shadow-lg`}>
      {previewImagePath ? (
        <Image
          src={previewImagePath}
          alt="previewImage"
          objectFit="cover"
          layout="fill"
          className="rounded-full"
        />
      ) : null}
      <button
        type="button"
        onClick={onClickUploadImage}
        className={`w-${size} h-${size} rounded-full cursor-pointer opacity-20 hover:opacity-80`}
      >
        Upload Image
      </button>
      <input
        type="file"
        accept="image/jpg,image/png,image/jpeg,image/gif"
        className="hidden"
        ref={fileInputRef}
        onChange={onChangeImage}
      />
    </div>
  );
};

export default InputImage;
