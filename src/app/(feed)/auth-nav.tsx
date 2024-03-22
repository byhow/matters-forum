import Link from "next/link";
import { cookies } from "next/headers";
import { auth, SignInButton, UserButton } from "@clerk/nextjs";

export async function AuthNav() {
  // fast path to being logged out, no i/o needed
  if (!cookies().getAll().length) {
    return <LoggedOut />;
  }
  const { userId } = auth();

  if (!userId) {
    return <LoggedOut />;
  }

  return <UserButton />;
}

function LoggedOut() {
  return <Link href="/sign-in">Sign in</Link>;
}
