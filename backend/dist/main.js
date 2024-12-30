"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const compression = require("compression");
const bodyParser = require("body-parser");
async function bootstrap() {
    const memoryLimit = 450 * 1024 * 1024;
    process.on('warning', e => console.warn(e.stack));
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn'],
        bodyParser: true,
    });
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(compression());
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.use((req, res, next) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            console.log('Raw request body:', data);
        });
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        validateCustomDecorators: true,
        stopAtFirstError: true,
        enableDebugMessages: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        validationError: { target: false },
    }));
    app.use(compression());
    const authMiddleware = require('../middleware/auth');
    app.use((req, res, next) => {
        console.log('Request URL:', req.url);
        console.log('Request Method:', req.method);
        console.log('Request Headers:', req.headers);
        if (req.body)
            console.log('Request Body:', req.body);
        if (req.url.startsWith('/api/courses') ||
            req.url.startsWith('/api/course-generation') ||
            req.url.startsWith('/api/auth/login') ||
            req.url.startsWith('/api/auth/register')) {
            return next();
        }
        authMiddleware(req, res, next);
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
}
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map