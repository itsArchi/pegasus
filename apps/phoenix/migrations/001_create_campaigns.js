/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('campaigns', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    slug: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'text',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'draft',
      check: "status IN ('draft', 'published')",
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

  pgm.createIndex('campaigns', 'slug')
  pgm.createIndex('campaigns', 'status')
}

exports.down = (pgm) => {
  pgm.dropTable('campaigns')
}
