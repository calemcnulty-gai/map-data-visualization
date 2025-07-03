#!/bin/bash

# Generate NEXTAUTH_SECRET for NextAuth.js

echo "Generating NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32)

echo ""
echo "Add this to your .env.local file:"
echo "NEXTAUTH_SECRET=$SECRET"
echo ""
echo "This secret is used to encrypt JWT tokens and should be kept secure." 