import Link from "next/link";
import { cookies } from "next/headers";
import { auth, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export async function AuthNav() {
  // fast path to being logged out, no i/o needed
  if (!cookies().getAll().length) {
    return <LoggedOut />;
  }
  const { userId } = auth();

  if (!userId) {
    return <LoggedOut />;
  }

  return <UserButton afterSignOutUrl="/" />;
}

function LoggedOut() {
  return (
    <Link href={"/sign-in"}>
      <Button>
        Login to get Started!
        <LogIn className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
}
