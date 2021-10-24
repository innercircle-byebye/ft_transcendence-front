import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3005';

const sockets: { [key: string]: Socket } = {};

interface IReturn {
  socket: Socket | undefined;
  disconnect: () => void;
}

const useSocket = (namespace: string | null): IReturn => {
  const disconnect = useCallback(() => {
    if (namespace) {
      sockets[namespace].disconnect();
      delete sockets[namespace];
    }
  }, [namespace]);

  if (!namespace) {
    return { socket: undefined, disconnect };
  }

  if (!sockets[namespace]) {
    sockets[namespace] = io(`${backUrl}/${namespace}`, {
      transports: ['websocket'],
    });
  }

  return { socket: sockets[namespace], disconnect };
};

export default useSocket;
