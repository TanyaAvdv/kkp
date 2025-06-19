import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import contactRoutes from './routes/contact.routes';
import clientRoutes from './routes/client.routes';
import agentRoutes from './routes/agent.routes';
import estateRoutes from './routes/estate.routes';
import contractRoutes from './routes/contract.routes';
import offerRoutes from './routes/offer.routes';
import requestRoutes from './routes/request.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/estates', estateRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
