'use strict';
const Dataloader = require('dataloader');
const knex = require('./connector');

const loaders = () => ({
    getSpaceCenterByID: new Dataloader(async Ids => {
        const spaceCenters =  await knex.select().from('space_center')
            .whereIn('id', Ids);
        return Ids.map(id => spaceCenters.filter(spaceCenter => spaceCenter.id == id));
    }),
    getSpaceCenterByUID: new Dataloader(async uIds => {
        const spaceCenters = await knex.select().from('space_center')
            .whereIn('uid', uIds);
        return uIds.map(uid => spaceCenters.filter(spaceCenter => spaceCenter.uid === uid));
    })
});

module.exports = loaders;