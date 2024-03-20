import { db } from "@/lib/db";
import { curations } from "@/lib/db/schema";
import { count } from "drizzle-orm";
export default async function Home() {
  const res = await db.select({ value: count() }).from(curations);
  return <p>Hello from supabase! Current event count: {res[0].value}</p>;
}
