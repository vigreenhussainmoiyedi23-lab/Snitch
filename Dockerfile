FROM node:22-alpine
WORKDIR /app
COPY ./backend ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]