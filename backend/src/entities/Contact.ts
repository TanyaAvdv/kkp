import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    contact_id: number;

    @Column({ type: "varchar", length: 20 })
    name: string;

    @Column({ type: "varchar", length: 20 })
    surname: string;

    @Column({ type: "varchar", length: 20 })
    father_name: string;

    @Column({ type: "varchar", length: 20 })
    document: string;

    @Column({ type: "varchar", length: 50 })
    telephone: string;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "varchar", length: 100 })
    country: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "varchar", length: 20 })
    postal_code: string;

    @Column({ type: "varchar", length: 100 })
    street: string;

    @Column({ type: "varchar", length: 100 })
    placement_num: string;

    @Column({ type: "tinytext", nullable: true })
    notes?: string;
} 