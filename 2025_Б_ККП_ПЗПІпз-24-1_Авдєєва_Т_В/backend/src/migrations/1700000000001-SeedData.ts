import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedData1700000000001 implements MigrationInterface {
    name = 'SeedData1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`contact\` (\`name\`, \`surname\`, \`father_name\`, \`document\`, \`telephone\`, \`email\`, \`country\`, \`city\`, \`postal_code\`, \`street\`, \`placement_num\`, \`notes\`) VALUES
            ('John', 'Smith', 'Michael', 'ID12345678', '+1-555-0101', 'john.smith@email.com', 'USA', 'New York', '10001', 'Broadway', '123', 'Primary contact'),
            ('Emma', 'Johnson', 'David', 'ID87654321', '+1-555-0102', 'emma.johnson@email.com', 'USA', 'Los Angeles', '90210', 'Sunset Blvd', '456', 'VIP client'),
            ('Michael', 'Brown', 'Robert', 'ID11223344', '+1-555-0103', 'michael.brown@email.com', 'USA', 'Chicago', '60601', 'Michigan Ave', '789', NULL),
            ('Sarah', 'Davis', 'William', 'ID44332211', '+1-555-0104', 'sarah.davis@email.com', 'USA', 'Houston', '77001', 'Main St', '101', 'Preferred contact time: evenings'),
            ('James', 'Wilson', 'Thomas', 'ID55667788', '+1-555-0105', 'james.wilson@email.com', 'USA', 'Phoenix', '85001', 'Central Ave', '202', NULL),
            ('Lisa', 'Garcia', 'Carlos', 'ID99887766', '+1-555-0106', 'lisa.garcia@email.com', 'USA', 'Philadelphia', '19101', 'Market St', '303', 'Spanish speaking'),
            ('Robert', 'Martinez', 'Jose', 'ID77885544', '+1-555-0107', 'robert.martinez@email.com', 'USA', 'San Antonio', '78201', 'Commerce St', '404', NULL),
            ('Jennifer', 'Anderson', 'Paul', 'ID33445566', '+1-555-0108', 'jennifer.anderson@email.com', 'USA', 'San Diego', '92101', 'Harbor Dr', '505', 'Real estate investor'),
            ('David', 'Taylor', 'Mark', 'ID66554433', '+1-555-0109', 'david.taylor@email.com', 'USA', 'Dallas', '75201', 'Elm St', '606', NULL),
            ('Jessica', 'Thomas', 'Steven', 'ID22334455', '+1-555-0110', 'jessica.thomas@email.com', 'USA', 'Austin', '73301', 'Congress Ave', '707', 'First-time buyer')
        `);

        await queryRunner.query(`
            INSERT INTO \`agent\` (\`agent_rating\`, \`post_name\`, \`salary\`, \`currency\`, \`hiring_date\`, \`dismissal_date\`, \`department_name\`, \`contact_id\`) VALUES
            ('5', 'Senior Agent', 75000.00, 'USD', '2020-01-15 09:00:00', NULL, 'Sales', 1),
            ('4', 'Agent', 65000.00, 'USD', '2021-03-22 09:00:00', NULL, 'Sales', 2),
            ('4', 'Junior Agent', 45000.00, 'USD', '2022-06-10 09:00:00', NULL, 'Rentals', 3),
            ('5', 'Team Lead', 85000.00, 'USD', '2019-11-05 09:00:00', NULL, 'Sales', 4),
            ('3', 'Agent', 55000.00, 'USD', '2023-01-20 09:00:00', NULL, 'Rentals', 5)
        `);

        await queryRunner.query(`
            INSERT INTO \`client\` (\`typeofClient\`, \`contact_id\`) VALUES
            ('tenant', 6),
            ('renter', 7),
            ('tenant', 8),
            ('renter', 9),
            ('tenant', 10)
        `);

        await queryRunner.query(`
            INSERT INTO \`estate\` (\`estate_name\`, \`estate_status\`, \`estate_type\`, \`square\`, \`price\`, \`currency\`, \`country\`, \`city\`, \`postal_code\`, \`street\`, \`placement_num\`, \`estate_rating\`, \`notes\`, \`agent_id\`, \`tenant_id\`) VALUES
            ('Sunset Villa', 'available', 'house', 250.50, 450000.00, 'USD', 'USA', 'Los Angeles', '90210', 'Sunset Blvd', '100', '5', 'Luxury villa with pool', 1, NULL),
            ('Downtown Apartment', 'rented', 'apartment', 85.75, 2500.00, 'USD', 'USA', 'New York', '10001', 'Broadway', '500', '4', 'Modern apartment', 2, 1),
            ('Business Center', 'available', 'commercial', 500.00, 750000.00, 'USD', 'USA', 'Chicago', '60601', 'Michigan Ave', '200', '4', 'Prime location', 3, NULL),
            ('Cozy Condo', 'sold', 'apartment', 120.00, 320000.00, 'USD', 'USA', 'Houston', '77001', 'Main St', '300', '3', 'Recently renovated', 4, NULL),
            ('Garden House', 'available', 'house', 180.25, 380000.00, 'USD', 'USA', 'Phoenix', '85001', 'Central Ave', '150', '4', 'Large garden', 5, NULL),
            ('Studio Loft', 'rented', 'apartment', 45.50, 1800.00, 'USD', 'USA', 'Philadelphia', '19101', 'Market St', '800', '3', 'Artistic district', 1, 2),
            ('Retail Space', 'available', 'commercial', 200.00, 450000.00, 'USD', 'USA', 'San Antonio', '78201', 'Commerce St', '50', '4', 'High foot traffic', 2, NULL),
            ('Beachfront Condo', 'reserved', 'apartment', 95.00, 280000.00, 'USD', 'USA', 'San Diego', '92101', 'Harbor Dr', '1001', '5', 'Ocean view', 3, NULL),
            ('Family Home', 'available', 'house', 220.75, 425000.00, 'USD', 'USA', 'Dallas', '75201', 'Elm St', '250', '4', 'Great schools nearby', 4, NULL),
            ('Urban Apartment', 'rented', 'apartment', 75.00, 2200.00, 'USD', 'USA', 'Austin', '73301', 'Congress Ave', '600', '4', 'Downtown location', 5, 3)
        `);

        await queryRunner.query(`
            INSERT INTO \`contract\` (\`contract_name\`, \`contract_status\`, \`signing_date\`, \`validity_period\`, \`notes\`, \`estate_id\`, \`agent_id\`, \`tenant_id\`, \`renter_id\`) VALUES
            ('Rental Agreement - Downtown Apt', 'active', '2024-01-15 10:00:00', '2025-01-15 10:00:00', '12-month lease', 2, 2, 1, NULL),
            ('Sale Contract - Cozy Condo', 'completed', '2024-03-10 14:30:00', '2024-04-10 14:30:00', 'Cash purchase', 4, 4, NULL, 2),
            ('Rental Agreement - Studio Loft', 'active', '2024-05-20 11:00:00', '2025-05-20 11:00:00', '12-month lease with option to renew', 6, 1, 2, NULL),
            ('Rental Agreement - Urban Apt', 'active', '2024-06-01 09:30:00', '2025-06-01 09:30:00', '12-month lease', 10, 5, 3, NULL),
            ('Sale Contract - Beachfront Condo', 'pending', '2024-11-01 15:00:00', '2024-12-01 15:00:00', 'Financing pending', 8, 3, NULL, 4)
        `);

        await queryRunner.query(`
            INSERT INTO \`request\` (\`request_name\`, \`request_date\`, \`request_type\`, \`square\`, \`price\`, \`currency\`, \`country\`, \`city\`, \`rental_period_months\`, \`notes\`, \`client_id\`) VALUES
            ('Looking for 2BR Apartment', '2024-10-15 10:00:00', 'rental', 80.00, 2000.00, 'USD', 'USA', 'New York', 12, 'Pet-friendly preferred', 1),
            ('Family House Purchase', '2024-10-20 14:30:00', 'purchase', 200.00, 400000.00, 'USD', 'USA', 'Los Angeles', NULL, 'Good school district', 2),
            ('Commercial Space Needed', '2024-11-01 09:00:00', 'rental', 150.00, 3000.00, 'USD', 'USA', 'Chicago', 24, 'Ground floor preferred', 3),
            ('Luxury Condo Search', '2024-11-05 11:15:00', 'purchase', 120.00, 350000.00, 'USD', 'USA', 'Houston', NULL, 'High-rise building', 4),
            ('Studio Apartment', '2024-11-10 16:45:00', 'rental', 50.00, 1500.00, 'USD', 'USA', 'Austin', 6, 'Downtown location', 5)
        `);

        await queryRunner.query(`
            INSERT INTO \`offer\` (\`offer_name\`, \`offer_date\`, \`offer_type\`, \`client_feedback\`, \`notes\`, \`client_id\`, \`agent_id\`) VALUES
            ('Sunset Villa Offer', '2024-10-25 10:30:00', 'sale', 'Interested but price too high', 'Showed comparable properties', 1, 1),
            ('Downtown Apartment Viewing', '2024-10-28 15:00:00', 'rental', 'Loved the location', 'Ready to sign lease', 2, 2),
            ('Business Center Proposal', '2024-11-02 11:00:00', 'sale', 'Considering multiple options', 'Requested additional information', 3, 3),
            ('Garden House Showing', '2024-11-08 14:20:00', 'sale', 'Very satisfied with the property', 'Made an offer', 4, 4),
            ('Studio Loft Tour', '2024-11-12 09:45:00', 'rental', 'Needs to think about it', 'Following up next week', 5, 5)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`offer\``);
        await queryRunner.query(`DELETE FROM \`request\``);
        await queryRunner.query(`DELETE FROM \`contract\``);
        await queryRunner.query(`DELETE FROM \`estate\``);
        await queryRunner.query(`DELETE FROM \`client\``);
        await queryRunner.query(`DELETE FROM \`agent\``);
        await queryRunner.query(`DELETE FROM \`contact\``);
    }
}
