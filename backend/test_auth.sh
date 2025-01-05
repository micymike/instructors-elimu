#!/bin/bash

# Centralized Auth Service URL
AUTH_URL="https://centralize-auth-elimu.onrender.com"

# Backend URL
BACKEND_URL="http://localhost:3000"

# Function to get a token
get_token() {
    local email=$1
    local password=$2
    
    echo "🔐 Attempting to get token for $email"
    
    # Use curl to get token from centralized auth service
    TOKEN=$(curl -s -X POST "$AUTH_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        | jq -r '.token')
    
    echo "$TOKEN"
}

# Function to test course retrieval
test_course_retrieval() {
    local token=$1
    
    echo "🔍 Testing course retrieval"
    
    RESPONSE=$(curl -s -X GET "$BACKEND_URL/api/courses/all" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token")
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
}

# Function to test course creation
test_course_creation() {
    local token=$1
    
    echo "➕ Testing course creation"
    
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/courses" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d '{
            "title": "Test Course",
            "description": "A course created during authentication testing",
            "category": "Testing",
            "level": "Beginner"
        }')
    
    echo "Response:"
    echo "$RESPONSE" | jq '.'
}

# Main script
main() {
    # Email and password (replace with actual credentials)
    EMAIL="mosesmichael878@gmail.com"
    PASSWORD="your_password_here"
    
    # Get token
    TOKEN=$(get_token "$EMAIL" "$PASSWORD")
    
    if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
        echo "❌ Failed to obtain token"
        exit 1
    fi
    
    echo "✅ Token obtained successfully"
    
    # Test course retrieval
    test_course_retrieval "$TOKEN"
    
    # Test course creation
    test_course_creation "$TOKEN"
}

# Run the main function
main
