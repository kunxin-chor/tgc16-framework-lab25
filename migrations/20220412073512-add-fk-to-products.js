'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // addColumn has 3 args:
  // 1. name of the table to add the column to
  // 2. name of the new column
  // 3. configuration for the new column
  return db.addColumn('products', 'category_id', {
    'type':'int',
    'unsigned':true,
    'notNull':true,
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('category_id');
  db.dropColumn('category_id');
};

exports._meta = {
  "version": 1
};
