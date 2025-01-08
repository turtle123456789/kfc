// utils/cors.js
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: '*', // You can specify a specific origin instead of '*'
});

// Helper function to run CORS middleware in API routes
export function runCors(req, res, next) {
  cors(req, res, (result) => {
    if (result instanceof Error) {
      return next(result);
    }
    next();
  });
}
