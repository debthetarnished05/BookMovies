#!/bin/sh
set -e

export NODE_ENV=production

echo "Running startup scripts..."

npm run seed:theaters
npm run seed:movies
npm run seed:shows

echo "Starting backend server..."

exec pm2-runtime ecosystem.config.cjs