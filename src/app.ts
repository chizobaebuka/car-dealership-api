import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares/errorhandler.middleware';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express'; // Import Swagger specification
import swaggerSpec from './swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('dev'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


// Health check route
app.get('/health', (_req, res) => {
    res.send('🚗 Car Dealership API is runnings');
});

export default app;