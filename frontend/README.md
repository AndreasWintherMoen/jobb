# Bedpres Bot

This is the web application for Bedpres Bot. It's made in NextJS and is therefore both front and back-end in the same application. I'm using NextJS 13 with the app directory which is currently in beta. Thus, the pages and routing are located in the _app_ directory as opposed to _pages_ directory which was the standard for NextJS <= 12. This README won't provide more information about NextJS or SSG vs SSR vs CSR, so find a tutorial if necessary.

## How to run

1. Create a file \_.env.local*. See *.env.local.example\*. Ask me if you need database access. If you're going to send an SMS (used to send OTP when registering new users) you have to set up Twilio and add API keys to the application. It costs about $0.05 per SMS and you have to pay that yourself :) You get $15 or so for free, and you don't really need SMS support in most of the application, as most of it is handled in the serverless functions in the backend folder.

2.

```bash
npm i
```

3.

```bash
npm run dev
```
