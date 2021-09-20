import { THEME, ACCOUNT_STATUS, IMAGE_USE, TASK_STATUS } from '@local/shared';
import { TABLES } from '../tables';

export async function up (knex) {
    console.info('✈️ Starting migration...');
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable(TABLES.Task, (table) => {
        table.comment('Task Queue information');
        table.increments();
        table.integer('taskId').notNullable();
        table.string('name', 256).notNullable();
        table.enu('status', Object.values(TASK_STATUS)).defaultTo(TASK_STATUS.Active).notNullable();
        table.string('description', 1024);
        table.string('result', 8192);
        table.integer('resultCode');
        table.timestamps(true, true);
    });
    await knex.schema.createTable(TABLES.Business, (table) => {
        table.comment('Business entity that a customer belongs to');
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 128).notNullable();
        table.boolean('subscribedToNewsletters').defaultTo(true).notNullable();
        table.timestamps(true, true);
    });
    await knex.schema.createTable(TABLES.Customer, (table) => {
        table.comment('A user of the system');
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('firstName', 128).notNullable();
        table.string('lastName', 128).notNullable();
        table.specificType('fullName', `text GENERATED ALWAYS AS ("firstName" || ' ' || "lastName") stored`);
        table.string('pronouns', 128).defaultTo('they/them').notNullable();
        table.string('theme').defaultTo(THEME.Light).notNullable();
        table.string('password', 256);
        table.integer('loginAttempts').defaultTo(0).notNullable();
        table.timestamp('lastLoginAttempt').defaultTo(knex.fn.now()).notNullable();
        table.string('sessionToken', 1024);
        table.string('resetPasswordCode', 256).unique();
        table.timestamp('lastResetPasswordReqestAttempt');
        table.boolean('emailVerified').defaultTo(false).notNullable();
        table.enu('status', Object.values(ACCOUNT_STATUS)).defaultTo(ACCOUNT_STATUS.Unlocked).notNullable();
        table.uuid('businessId').references('id').inTable(TABLES.Business).onUpdate('CASCADE');
        table.timestamps(true, true);
    });
    await knex.schema.createTable(TABLES.Feedback, (table) => {
        table.comment('User feedback');
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('text', 4096).notNullable();
        table.uuid('customerId').references('id').inTable(TABLES.Customer).onUpdate('CASCADE').onDelete('CASCADE');
        table.timestamps(true, true);
    });
    await knex.schema.createTable(TABLES.Role, (table) => {
        table.comment('A user role. Each user can have multiple roles');
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('title', 128).notNullable().unique();
        table.string('description', 2048);
    });
    await knex.schema.createTable(TABLES.Address, (table) => {
        // tag - Optional tag associated with address (ex: 'Main address')
        // name - Optional name, sometimes required for internal mail delivery systems
        // country - ISO 3166 country code
        // administrative_area - State/Province/Region (ISO code when available [ex: NJ])
        // sub_administrative_area - County/District (currently unused)
        // locality - City/Town
        // postal_code - Postal/Zip code
        // throughfare - Street Address
        // premise - Apartment, Suite, P.O. box number, etc.
        table.comment('Physical address data')
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('tag', 128);
        table.string('name', 128);
        table.string('country', 2).defaultTo('US').notNullable();
        table.string('administrativeArea', 64).notNullable();
        table.string('subAdministrativeArea', 64);
        table.string('locality', 64).notNullable();
        table.string('postalCode', 16).notNullable();
        table.string('throughfare', 256).notNullable();
        table.string('premise', 64);
        table.string('deliveryInstructions', 2048);
        table.uuid('businessId').references('id').inTable(TABLES.Business).onUpdate('CASCADE').onDelete('CASCADE');
    });
    await knex.schema.createTable(TABLES.Email, (table) => {
        table.comment('Email data');
        //TODO CONSTRAINT chk_keys check (customer_id is not null or business_id is not null)
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('emailAddress', 128).notNullable().unique();
        table.boolean('receivesDeliveryUpdates').defaultTo(true).notNullable();
        table.uuid('customerId').references('id').inTable(TABLES.Customer).onUpdate('CASCADE').onDelete('CASCADE');
        table.uuid('businessId').references('id').inTable(TABLES.Business).onUpdate('CASCADE').onDelete('CASCADE');
    });
    await knex.schema.createTable(TABLES.Phone, (table) => {
        table.comment('Phone data');
        // Numbers should be stored without formatting
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('number', 20).notNullable();
        table.boolean('receivesDeliveryUpdates').defaultTo(true).notNullable();
        table.uuid('customerId').references('id').inTable(TABLES.Customer).onUpdate('CASCADE').onDelete('CASCADE');
        table.uuid('businessId').references('id').inTable(TABLES.Business).onUpdate('CASCADE').onDelete('CASCADE');
        table.unique('number');
    });
    await knex.schema.createTable(TABLES.Image, (table) => {
        table.comment('Image metadata. Actual image is stored elsewhere');
        table.string('hash', 128).notNullable().unique();
        table.string('alt', 256);
        table.string('description', 1024);
        table.enu('usedFor', Object.values(IMAGE_USE));
        table.timestamps(true, true);
    });
    await knex.schema.createTable(TABLES.ImageFile, (table) => {
        table.comment('Image file names');
        table.string('hash', 128).notNullable().references('hash').inTable(TABLES.Image).onUpdate('CASCADE').onDelete('CASCADE');
        table.string('src', 256).notNullable().unique();
        table.integer('width').notNullable();
        table.integer('height').notNullable();
    })
    await knex.schema.createTable(TABLES.ImageLabels, (table) => {
        table.comment('Joining table to allow images to be tagged into groups');
        table.increments();
        table.string('hash', 128).references('hash').inTable(TABLES.Image).notNullable().onUpdate('CASCADE').onDelete('CASCADE');
        table.string('label').notNullable();
        table.integer('index').notNullable();
        table.unique(['hash', 'label']);
    });
    await knex.schema.createTable(TABLES.CustomerRoles, (table) => {
        table.comment('Joining table to apply roles to customers');
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('customerId').references('id').inTable(TABLES.Customer).notNullable().onUpdate('CASCADE').onDelete('CASCADE');
        table.uuid('roleId').references('id').inTable(TABLES.Role).notNullable().onUpdate('CASCADE').onDelete('CASCADE');
        table.unique(['customerId', 'roleId']);
    });
    console.info('✅ Migration complete!');
}

export async function down (knex) {
    await knex.schema.dropTableIfExists(TABLES.CustomerRoles);
    await knex.schema.dropTableIfExists(TABLES.ImageLabels);
    await knex.schema.dropTableIfExists(TABLES.ImageFile);
    await knex.schema.dropTableIfExists(TABLES.Image);
    await knex.schema.dropTableIfExists(TABLES.Phone);
    await knex.schema.dropTableIfExists(TABLES.Email);
    await knex.schema.dropTableIfExists(TABLES.Address);
    await knex.schema.dropTableIfExists(TABLES.Role);
    await knex.schema.dropTableIfExists(TABLES.Feedback);
    await knex.schema.dropTableIfExists(TABLES.Customer);
    await knex.schema.dropTableIfExists(TABLES.Business);
    await knex.schema.dropTableIfExists(TABLES.Task);
    await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}