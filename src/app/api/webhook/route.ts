import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request, res: NextResponse) {

  // // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  // const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY

  // if (!WEBHOOK_SECRET) {
  //   throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  // }

  // // Get the headers
  // const headerPayload = headers();
  // const svix_id = headerPayload.get("svix-id");
  // const svix_timestamp = headerPayload.get("svix-timestamp");
  // const svix_signature = headerPayload.get("svix-signature");

  // // If there are no headers, error out
  // if (!svix_id || !svix_timestamp || !svix_signature) {
  //   return new Response('Error occurred -- no svix headers', {
  //     status: 400
  //   })
  // }

  // // Get the body
  // const payload = await req.json()
  // const body = JSON.stringify(payload);

  // // Create a new Svix instance with your secret.
  // const wh = new Webhook(WEBHOOK_SECRET);

  // let evt: WebhookEvent

  // // Verify the payload with the headers
  // try {
  //   evt = wh.verify(body, {
  //     "svix-id": svix_id,
  //     "svix-timestamp": svix_timestamp,
  //     "svix-signature": svix_signature,
  //   }) as WebhookEvent
  // } catch (err) {
  //   console.error('Error verifying webhook:', err);
  //   return new Response('Error occured', {
  //     status: 400
  //   })
  // }

  // // Get the ID and type
  // const { id } = evt.data;
  // const eventType = evt.type;

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  // console.log('Webhook body:', body)

  // TODO: add web3 address to db
  // const user = await clerkClient.users.getUser(userId);
  // const walletId = user ? user.primaryWeb3WalletId : null;
  // const address = user
  //   ? user.web3Wallets.find((wallet) => wallet.id === walletId)
  //   : null;

  // switch (evt.type) {
  //   case 'session.created': {
  //     await db.insert(users).values({
  //       id: genUserId(),
  //       clerkUserId: userId,
  //       web3Address: address?.web3Wallet
  //     }).onConflictDoNothing()
  //   }
  //   case 'session.ended': {
  //     redirect('/')
  //   }
  // }

  // console.log(`user created: ${userId}`)
  return new NextResponse(null, { status: 200 })
}
