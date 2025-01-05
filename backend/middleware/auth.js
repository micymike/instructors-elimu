const jwt = require('jsonwebtoken');
const axios = require('axios');

class AuthGuard {
  constructor() {
    this.AUTH_SECRET = process.env.AUTH_SECRET || 'fallback_secret';
    this.CENTRALIZED_AUTH_URL = process.env.CENTRALIZED_AUTH_URL || 'https://centralize-auth-elimu.onrender.com';
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    
    try {
      console.log('🔐 Authentication Attempt', {
        method: request.method,
        path: request.path,
        headers: {
          authorization: request.headers['authorization'] ? 'Present' : 'Missing'
        }
      });

      const token = this.extractToken(request);
      const user = await this.validateToken(token);
      
      // Attach user to request
      request.user = {
        id: user.id || user.email,
        email: user.email,
        role: user.role || 'instructor'
      };

      console.log('✅ Authentication Successful', {
        userId: request.user.id,
        email: request.user.email,
        role: request.user.role
      });

      return true;
    } catch (error) {
      console.error('❌ Authentication Failed', {
        message: error.message,
        stack: error.stack
      });

      return false;
    }
  }

  extractToken(request) {
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    
    if (!authHeader) {
      console.warn('⚠️ No Authorization Header');
      throw new Error('No authorization header');
    }

    const authHeaderString = Array.isArray(authHeader) 
      ? authHeader[0] 
      : authHeader.toString();

    const tokenParts = authHeaderString.trim().split(/\s+/);
    
    if (tokenParts.length < 2 || 
        !['bearer', 'Bearer'].includes(tokenParts[0])) {
      console.warn('⚠️ Invalid Authorization Header Format', {
        authHeader: authHeaderString
      });
      throw new Error('Invalid authorization header format');
    }

    return tokenParts[1];
  }

  async validateToken(token) {
    try {
      // First, validate with external service
      const externalValidation = await this.validateTokenWithExternalService(token);
      
      if (externalValidation) {
        console.log('✅ External Token Validation Successful');
        return externalValidation;
      }

      // If external validation fails, try local JWT decoding
      const localDecoded = this.decodeJWTToken(token);
      console.log('✅ Local JWT Decoding Successful');
      return localDecoded;
    } catch (error) {
      console.error('❌ Token Validation Error', {
        message: error.message,
        stack: error.stack
      });
      throw new Error('Authentication failed');
    }
  }

  async validateTokenWithExternalService(token) {
    try {
      const response = await axios.post(
        `${this.CENTRALIZED_AUTH_URL}/auth/validate`, 
        { token }, 
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      // Check for different possible validation responses
      const isValid = response.data?.isValid || response.data?.valid || false;
      if (!isValid) {
        console.warn('⚠️ External Service Validation Failed', {
          responseData: response.data
        });
        return null;
      }

      // Extract user information
      const userData = response.data?.user || response.data;
      return {
        id: userData?.id || '',
        email: userData?.email || '',
        role: userData?.role || 'instructor'
      };
    } catch (error) {
      console.error('❌ External Token Validation Error', {
        message: error.message,
        errorResponse: error.response?.data
      });
      return null;
    }
  }

  decodeJWTToken(token) {
    try {
      const decoded = jwt.verify(token, this.AUTH_SECRET, { 
        algorithms: ['HS256'] 
      });

      return {
        id: decoded.sub || decoded.email || '',
        email: decoded.email || decoded.sub || '',
        role: decoded.role || 'instructor'
      };
    } catch (error) {
      console.error('❌ JWT Decoding Error', {
        message: error.message
      });
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = {
  AuthGuard: new AuthGuard()
};
