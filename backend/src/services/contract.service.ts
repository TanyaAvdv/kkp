import AppDataSource from '../config/database';
import { Contract } from '../entities/Contract';
import { Contract as ContractType } from '../types/entities';
import { MoreThan, Like, Between } from 'typeorm';

export class ContractService {
  private contractRepository = AppDataSource.getRepository(Contract);

  async findAll(): Promise<ContractType[]> {
    return await this.contractRepository.find({
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findById(id: number): Promise<ContractType | null> {
    return await this.contractRepository.findOne({
      where: { contract_id: id },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact']
    });
  }

  async create(contract: ContractType): Promise<number> {
    const newContract = this.contractRepository.create(contract);
    const savedContract = await this.contractRepository.save(newContract);
    return savedContract.contract_id;
  }

  async update(id: number, contract: Partial<ContractType>): Promise<boolean> {
    // Remove relations from contract object to avoid relation issues
    const { estate, agent, tenant, renter, ...contractData } = contract;
    const result = await this.contractRepository.update(id, contractData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.contractRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByStatus(status: string): Promise<ContractType[]> {
    return await this.contractRepository.find({
      where: { contract_status: status },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findByType(type: string): Promise<ContractType[]> {
    return await this.contractRepository.find({
      where: { contract_name: Like(`%${type}%`) },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findByClientId(clientId: number): Promise<ContractType[]> {
    return await this.contractRepository.find({
      where: [
        { tenant_id: clientId },
        { renter_id: clientId }
      ],
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findByEstateId(estateId: number): Promise<ContractType[]> {
    return await this.contractRepository.find({
      where: { estate_id: estateId },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findByAgentId(agentId: number): Promise<ContractType[]> {
    return await this.contractRepository.find({
      where: { agent_id: agentId },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findActive(): Promise<ContractType[]> {
    const now = new Date();
    return await this.contractRepository.find({
      where: {
        validity_period: MoreThan(now),
        contract_status: 'active'
      },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { contract_id: 'ASC' }
    });
  }

  async findExpiringSoon(days: number = 30): Promise<ContractType[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return await this.contractRepository.find({
      where: {
        validity_period: Between(now, futureDate),
        contract_status: 'active'
      },
      relations: ['estate', 'agent', 'agent.contact', 'tenant', 'tenant.contact', 'renter', 'renter.contact'],
      order: { validity_period: 'ASC' }
    });
  }
} 