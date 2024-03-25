# Matters Forum

## Motivation

This is the [matters.town](https://matters.town/) coding challenge. It consists of two parts:

- [Code Challenge](./CodeChallenge.md)
- [Written Challenge](./WrittenChallenge.md)

The guide has asked to make something interesting, so I replicated some workflows that I would personally like to see if I were to make apps or improvements on top of the matters app. This app is fully deployed on [matters-forum.vercel.app](https://matters-forum.vercel.app)

Not to being critical on the current state of UI of matters, but I prefer something more lightweight and contentful that respond almost instantly to my perception, such as the [hackernews](https://news.ycombinator.com/) interface. I interact with it through an RSS reader interface, and if I would like to interact with the post, the individual item page isn't too clunky either. I want to recreate something lightweight but not lack of capturing the unique decentralized & uncensored content on matters.

## Architechture

![A Brief Architecture](./architecture.png)
This is a brief overview of the application.

With [viem.sh](https://viem.sh/), the `Curation` event on optimism is constantly indexed to the database once they were emitted, and a cron job that runs every 6 hours will also catch the ones that the `watchEvent` [function](https://viem.sh/docs/actions/public/watchEvent#watchevent) did not catch just in case.

When the users first access the page, they will see a hackernews-esque interface with page limit of `15` posts. The `More` button at the bottom will run the next page of posts. Some of the title may not load because I was using a free IPFS gateway, which is very unstable to public access. Things should work smoothly if switched over to the paid plans.

Once you click on the title of the post, it will lead you to the destinated IPFS content, just like the hackernews interface. Clicking on `<> comments` will lead you to the items page, which you would be able to write a reply if you connect your wallet to this app. You can also see others reply there.

You can check the database schema [here](./src/lib/db.schema.ts), but a brief overview will be 3 tables in postgres:

- curations
- comments
- users

## Key features

## Showcase

## Tech Stack

## Getting Started Locally

## Roadmap

## Contributing

To contribute, fork the repository and create a feature branch. Test your changes, and if possible, open an issue for discussion before submitting a pull request. Follow project guidelines, and welcome feedback to ensure a smooth integration of your contributions. Your pull requests are warmly welcome.
