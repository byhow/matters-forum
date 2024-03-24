"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyAction, type ReplyActionData } from "./actions";
import { Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function ReplyForm({ curationId }: { curationId: string }) {
  const account = useAccount();
  // console.log(`Account was fetched: ${JSON.stringify(account, null, 2)}`);
  const [state, formAction] = useFormState(replyAction, {
    address: account.address,
  });

  return (
    <form action={formAction}>
      <ReplyFormFields curationId={curationId} {...state} />
    </form>
  );
}

function ReplyFormFields({
  error,
  commentId,
  curationId,
}: ReplyActionData & {
  curationId: string;
}) {
  const { pending } = useFormStatus();
  const { openConnectModal } = useConnectModal();
  return (
    <div key={commentId} className="flex flex-col gap-2">
      <input type="hidden" name="curationId" value={curationId} />

      <div className="flex flex-col gap-1">
        <Textarea
          name="text"
          className="w-full bg-white text-base"
          placeholder="Write a reply..."
          rows={4}
          onKeyDown={(e) => {
            if (
              (e.ctrlKey || e.metaKey) &&
              (e.key === "Enter" || e.key === "NumpadEnter")
            ) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {!pending &&
        error &&
        "fieldErrors" in error &&
        error.fieldErrors.text != null ? (
          <div className="text-sm text-red-500">{error.fieldErrors.text}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Button disabled={pending} className="h-8 p-0 px-4">
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit
        </Button>
        {error &&
          "message" in error &&
          (error.code === "AUTH_ERROR" ? (
            <span className="text-sm text-red-500">
              You must{" "}
              <button
                className="text-red-800 hover:underline"
                onClick={openConnectModal}
                type="button"
              >
                connect your wallet
              </button>{" "}
              to reply.
            </span>
          ) : (
            <span className="text-sm text-red-500">{error.message}</span>
          ))}
      </div>
    </div>
  );
}
