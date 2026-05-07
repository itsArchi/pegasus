/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('sections', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    campaign_id: {
      type: 'uuid',
      notNull: true,
      references: '"campaigns"',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'varchar(50)',
      notNull: true,
      check: "type IN ('hero', 'product', 'form')",
    },
    order_index: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  })

  pgm.createIndex('sections', 'campaign_id')
  pgm.createIndex('sections', ['campaign_id', 'order_index'])
}

exports.down = (pgm) => {
  pgm.dropTable('sections')
}
