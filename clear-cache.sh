#!/bin/bash

echo "🧹 Clearing Next.js build cache..."

cd pharmacare

# Remove Next.js cache directories
rm -rf .next
rm -rf node_modules/.cache
rm -rf .vercel

# Clear npm cache
npm cache clean --force

echo "✅ Cache cleared successfully!"
echo "Now run: npm run build"