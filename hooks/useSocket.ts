import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3005';

const sockets: { [key: string]: Socket } = {};

const useSocket = (namespace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (namespace) {
      sockets[namespace].disconnect();
      delete sockets[namespace];
    }
  }, [namespace]);

  if (!namespace) {
    return [undefined, disconnect];
  }

  if (!sockets[namespace]) {
    sockets[namespace] = io(`${backUrl}/${namespace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[namespace], disconnect];
};

export default useSocket;
