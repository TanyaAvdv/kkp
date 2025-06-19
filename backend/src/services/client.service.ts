import AppDataSource from '../config/database';
import { Client } from '../entities/Client';
import { Client as ClientType } from '../types/entities';

export class ClientService {
  private clientRepository = AppDataSource.getRepository(Client);

  async findAll(): Promise<ClientType[]> {
    return await this.clientRepository.find({
      relations: ['contact'],
      order: { client_id: 'ASC' }
    });
  }

  async findById(id: number): Promise<ClientType | null> {
    return await this.clientRepository.findOne({
      where: { client_id: id },
      relations: ['contact']
    });
  }

  async create(client: ClientType): Promise<number> {
    const newClient = this.clientRepository.create(client);
    const savedClient = await this.clientRepository.save(newClient);
    return savedClient.client_id;
  }

  async update(id: number, client: Partial<ClientType>): Promise<boolean> {
    // Remove contact from client object to avoid relation issues
    const { contact, ...clientData } = client;
    const result = await this.clientRepository.update(id, clientData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.clientRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByType(type: 'tenant' | 'renter'): Promise<ClientType[]> {
    return await this.clientRepository.find({
      where: { typeofClient: type },
      relations: ['contact'],
      order: { client_id: 'ASC' }
    });
  }
} 