# Authentication Flow Testing Guide

## Prerequisites
- Ensure the backend server is running on `localhost:3000`
- Ensure the centralized auth service is accessible
- Have `curl` and `jq` installed

## Testing Steps

1. **Start the Backend Server**
   ```bash
   npm run start:dev
   ```

2. **Run Authentication Tests**
   ```bash
   ./test_auth_flow.sh
   ```

## Test Scenarios Covered
- Token Retrieval
- Token Validation
- Course Retrieval with Valid Token
- Course Creation with Valid Token
- Invalid Token Handling

## Troubleshooting
- Check network connectivity
- Verify credentials in the script
- Ensure all services are running

## Common Issues
- Invalid Credentials
- Network Connectivity Problems
- Service Unavailability

## Notes
- Replace placeholder email/password with actual credentials
- The script provides detailed error messages
