# Playzap Mono Repo
This repository contains two independent modules: Encrypt/Decrypt and Mining.

Install Node Module - run npm install from root

then - npm install --save-dev @types/express


# 1. Encrypt/Decrypt

To run the encrypt/decrypt module: npm run start:encrypt-decrypt


# Core Logic

Uses AES-256-CBC encryption algorithm
Requires a 32-character ENCRYPTION_KEY in environment variables
Generates a random IV for each encryption to ensure uniqueness
Encryption returns both the encrypted data and IV in base64 format
Decryption requires both the IV and encrypted data to recover the plaintext

# 2. Mining

To run the mining module: npm run start:mining

# Core Logic

Users earn coins at a rate of COINS_PER_HOUR (default: 5)
Daily limits reset at UTC midnight
Users can claim up to MAX_CLAIM_LIMIT coins at once (default: 10)
System enforces DAILY_COIN_LIMIT to prevent excessive mining
Tracks user metrics including unclaimed coins, total earned coins, mining time, and claim count

Each module can be run independently using the provided npm commands.


                                                    
#Thanks for giving me this opportunity !!#
