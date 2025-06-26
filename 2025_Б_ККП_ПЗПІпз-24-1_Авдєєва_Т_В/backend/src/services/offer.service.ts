import AppDataSource from '../config/database';
import { Offer } from '../entities/Offer';
import { Offer as OfferType } from '../types/entities';

export class OfferService {
  private offerRepository = AppDataSource.getRepository(Offer);

  async findAll(): Promise<OfferType[]> {
    return await this.offerRepository.find({
      relations: ['client', 'client.contact', 'agent', 'agent.contact'],
      order: { offer_date: 'DESC' }
    });
  }

  async findById(id: number): Promise<OfferType | null> {
    return await this.offerRepository.findOne({
      where: { offer_id: id },
      relations: ['client', 'client.contact', 'agent', 'agent.contact']
    });
  }

  async create(offer: Omit<OfferType, 'offer_id'>): Promise<number> {
    const newOffer = this.offerRepository.create(offer);
    const savedOffer = await this.offerRepository.save(newOffer);
    return savedOffer.offer_id;
  }

  async update(id: number, offer: Partial<OfferType>): Promise<boolean> {
    // Remove relations from offer object to avoid relation issues
    const { client, agent, ...offerData } = offer;
    const result = await this.offerRepository.update(id, offerData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.offerRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByType(type: string): Promise<OfferType[]> {
    return await this.offerRepository.find({
      where: { offer_type: type },
      relations: ['client', 'client.contact', 'agent', 'agent.contact'],
      order: { offer_date: 'DESC' }
    });
  }

  async findByClientId(clientId: number): Promise<OfferType[]> {
    return await this.offerRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'client.contact', 'agent', 'agent.contact'],
      order: { offer_date: 'DESC' }
    });
  }

  async findByAgentId(agentId: number): Promise<OfferType[]> {
    return await this.offerRepository.find({
      where: { agent_id: agentId },
      relations: ['client', 'client.contact', 'agent', 'agent.contact'],
      order: { offer_date: 'DESC' }
    });
  }
} 