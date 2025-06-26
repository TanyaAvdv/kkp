import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`contact\` (
                \`contact_id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(20) NOT NULL,
                \`surname\` varchar(20) NOT NULL,
                \`father_name\` varchar(20) NOT NULL,
                \`document\` varchar(20) NOT NULL,
                \`telephone\` varchar(50) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`country\` varchar(100) NOT NULL,
                \`city\` varchar(100) NOT NULL,
                \`postal_code\` varchar(20) NOT NULL,
                \`street\` varchar(100) NOT NULL,
                \`placement_num\` varchar(100) NOT NULL,
                \`notes\` tinytext NULL,
                PRIMARY KEY (\`contact_id\`)
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`agent\` (
                \`agent_id\` int NOT NULL AUTO_INCREMENT,
                \`agent_rating\` varchar(20) NOT NULL,
                \`post_name\` varchar(30) NOT NULL,
                \`salary\` decimal(15,2) NOT NULL,
                \`currency\` char(3) NOT NULL DEFAULT 'USD',
                \`hiring_date\` timestamp NOT NULL,
                \`dismissal_date\` timestamp NULL,
                \`department_name\` varchar(30) NOT NULL,
                \`contact_id\` int NULL,
                PRIMARY KEY (\`agent_id\`),
                INDEX \`IDX_agent_contact\` (\`contact_id\`),
                CONSTRAINT \`FK_agent_contact\` FOREIGN KEY (\`contact_id\`) REFERENCES \`contact\`(\`contact_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`client\` (
                \`client_id\` int NOT NULL AUTO_INCREMENT,
                \`typeofClient\` enum('tenant', 'renter') NOT NULL,
                \`contact_id\` int NULL,
                PRIMARY KEY (\`client_id\`),
                INDEX \`IDX_client_contact\` (\`contact_id\`),
                CONSTRAINT \`FK_client_contact\` FOREIGN KEY (\`contact_id\`) REFERENCES \`contact\`(\`contact_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`estate\` (
                \`estate_id\` int NOT NULL AUTO_INCREMENT,
                \`estate_name\` varchar(20) NOT NULL,
                \`estate_status\` varchar(50) NOT NULL,
                \`estate_type\` varchar(50) NOT NULL,
                \`square\` decimal(10,2) NOT NULL,
                \`price\` decimal(15,2) NOT NULL,
                \`currency\` char(3) NOT NULL DEFAULT 'USD',
                \`country\` varchar(100) NOT NULL,
                \`city\` varchar(100) NOT NULL,
                \`postal_code\` varchar(20) NOT NULL,
                \`street\` varchar(100) NOT NULL,
                \`placement_num\` varchar(100) NOT NULL,
                \`estate_rating\` varchar(20) NOT NULL,
                \`notes\` tinytext NULL,
                \`agent_id\` int NULL,
                \`tenant_id\` int NULL,
                PRIMARY KEY (\`estate_id\`),
                INDEX \`IDX_estate_agent\` (\`agent_id\`),
                INDEX \`IDX_estate_tenant\` (\`tenant_id\`),
                CONSTRAINT \`FK_estate_agent\` FOREIGN KEY (\`agent_id\`) REFERENCES \`agent\`(\`agent_id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT \`FK_estate_tenant\` FOREIGN KEY (\`tenant_id\`) REFERENCES \`client\`(\`client_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`contract\` (
                \`contract_id\` int NOT NULL AUTO_INCREMENT,
                \`contract_name\` varchar(100) NOT NULL,
                \`contract_status\` varchar(50) NOT NULL,
                \`signing_date\` timestamp NOT NULL,
                \`validity_period\` timestamp NOT NULL,
                \`notes\` tinytext NULL,
                \`estate_id\` int NULL,
                \`agent_id\` int NULL,
                \`tenant_id\` int NULL,
                \`renter_id\` int NULL,
                PRIMARY KEY (\`contract_id\`),
                INDEX \`IDX_contract_estate\` (\`estate_id\`),
                INDEX \`IDX_contract_agent\` (\`agent_id\`),
                INDEX \`IDX_contract_tenant\` (\`tenant_id\`),
                INDEX \`IDX_contract_renter\` (\`renter_id\`),
                CONSTRAINT \`FK_contract_estate\` FOREIGN KEY (\`estate_id\`) REFERENCES \`estate\`(\`estate_id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT \`FK_contract_agent\` FOREIGN KEY (\`agent_id\`) REFERENCES \`agent\`(\`agent_id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT \`FK_contract_tenant\` FOREIGN KEY (\`tenant_id\`) REFERENCES \`client\`(\`client_id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT \`FK_contract_renter\` FOREIGN KEY (\`renter_id\`) REFERENCES \`client\`(\`client_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`request\` (
                \`request_id\` int NOT NULL AUTO_INCREMENT,
                \`request_name\` varchar(100) NOT NULL,
                \`request_date\` timestamp NOT NULL,
                \`request_type\` varchar(50) NOT NULL,
                \`square\` decimal(10,2) NOT NULL,
                \`price\` decimal(15,2) NOT NULL,
                \`currency\` char(3) NOT NULL DEFAULT 'USD',
                \`country\` varchar(100) NOT NULL,
                \`city\` varchar(100) NOT NULL,
                \`rental_period_months\` int NULL,
                \`notes\` tinytext NULL,
                \`client_id\` int NULL,
                PRIMARY KEY (\`request_id\`),
                INDEX \`IDX_request_client\` (\`client_id\`),
                CONSTRAINT \`FK_request_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`client\`(\`client_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);

        await queryRunner.query(`
            CREATE TABLE \`offer\` (
                \`offer_id\` int NOT NULL AUTO_INCREMENT,
                \`offer_name\` varchar(100) NOT NULL,
                \`offer_date\` timestamp NOT NULL,
                \`offer_type\` varchar(50) NOT NULL,
                \`client_feedback\` tinytext NULL,
                \`notes\` tinytext NULL,
                \`client_id\` int NULL,
                \`agent_id\` int NULL,
                PRIMARY KEY (\`offer_id\`),
                INDEX \`IDX_offer_client\` (\`client_id\`),
                INDEX \`IDX_offer_agent\` (\`agent_id\`),
                CONSTRAINT \`FK_offer_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`client\`(\`client_id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT \`FK_offer_agent\` FOREIGN KEY (\`agent_id\`) REFERENCES \`agent\`(\`agent_id\`) ON DELETE SET NULL ON UPDATE NO ACTION
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`offer\``);
        await queryRunner.query(`DROP TABLE \`request\``);
        await queryRunner.query(`DROP TABLE \`contract\``);
        await queryRunner.query(`DROP TABLE \`estate\``);
        await queryRunner.query(`DROP TABLE \`client\``);
        await queryRunner.query(`DROP TABLE \`agent\``);
        await queryRunner.query(`DROP TABLE \`contact\``);
    }
}
