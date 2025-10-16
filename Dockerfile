# Use a slim Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy starter-A project
COPY starter-A /app/starter-A

# Install starter-A dependencies and build
WORKDIR /app/starter-A
RUN npm ci
RUN npm run build

# Set the entrypoint to run the backtest by default
WORKDIR /app
ENTRYPOINT ["node", "starter-A/dist/orchestrator/backtest.js"]
CMD ["--config=starter-A/configs/technical-backtest.yaml"]