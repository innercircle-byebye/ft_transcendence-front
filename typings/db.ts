export interface IUser {
  userId: number;
  email: string;
  intraUsername: string;
  nickname: string;
  imagePath: string;
  status: string;
  experience: number;
  rankId: number;
  banDate: string | null;
  isStatusPublic: boolean;
  isHistoryPublic: boolean;
  createdAt: string;
  lastModifiedAt: string;
  deletedAt: string | null;
}

export interface IHistory {
  win: number;
  lose: number;
}

export interface IMessage {
  message: string;
}

export interface IChannel {
  id: number;
  name: string;
  private: boolean; // 비공개 채널 여부, 강좌에서는 모두 false(공개)
}
