FROM mhart/apline-node:8

COPY src node_modules index.js /app

ENV TWITTER_ACCESS_TOKEN_KEY=$TWITTER_ACCESS_TOKEN_KEY
ENV TWITTER_ACCESS_TOKEN_SECRET=$TWITTER_ACCESS_TOKEN_SECRET
ENV TWITTER_CONSUMER_KEY=$TWITTER_CONSUMER_KEY
ENV TWITTER_CONSUMER_SECRET=$TWITTER_CONSUMER_SECRET

ENTRYPOINT node /app/index.js