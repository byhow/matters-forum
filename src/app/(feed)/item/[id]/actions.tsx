"use server";

import z from "zod";
import {
  db,
  users,
  curations,
  comments,
  genCommentId,
  genUserId,
} from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { newCommentRateLimit } from "@/lib/rate-limit";

const ReplyActionSchema = z.object({
  curationId: z.string(),
  text: z.string().min(3).max(1000),
});

export type ReplyActionData = {
  address?: string;
  commentId?: string;
  error?:
    | {
        code: "INTERNAL_ERROR";
        message: string;
      }
    | {
        code: "VALIDATION_ERROR";
        fieldErrors: {
          [field: string]: string[];
        };
      }
    | {
        code: "RATE_LIMIT_ERROR";
        message: string;
      }
    | {
        code: "AUTH_ERROR";
        message: string;
      };
};

export async function replyAction(
  prevState: ReplyActionData,
  formData: FormData
): Promise<ReplyActionData> {
  if (!prevState.address) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "You must be logged in to reply.",
      },
    };
  }

  const clientForm = {
    curationId: formData.get("curationId"),
    text: formData.get("text"),
  };

  const data = ReplyActionSchema.safeParse(clientForm);

  if (!data.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        fieldErrors: data.error.flatten().fieldErrors,
      },
    };
  }

  let user = (
    await db
      .select()
      .from(users)
      .where(eq(users.web3Address, prevState.address))
      .limit(1)
  )[0];

  if (!user) {
    // first time user
    user = (
      await db
        .insert(users)
        .values({
          id: genUserId(),
          web3Address: prevState.address,
        })
        .returning()
    )[0];
  }

  const rl = await newCommentRateLimit.limit(user.id);

  if (!rl.success) {
    return {
      error: {
        code: "RATE_LIMIT_ERROR",
        message: "Too many comments. Try again later",
      },
    };
  }
  const commentId = genCommentId();
  await db.transaction(async (tx) => {
    try {
      const feed = (
        await tx
          .select({
            id: curations.id,
          })
          .from(curations)
          .where(eq(curations.id, data.data.curationId))
          .limit(1)
      )[0];

      if (!feed) {
        throw new Error("Curation not found");
      }

      await tx
        .update(curations)
        .set({
          commentCount: sql`${curations.commentCount} + 1`,
        })
        .where(eq(curations.id, feed.id));

      await tx.insert(comments).values({
        id: commentId,
        curationId: feed.id,
        author: user.id,
        comment: data.data.text,
      });

      revalidatePath(`/items/${feed.id}`);
      return {
        commentId,
      };
    } catch (err) {
      console.error(err);
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong",
        },
      };
    }
  });

  return {
    commentId,
  };
}
