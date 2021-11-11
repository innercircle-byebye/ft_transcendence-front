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

export interface IDMChat {
  // DM 의 채팅
  dmId: number;
  sender: IUser;
  receiver: IUser;
  content: string;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface IChatItem {
  userId: number;
  nickname: string;
  imagePath: string;
  content: string;
  createdAt: Date;
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

export interface IChannelChat {
  channelChatId: number;
  userId: number;
  channelId: number;
  content: string;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date | null;
  user: IChannelUser;
}

export interface ISimpleUser {
  userId: number;
  nickname: string;
  imagePath: string;
}

// initSetting -> gameRoomData
export interface IGameRoomData{
  participants: {
    player1: IUser,
    player2: IUser,
    obserber: IUser[],
  };
  role: string; // 'player1' | 'player2' | 'observer'
  width : number; // 600
  height : number; // 400
  // ready 상태 알려주는 거 필요합니다.
}

export interface IGameUpdateData {
  type: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

export interface IGameChat {
  type: string;
  nickname: string;
  content: string;
  index : number;
}

export interface IGameMember {
  userId: number;
  status: string;
  nickname: string;
}

export interface IGameRoom {
  gameRoomId: number;
  title: string;
  maxParticipantNum: number;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date | null;
  isPrivate: boolean;
  gameMembers: IGameMember[];
  currentMemberCount: number;
  gameRoomStatus: string;
}
