#!/bin/bash

# Exit on any error
set -e

# Build the application
npm run build

# Start the production server
npm run start:prod
