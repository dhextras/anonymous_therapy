export type User = {
  id: string;
};

export type Therapist = {
  id: string;
  name: string;
  code: string;
  total_conversations: number;
  last_login: Date;
};

export type TherapistData = {
  therapist: Therapist | null;
};

export type ActiveConversation = {
  id: string;
  user_name: string;
  user_message: string;
  therapist_name: string;
  therapist_id: string;
  started_at: Date;
};

export type PendingUser = {
  id: string;
  user_id: string;
  name: string;
  initial_message: string;
};

export type OnlineTherapist = {
  id: string;
  therapist_id: string;
  online_since: Date;
};
