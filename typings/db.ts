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

export interface IAnnouncement {
  announcementId: number;
  adminId: number;
  title: string;
  content: string;
  createdAt: string;
  lastModifiedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
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
  ownerId: number;
  name: string;
  isPrivate: boolean;
  password: string;
  maxParticipantNum: number;
  readonly createdAt: Date;
  readonly lastModifiedAt: Date;
  deletedAt: Date;
  currentChatMemberCount: number;
}

export interface IChannelChat {
  channelChatId: number;
  userId: number;
  channelId: number;
  content: string;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date | null;
}

export interface IDMChat {
  // DM 의 채팅
  dmId: number;
  sender: IUser;
  receiver: IUser;
  content: string;
  createAt: Date;
  lastModifiedAt: Date;
}

export interface IChatItem {
  createdAt: Date;
  userId: number;
  imagePath: string;
  content: string;
}

export interface IChannelUser {
  nickname: string;
  imagePath: string;
}

export interface IChannelMember {
  userId: number;
  channelId: number;
  mutedDate: Date;
  banDate: Date;
  isAdmin: boolean;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date;
  user: IChannelUser;
}

export interface ISimpleUser {
  userId: number;
  nickname: string;
  imagePath: string;
}
