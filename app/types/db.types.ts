export type User = {
  id: string;
};

export type Therapist = {
  id: string;
  code: string;
  total_conversations: number;
};

export type ActiveConversation = {
  id: string;
  user_id: string;
  therapist_id: string;
  started_at: Date;
};

export type PendingUser = {
  user_id: string;
  name: string | null;
  initial_message: string | null;
};

export type OnlineTherapist = {
  id: string;
  therapist_id: string;
  online_since: Date;
};
