import {
  useEffect, useRef, VFC,
} from 'react';
import { IGameUpdateData } from '@/typings/db';

interface IProps {
  updateData: IGameUpdateData[] | null;
  role: string | null;
  draw: (context: CanvasRenderingContext2D | null | undefined) => void;
}

const Canvas: VFC<IProps> = ({ updateData, role, draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    // context?.fillStyle = 'red';

    // clear
    context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // x_pos, y_pos, width, height
    // draw
    // context?.fillRect(100, 100, 20, 80);
    draw(context);
    console.log('updateData 로 그림 그리기', updateData);
    if (role === 'player1') {
      console.log('1p');
      // context?.fillRect(100, 200, 20, 80);
      if (updateData) {
        context?.fillRect(
          updateData[0].x,
          updateData[0].y,
          updateData[0].width,
          updateData[0].height,
        );
      }
    }
    if (role === 'player2') {
      console.log('2p');
      // context?.fillRect(0, 0, 20, 80);
      if (updateData) {
        context?.fillRect(
          updateData[1].x,
          updateData[1].y,
          updateData[1].width,
          updateData[1].height,
        );
      }
    }
    if (role === 'ball') {
      console.log('ball');
      if (updateData) {
        context?.fillRect(
          updateData[2].x,
          updateData[2].y,
          updateData[2].width,
          updateData[2].height,
        );
      }
    }
  }, [draw, role, updateData]);

  return (
    <canvas ref={canvasRef} width="1400" height="500" />
  );
};

export default Canvas;
