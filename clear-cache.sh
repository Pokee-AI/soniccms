#!/bin/bash

echo "🧹 Clearing Cloudflare Cache & Temporary Data"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Clearing Cloudflare Pages cache...${NC}"
npx wrangler pages deployment purge-cache

echo -e "${YELLOW}2. Checking for cache-related KV keys...${NC}"
# List all KV keys to see what's there
npx wrangler kv key list --binding KV --namespace-id c87f53f41bde4a1fa73bce6b74b673f7

echo -e "${GREEN}✅ Cache clearing complete!${NC}"
echo -e "${GREEN}Your data in D1 and R2 storage remains intact.${NC}"
