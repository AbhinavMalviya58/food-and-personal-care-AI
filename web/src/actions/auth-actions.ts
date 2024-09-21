"use server";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/constants/constants";

export async function createSession(userId: string) {
  cookies().set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60 * 60 * 24, // 30 days
    path: "/",
  });
}

export async function getSession() {
  const userId = cookies().get(SESSION_COOKIE_NAME);
  return userId;
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
