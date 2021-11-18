import {
  useEffect, useRef, useState, VFC,
} from 'react';
import { IGameUpdateData } from '@/typings/db';

interface IProps {
  updateData: IGameUpdateData[] | null;
}

const Canvas: VFC<IProps> = ({ updateData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 600 * 400 이 기준 해상도 size
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(600);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(400);
  const [ratioX, setRatioX] = useState<number>(1);
  const [ratioY, setRatioY] = useState<number>(1);

  useEffect(() => {
    // set canvas size
    setCanvasHeight(document.getElementById('gameScreen')?.offsetHeight);
    setCanvasWidth(document.getElementById('gameScreen')?.offsetWidth);
    // calc ratio
    if (canvasHeight) {
      setRatioY(canvasHeight / 400);
    }
    if (canvasWidth) {
      setRatioX(canvasWidth / 600);
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    // clear
    context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // draw
    // x_pos, y_pos, width, height
    if (updateData) {
      if (updateData[0]) {
      // draw 1P
        context?.fillRect(
          updateData[0].x * ratioX,
          updateData[0].y * ratioY,
          updateData[0].width * ratioX,
          updateData[0].height * ratioY,
        );
      }
      if (updateData[1]) {
      // draw 2P
        context?.fillRect(
          updateData[1].x * ratioX,
          updateData[1].y * ratioY,
          updateData[1].width * ratioX,
          updateData[1].height * ratioY,
        );
      }
      if (updateData[2]) {
      // draw ball;
        context?.fillRect(
          updateData[2].x * ratioX,
          updateData[2].y * ratioY,
          updateData[2].width * ratioX,
          updateData[2].height * ratioY,
        );
      }
    }
  }, [canvasHeight, canvasWidth, ratioX, ratioY, updateData]);

  return (
    <canvas
      ref={canvasRef}
      width={`${canvasWidth}`}
      height={`${canvasHeight}`}
    />
  );
};

export default Canvas;
