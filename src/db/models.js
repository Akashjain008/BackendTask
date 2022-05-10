'use strict';

const knex = require('./connector');

const models = {
  Planet: {
    async findAll() {
      return knex.select().from('planet');
    },
    async findById({ code }) {
      const planet = await knex.select().from('planet').where({ code });
      return planet[0];
    }
  },
  SpaceCenter: {
    async findAll() {
      return knex.select().from('space_center');
    },
    async findById(query) {
      const spaceCenters = await knex.select().from('space_center').where(query);
      return spaceCenters;
    }
  },
  Flight: {
    async findAll() {
      return knex.select().from('flight');
    },
    async create(data) {
      return await knex.insert(data).returning().into('flight').returning('*');
    },
    async findById(query) {
      const flights = await knex.select().from('flight').where(query);
      return flights;
    },
    async customFindAll(query) {
      const flights = await knex.select().from('flight').where(function () {
        this.where('launchSite', query.launchSite)
          .andWhere('landingSite', query.landingSite)
          .andWhere('departureAt', query.departureAt)
          .andWhere('availableSeats', '>=', query.seatCount)
      });
      return flights;
    },
    async update(query, data) {
      console.log('query', query);
      console.log('data', data);
      return await knex.where(query).update(data).into('flight');
    },
  },
  Booking: {
    async findAll() {
      return knex.select().from('booking');
    },
    async create(data) {
      return await knex.insert(data).into('booking').returning('*');
    },
    async findById(query) {
      const bookings = await knex.select().from('booking').where(query);
      return bookings;
    },
  },
};

module.exports = models;
