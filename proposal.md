# What to be built

My development flow is really as going along the way. For this particular problem statement, I think it'd be valuable to sort and categorize the Curation event metadata in a way so that other services or applications can take advantages of, sort of like an enhanced version of etherscan or in this case since it is deployed on OP, the Optimism explorer.

The first thing that comes to mind is a ranking system , just like the default requirement stated, based on the donation amount given a time period. For example, if I can index and store this curation event resource based on the IPFS events, that will be something useful.

But then I thought: you can probably do that with just the etherscan API. Why bother reinventing the wheel. What is most intersting for a platform is the content, and end users don't care about which 64-bit addresses the donor has or what price the content has (or maybe, we can add a filter for that anyways).

Since I read hackernews everyday on my RSS reader of choice, it'd be great to bring in that type of interface here. Since all content on Matters is public anyways (the ipfs CID are all visible on chain), there's no point paywalling it or add subscription plan like the Economist. All the UGCs on the platform doesn't make sense for this profit model either.

We can take advantage of this and let the user decide what comes first in their feed. The upvote/downvote feature comes really handy here, but we'd also need a way to validate users to be real person and not a bot, a hardworking clickfarm operater (respectfully grinding their way up in an very brutal societal setting) or Devin. Luckily in the web3 space, we have a great tool against the dead internet theory, which is our ETH addresses + some traces we can get interacting on the matters platform.

That being said, it is time to set some requirements and scope for this project. There are three crucial component that I hope to bring in to this project:

- Auth + user profile layer to comment/upvote posts
- Indexer to listen to events and index CID + prices to persistency
- Responsive frontend to filter/search/sort data sources

I have around 30 hours of time to work on this until Sunday 11:59pm on Mar. 24th, and for some simple project management, a rough estimate for this roadmap:

- [x] 2hr on scaffolding everything and make initial deployment
- [x] (mvp done) 6hr on IPFS indexer (a separate service) 
- [x] 6hr on a skeleton platform (sorting, searching, etc)
- [x] 6hr on Auth + web address verification
- [ ] 6hr on integration
- [ ] 4hr leeway

And I probably won't be able to work the full 30 hours time anyways, but the plan will looks like this. A rough pick on the tech stack:

- Next.js + server actions
- Drizzle + supabase for backend
- Clerk for metamask sign-in

For an MVP, let's start with:

- minimal websocket indexer to index events ✅
  - along with a title for the CID (experimental)
- fullstack app:
  - frontend to get posts from db
  - backend api for default sorting by blocknumber

Project Architecture
- auth: no protected route, just need to connect wallet to comment
  - also show posts that the connected wallet user has (fake login)
- db: postgres on supabase + drizzle
- cache: vercel kv + upstash rate-limit lib
- web3 layer: 
- ipfs: helia, kind of the only option here
- payment? if any
- ui: tailwind shadcn + lucide

3/21
Ran into some crazy vercel issue that doesn't emit any logs and unable to find package.json. I have to remove all the api routes at this moment to fix it, but it happens on and off for now reasons.