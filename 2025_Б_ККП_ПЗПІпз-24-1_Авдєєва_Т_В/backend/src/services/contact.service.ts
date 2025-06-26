import AppDataSource from '../config/database';
import { Contact } from '../entities/Contact';
import { Contact as ContactType } from '../types/entities';
export class ContactService {
  private contactRepository = AppDataSource.getRepository(Contact);
  async findAll(): Promise<ContactType[]> {
    return await this.contactRepository.find({
      order: { contact_id: 'ASC' }
    });
  }
  async findById(id: number): Promise<ContactType | null> {
    return await this.contactRepository.findOne({
      where: { contact_id: id }
    });
  }
  async create(contact: ContactType): Promise<number> {
    const newContact = this.contactRepository.create(contact);
    const savedContact = await this.contactRepository.save(newContact);
    return savedContact.contact_id;
  }
  async update(id: number, contact: Partial<ContactType>): Promise<boolean> {
    const result = await this.contactRepository.update(id, contact);
    return result.affected ? result.affected > 0 : false;
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.contactRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 