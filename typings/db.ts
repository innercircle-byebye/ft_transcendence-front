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
  count: number;
  win: number;
  lose: number;
}

export interface IMessage {
  message: string;
}

export interface IChannel {
  channelId: number;
  name: string;
  password: string;
  maxParticipantNum: number;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date;
  deletedAt: Date;
}

export interface IChat {
  // 채널의 채팅
  channelChatId: number;
  userId: number;
  channelId: number;
  content: string;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date | null;
}
