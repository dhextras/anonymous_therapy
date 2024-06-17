import { supabase } from "./supabase.auth";

import type {
  User,
  Therapist,
  PendingUser,
  OnlineTherapist,
  ActiveConversation,
} from "~/types/db.types";

// User related Db functions
export const createUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.from("users").insert([{}]);
  if (error || !data) {
    return null;
  }
  return data as User;
};

export const createPendingUser = async (
  userId: string,
  name: string,
  initialMessage: string
): Promise<PendingUser | null> => {
  const { data, error } = await supabase
    .from("pending_users")
    .insert([{ user_id: userId, name: name, initialMessage: initialMessage }]);
  if (error || !data) {
    return null;
  }
  return data as PendingUser;
};

export const removePendingUser = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("pending_users")
    .delete()
    .eq("user_id", userId);
  if (error) {
    return false;
  }
  return true;
};

// Therapist related Db functions
export const getTherapistByCode = async (
  code: string
): Promise<Therapist | null> => {
  const { data, error } = await supabase
    .from("therapists")
    .select("*")
    .eq("code", code)
    .single();
  if (error || !data) {
    return null;
  }
  return data as Therapist;
};

export const createOnlineTherapist = async (
  therapistId: string
): Promise<OnlineTherapist | null> => {
  const { data, error } = await supabase
    .from("online_therapists")
    .insert([{ therapist_id: therapistId }]);
  if (error || !data) {
    return null;
  }
  return data as OnlineTherapist;
};

export const deleteOnlineTherapist = async (
  therapistId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("online_therapist")
    .delete()
    .eq("therapist_id", therapistId);
  if (error) {
    return false;
  }
  return true;
};

// Conversation related Db functions
export const createActiveConversation = async (
  conversationId: string
): Promise<ActiveConversation | null> => {
  const { data, error } = await supabase
    .from("active_conversation")
    .insert([{ id: conversationId }]);
  if (error || !data) {
    return null;
  }
  return data as ActiveConversation;
};

export const deleteActiveConversation = async (
  conversationId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("active_conversation")
    .delete()
    .eq("id", conversationId);
  if (error) {
    return false;
  }
  return true;
};

// TODO: Real time change listener Db functions
