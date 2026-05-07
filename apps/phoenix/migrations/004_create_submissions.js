/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('submissions', {
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
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
    },
    phone: {
      type: 'varchar(50)',
    },
    submitted_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  })

  pgm.createIndex('submissions', 'campaign_id')
  pgm.createIndex('submissions', 'email')
  pgm.createIndex('submissions', 'submitted_at')
}

exports.down = (pgm) => {
  pgm.dropTable('submissions')
}
