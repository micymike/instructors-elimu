#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
EMAIL="mosesmichael878@gmail.com"
TOKEN_FILE="/tmp/elimu_auth_token.json"
AUTH_URL="https://centralize-auth-elimu.onrender.com"
BACKEND_URL="http://localhost:3000"

# Function to check if token is valid
is_token_valid() {
    local token_file="$1"
    
    # If token file doesn't exist, return false
    if [ ! -f "$token_file" ]; then
        return 1
    fi
    
    # Extract expiration and current timestamp
    local exp=$(jq -r '.exp' "$token_file")
    local current_timestamp=$(date +%s)
    
    # Check if token is expired
    if [ "$current_timestamp" -ge "$exp" ]; then
        return 1
    fi
    
    return 0
}

# Function to get new token
get_new_token() {
    local email="$1"
    local token_file="$2"
    
    echo -e "${YELLOW}Attempting to get token for $email${NC}"
    
    # Login and capture the full response
    local login_response=$(curl -s -X POST "$AUTH_URL/auth/login/instructor" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$email\",\"password\":\"mikemoses\"}")
    
    # Check if login was successful
    local access_token=$(echo "$login_response" | jq -r '.access_token')
    local user_email=$(echo "$login_response" | jq -r '.user.email')
    local token_exp=$(echo "$login_response" | jq -r '.exp')
    
    if [ -z "$access_token" ] || [ "$access_token" == "null" ]; then
        echo -e "${RED}Failed to obtain token${NC}"
        return 1
    fi
    
    # Store token details in file
    echo "{
        \"access_token\": \"$access_token\",
        \"email\": \"$user_email\",
        \"exp\": $(($(date +%s) + 86400))
    }" > "$token_file"
    
    echo -e "${GREEN}New token obtained and saved${NC}"
    return 0
}

# Main script
main() {
    # Check if valid token exists
    if ! is_token_valid "$TOKEN_FILE"; then
        if ! get_new_token "$EMAIL" "$TOKEN_FILE"; then
            exit 1
        fi
    fi
    
    # Read token from file
    ACCESS_TOKEN=$(jq -r '.access_token' "$TOKEN_FILE")
    
    echo -e "\n${GREEN}Using stored token${NC}"
    
    # Decode JWT token
    echo -e "\n${YELLOW}Decoded Token:${NC}"
    echo "$ACCESS_TOKEN" | cut -d. -f2 | base64 -d | jq .
    
    # Validate Token
    echo -e "\nValidating token"
    VALIDATION_RESPONSE=$(curl -s -X POST "$AUTH_URL/auth/validate" \
      -H "Content-Type: application/json" \
      -d "{\"token\":\"$ACCESS_TOKEN\"}")
    
    echo -e "${YELLOW}Full Validation Response:${NC}"
    echo "$VALIDATION_RESPONSE" | jq .
    
    # Backend Course Retrieval
    echo -e "\nTesting course retrieval"
    COURSE_RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/courses/all" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json")
    
    echo -e "${YELLOW}Full Course Retrieval Response:${NC}"
    echo "$COURSE_RESPONSE" | jq .
    
    # Course Creation Test
    echo -e "\nTesting course creation"
    COURSE_CREATE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/courses" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Test Course",
        "description": "Automated test course creation",
        "category": "Test"
      }')
    
    echo -e "${YELLOW}Full Course Creation Response:${NC}"
    echo "$COURSE_CREATE_RESPONSE" | jq .
    
    # Additional Debugging
    echo -e "\nDebugging Information:"
    echo "Login Email: $EMAIL"
    echo "Access Token Length: ${#ACCESS_TOKEN}"
    echo "Token First 10 Chars: ${ACCESS_TOKEN:0:10}..."
    
    # Test course creation
    echo -e "\nTesting course creation"
    CREATION_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/courses" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Test Course from Auth Flow Test",
        "description": "A course created during authentication testing",
        "category": "Testing",
        "level": "Beginner",
        "duration": "2 hours",
        "price": 0,
        "subject": "Authentication Testing"
    }')
    
    echo -e "${YELLOW}Full Course Creation Response:${NC}"
    echo "$CREATION_RESPONSE" | jq .
    
    # Test invalid token scenarios
    echo -e "\nTesting invalid token scenarios"
    
    # Test with no token
    echo -e "Testing request without token:"
    NO_TOKEN_RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/courses/all" \
      -H "Content-Type: application/json")
    
    echo -e "${YELLOW}No Token Full Response:${NC}"
    echo "$NO_TOKEN_RESPONSE" | jq .
    
    # Test with invalid token
    echo -e "Testing request with invalid token:"
    INVALID_TOKEN_RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/courses/all" \
      -H "Authorization: Bearer invalid_token_123" \
      -H "Content-Type: application/json")
    
    echo -e "${YELLOW}Invalid Token Full Response:${NC}"
    echo "$INVALID_TOKEN_RESPONSE" | jq .
}

# Run main function
main
