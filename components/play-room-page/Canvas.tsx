import {
  useEffect, useRef,
} from 'react';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    // x_pos, y_pos, width, height
    context?.fillRect(0, 0, 20, 80);
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
};

export default Canvas;
