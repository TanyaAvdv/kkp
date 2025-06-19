import AppDataSource from '../config/database';
import { Estate } from '../entities/Estate';
import { Estate as EstateType } from '../types/entities';
import { Between } from 'typeorm';

export class EstateService {
  private estateRepository = AppDataSource.getRepository(Estate);

  async findAll(): Promise<EstateType[]> {
    return await this.estateRepository.find({
      relations: ['agent', 'agent.contact', 'tenant', 'tenant.contact'],
      order: { estate_id: 'ASC' }
    });
  }

  async findById(id: number): Promise<EstateType | null> {
    return await this.estateRepository.findOne({
      where: { estate_id: id },
      relations: ['agent', 'agent.contact', 'tenant', 'tenant.contact']
    });
  }

  async create(estate: EstateType): Promise<number> {
    const newEstate = this.estateRepository.create(estate);
    const savedEstate = await this.estateRepository.save(newEstate);
    return savedEstate.estate_id;
  }

  async update(id: number, estate: Partial<EstateType>): Promise<boolean> {
    // Remove relations from estate object to avoid relation issues
    const { agent, tenant, ...estateData } = estate;
    const result = await this.estateRepository.update(id, estateData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.estateRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByType(type: string): Promise<EstateType[]> {
    return await this.estateRepository.find({
      where: { estate_type: type },
      relations: ['agent', 'agent.contact', 'tenant', 'tenant.contact'],
      order: { estate_id: 'ASC' }
    });
  }

  async findByStatus(status: string): Promise<EstateType[]> {
    return await this.estateRepository.find({
      where: { estate_status: status },
      relations: ['agent', 'agent.contact', 'tenant', 'tenant.contact'],
      order: { estate_id: 'ASC' }
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<EstateType[]> {
    return await this.estateRepository.find({
      where: { 
        price: Between(minPrice, maxPrice)
      },
      relations: ['agent', 'agent.contact', 'tenant', 'tenant.contact'],
      order: { price: 'ASC' }
    });
  }
} 