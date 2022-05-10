/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema
        .createTable('planet', function (table) {
            // table.increments().primary()
            table.increments('id')
            table.string('name', 255).notNullable()
            table.string('code', 255).primary()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
        .createTable('space_center', function (table) {
            // table.increments().primary()
            table.increments('id')
            table.string('uid', 255).primary()
            table.string('name', 255).notNullable()
            table.string('description', 1000).notNullable()
            table.float('latitude', 14, 10).notNullable()
            table.float('longitude', 14, 10).notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table
                .string('planet_code')
                .references('code')
                .inTable('planet')
        })
        .createTable('flight', function (table) {
            // table.increments().primary()
            table.increments('id')
            table.string('code', 255).primary()
            table.timestamp('departureAt').notNullable()
            table.integer('seatCount').notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.integer('availableSeats').notNullable()
            table
                .string('launchSite')
                .references('uid')
                .inTable('space_center')
            table
                .string('landingSite')
                .references('uid')
                .inTable('space_center')
        })
        .createTable('booking', function (table) {
            // table.increments().primary()
            table.increments('id').primary()
            table.integer('seatCount').notNullable()
            table.string('email', 255).notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table
                .string('flightId')
                .references('code')
                .inTable('flight')

        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('planet').dropTable('space_center').dropTable('flight').dropTable('booking');
};
