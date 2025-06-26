import { Router, RequestHandler } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Загальна статистика
router.get('/stats/overall', DashboardController.getOverallStats as RequestHandler);

// Статистика по клієнтах
router.get('/stats/clients', DashboardController.getClientStats as RequestHandler);

// Статистика по нерухомості
router.get('/stats/estates', DashboardController.getEstateStats as RequestHandler);

// Статистика по контрактах
router.get('/stats/contracts', DashboardController.getContractStats as RequestHandler);

// Статистика по запитах
router.get('/stats/requests', DashboardController.getRequestStats as RequestHandler);

// Статистика по пропозиціях
router.get('/stats/offers', DashboardController.getOfferStats as RequestHandler);



// Останні активності
router.get('/stats/recent-activities', DashboardController.getRecentActivities as RequestHandler);

export default router; 