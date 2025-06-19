import AppDataSource from '../config/database';
import { Request } from '../entities/Request';
import { Request as RequestType } from '../types/entities';

export class RequestService {
  private requestRepository = AppDataSource.getRepository(Request);

  async findAll(): Promise<RequestType[]> {
    return await this.requestRepository.find({
      relations: ['client', 'client.contact'],
      order: { request_date: 'DESC' }
    });
  }

  async findById(id: number): Promise<RequestType | null> {
    return await this.requestRepository.findOne({
      where: { request_id: id },
      relations: ['client', 'client.contact']
    });
  }

  async create(request: RequestType): Promise<number> {
    const newRequest = this.requestRepository.create(request);
    const savedRequest = await this.requestRepository.save(newRequest);
    return savedRequest.request_id;
  }

  async update(id: number, request: Partial<RequestType>): Promise<boolean> {
    // Remove client from request object to avoid relation issues
    const { client, ...requestData } = request;
    const result = await this.requestRepository.update(id, requestData);
    return result.affected ? result.affected > 0 : false;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.requestRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByType(type: string): Promise<RequestType[]> {
    return await this.requestRepository.find({
      where: { request_type: type },
      relations: ['client', 'client.contact'],
      order: { request_date: 'DESC' }
    });
  }

  async findByClientId(clientId: number): Promise<RequestType[]> {
    return await this.requestRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'client.contact'],
      order: { request_date: 'DESC' }
    });
  }
} 