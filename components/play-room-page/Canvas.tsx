import {
  useEffect, useRef, useState, VFC,
} from 'react';
import { IGameUpdateData } from '@/typings/db';

interface IProps {
  updateData: IGameUpdateData[] | null;
}

const Canvas: VFC<IProps> = ({ updateData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(600);
  const [canvasHeight, setCanvasHeight] = useState<number>(400);

  useEffect(() => {
    console.log('div size', document.getElementById('gameScreen')?.offsetWidth);
    console.log('div size', document.getElementById('gameScreen')?.offsetHeight);
    if (document.getElementById('gameScreen')) {
      // setCanvasHeight(document.getElementById('gameScreen').offsetWidth);
      // setCanvasWidth(document.getElementById('gameScreen').offsetHeight);
      setCanvasHeight(1200);
      setCanvasWidth(1800);
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    // clear
    context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // x_pos, y_pos, width, height
    // draw
    // console.log('updateData 로 그림 그리기', updateData);
    if (updateData) {
      if (updateData[0]) {
      // draw 1P
        context?.fillRect(
          updateData[0].x,
          updateData[0].y,
          updateData[0].width,
          updateData[0].height,
        );
      }
      if (updateData[1]) {
      // draw 2P
        context?.fillRect(
          updateData[1].x,
          updateData[1].y,
          updateData[1].width,
          updateData[1].height,
        );
      }
      if (updateData[2]) {
      // draw ball;
        context?.fillRect(
          updateData[2].x,
          updateData[2].y,
          updateData[2].width,
          updateData[2].height,
        );
      }
    }
  }, [updateData]);

  return (
    <canvas
      ref={canvasRef}
      width={`${canvasWidth}`}
      height={`${canvasHeight}`}
    />
  );
};

export default Canvas;
