import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { Contact } from '../entities/Contact';
import { Client } from '../entities/Client';
import { Agent } from '../entities/Agent';
import { Estate } from '../entities/Estate';
import { Contract } from '../entities/Contract';
import { Request as RequestEntity } from '../entities/Request';
import { Offer } from '../entities/Offer';

export class DashboardController {
  // Загальна статистика
  static async getOverallStats(req: Request, res: Response) {
    try {
      const contactRepo = AppDataSource.getRepository(Contact);
      const clientRepo = AppDataSource.getRepository(Client);
      const agentRepo = AppDataSource.getRepository(Agent);
      const estateRepo = AppDataSource.getRepository(Estate);
      const contractRepo = AppDataSource.getRepository(Contract);
      const requestRepo = AppDataSource.getRepository(RequestEntity);
      const offerRepo = AppDataSource.getRepository(Offer);

      const [contacts, clients, agents, estates, contracts, requests, offers] = await Promise.all([
        contactRepo.count(),
        clientRepo.count(),
        agentRepo.count(),
        estateRepo.count(),
        contractRepo.count(),
        requestRepo.count(),
        offerRepo.count()
      ]);

      const stats = {
        contacts,
        clients,
        estates,
        contracts,
        requests,
        offers,
        agents
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching overall stats:', error);
      res.status(500).json({ error: 'Failed to fetch overall statistics' });
    }
  }

  // Статистика по клієнтах
  static async getClientStats(req: Request, res: Response) {
    try {
      const clientRepo = AppDataSource.getRepository(Client);
      
      const result = await clientRepo
        .createQueryBuilder('client')
        .select('client.typeofClient', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('client.typeofClient')
        .getRawMany();
      
      const stats = {
        byType: result.reduce((acc: any, row: any) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {})
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching client stats:', error);
      res.status(500).json({ error: 'Failed to fetch client statistics' });
    }
  }

  // Статистика по нерухомості
  static async getEstateStats(req: Request, res: Response) {
    try {
      const estateRepo = AppDataSource.getRepository(Estate);

      const [byType, byStatus, pricing, avgSquare] = await Promise.all([
        estateRepo
          .createQueryBuilder('estate')
          .select('estate.estate_type', 'type')
          .addSelect('COUNT(*)', 'count')
          .groupBy('estate.estate_type')
          .getRawMany(),
        
        estateRepo
          .createQueryBuilder('estate')
          .select('estate.estate_status', 'status')
          .addSelect('COUNT(*)', 'count')
          .groupBy('estate.estate_status')
          .getRawMany(),
        
        estateRepo
          .createQueryBuilder('estate')
          .select('AVG(estate.price)', 'avg_price')
          .addSelect('MIN(estate.price)', 'min_price')
          .addSelect('MAX(estate.price)', 'max_price')
          .getRawOne(),
        
        estateRepo
          .createQueryBuilder('estate')
          .select('AVG(estate.square)', 'avg_square')
          .getRawOne()
      ]);

      const stats = {
        byType: byType.reduce((acc: any, row: any) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {}),
        byStatus: byStatus.reduce((acc: any, row: any) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {}),
        pricing: {
          average: parseFloat(pricing.avg_price) || 0,
          minimum: parseFloat(pricing.min_price) || 0,
          maximum: parseFloat(pricing.max_price) || 0
        },
        averageSquare: parseFloat(avgSquare.avg_square) || 0
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching estate stats:', error);
      res.status(500).json({ error: 'Failed to fetch estate statistics' });
    }
  }

  // Статистика по контрактах
  static async getContractStats(req: Request, res: Response) {
    try {
      const contractRepo = AppDataSource.getRepository(Contract);
      const now = new Date();

      const [byStatus, active, expired, monthlyTrend] = await Promise.all([
        contractRepo
          .createQueryBuilder('contract')
          .select('contract.contract_status', 'status')
          .addSelect('COUNT(*)', 'count')
          .groupBy('contract.contract_status')
          .getRawMany(),
        
        contractRepo
          .createQueryBuilder('contract')
          .where('contract.validity_period > :now', { now })
          .getCount(),
        
        contractRepo
          .createQueryBuilder('contract')
          .where('contract.validity_period <= :now', { now })
          .getCount(),
        
        contractRepo
          .createQueryBuilder('contract')
          .select("DATE_FORMAT(contract.signing_date, '%Y-%m')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('contract.signing_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)')
          .groupBy("DATE_FORMAT(contract.signing_date, '%Y-%m')")
          .orderBy('month')
          .getRawMany()
      ]);

      const stats = {
        byStatus: byStatus.reduce((acc: any, row: any) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {}),
        active,
        expired,
        monthlyTrend: monthlyTrend.map((row: any) => ({
          month: row.month,
          count: parseInt(row.count)
        }))
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching contract stats:', error);
      res.status(500).json({ error: 'Failed to fetch contract statistics' });
    }
  }

  // Статистика по запитах
  static async getRequestStats(req: Request, res: Response) {
    try {
      const requestRepo = AppDataSource.getRepository(RequestEntity);

      const [byType, monthlyTrend, avgPrice, byCurrency] = await Promise.all([
        requestRepo
          .createQueryBuilder('request')
          .select('request.request_type', 'type')
          .addSelect('COUNT(*)', 'count')
          .groupBy('request.request_type')
          .getRawMany(),
        
        requestRepo
          .createQueryBuilder('request')
          .select("DATE_FORMAT(request.request_date, '%Y-%m')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('request.request_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
          .groupBy("DATE_FORMAT(request.request_date, '%Y-%m')")
          .orderBy('month')
          .getRawMany(),
        
        requestRepo
          .createQueryBuilder('request')
          .select('AVG(request.price)', 'avg_price')
          .getRawOne(),
        
        requestRepo
          .createQueryBuilder('request')
          .select('request.currency', 'currency')
          .addSelect('COUNT(*)', 'count')
          .groupBy('request.currency')
          .getRawMany()
      ]);

      const stats = {
        byType: byType.reduce((acc: any, row: any) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {}),
        monthlyTrend: monthlyTrend.map((row: any) => ({
          month: row.month,
          count: parseInt(row.count)
        })),
        averagePrice: parseFloat(avgPrice.avg_price) || 0,
        byCurrency: byCurrency.reduce((acc: any, row: any) => {
          acc[row.currency] = parseInt(row.count);
          return acc;
        }, {})
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching request stats:', error);
      res.status(500).json({ error: 'Failed to fetch request statistics' });
    }
  }

  // Статистика по пропозиціях
  static async getOfferStats(req: Request, res: Response) {
    try {
      const offerRepo = AppDataSource.getRepository(Offer);

      const [byType, monthlyTrend] = await Promise.all([
        offerRepo
          .createQueryBuilder('offer')
          .select('offer.offer_type', 'type')
          .addSelect('COUNT(*)', 'count')
          .groupBy('offer.offer_type')
          .getRawMany(),
        
        offerRepo
          .createQueryBuilder('offer')
          .select("DATE_FORMAT(offer.offer_date, '%Y-%m')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('offer.offer_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
          .groupBy("DATE_FORMAT(offer.offer_date, '%Y-%m')")
          .orderBy('month')
          .getRawMany()
      ]);

      const stats = {
        byType: byType.reduce((acc: any, row: any) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {}),
        monthlyTrend: monthlyTrend.map((row: any) => ({
          month: row.month,
          count: parseInt(row.count)
        }))
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching offer stats:', error);
      res.status(500).json({ error: 'Failed to fetch offer statistics' });
    }
  }

  // Нещодавна активність
  static async getRecentActivities(req: Request, res: Response) {
    try {
      const contractRepo = AppDataSource.getRepository(Contract);
      const requestRepo = AppDataSource.getRepository(RequestEntity);
      const offerRepo = AppDataSource.getRepository(Offer);

      const [recentContracts, recentRequests, recentOffers] = await Promise.all([
        contractRepo.find({
          order: { signing_date: 'DESC' },
          take: 5,
          relations: ['estate', 'agent', 'agent.contact']
        }),
        requestRepo.find({
          order: { request_date: 'DESC' },
          take: 5,
          relations: ['client', 'client.contact']
        }),
        offerRepo.find({
          order: { offer_date: 'DESC' },
          take: 5,
          relations: ['client', 'client.contact', 'agent', 'agent.contact']
        })
      ]);

      const activities = [
        ...recentContracts.map(contract => ({
          type: 'contract',
          id: contract.contract_id,
          title: contract.contract_name,
          date: contract.signing_date,
          description: `Contract signed for ${contract.estate?.estate_name || 'property'}`
        })),
        ...recentRequests.map(request => ({
          type: 'request',
          id: request.request_id,
          title: request.request_name,
          date: request.request_date,
          description: `New ${request.request_type} request`
        })),
        ...recentOffers.map(offer => ({
          type: 'offer',
          id: offer.offer_id,
          title: offer.offer_name,
          date: offer.offer_date,
          description: `New ${offer.offer_type} offer`
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      res.json(activities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ error: 'Failed to fetch recent activities' });
    }
  }
} 