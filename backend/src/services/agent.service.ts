import AppDataSource from '../config/database';
import { Agent } from '../entities/Agent';
import { Agent as AgentType } from '../types/entities';
import { Like } from 'typeorm';

export class AgentService {
  private agentRepository = AppDataSource.getRepository(Agent);

  async findAll(): Promise<AgentType[]> {
    return await this.agentRepository.find({
      relations: ['contact'],
      order: { agent_id: 'ASC' }
    });
  }

  async findById(id: number): Promise<AgentType | null> {
    return await this.agentRepository.findOne({
      where: { agent_id: id },
      relations: ['contact']
    });
  }

  async create(agent: Omit<AgentType, 'agent_id'>): Promise<number> {
    const newAgent = this.agentRepository.create(agent);
    const savedAgent = await this.agentRepository.save(newAgent);
    return savedAgent.agent_id;
  }

  async update(id: number, agent: Partial<AgentType>): Promise<boolean> {
    // Remove contact from agent object to avoid relation issues
    const { contact, ...agentData } = agent;
    const result = await this.agentRepository.update(id, agentData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.agentRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByDepartment(departmentName: string): Promise<AgentType[]> {
    return await this.agentRepository.find({
      where: { department_name: Like(`%${departmentName}%`) },
      relations: ['contact'],
      order: { agent_id: 'ASC' }
    });
  }
} 