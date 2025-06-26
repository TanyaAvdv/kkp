import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Contact } from "./Contact";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    client_id: number;

    @Column({ type: "enum", enum: ["tenant", "renter"] })
    typeofClient: "tenant" | "renter";

    @Column({ nullable: true })
    contact_id?: number;

    @ManyToOne(() => Contact, { nullable: true })
    @JoinColumn({ name: "contact_id" })
    contact?: Contact;
} 