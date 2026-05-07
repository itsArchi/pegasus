/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('section_contents', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    section_id: {
      type: 'uuid',
      notNull: true,
      references: '"sections"',
      onDelete: 'CASCADE',
    },
    key: {
      type: 'varchar(100)',
      notNull: true,
    },
    value: {
      type: 'text',
    },

    group_index: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  })

  pgm.createIndex('section_contents', 'section_id')
  pgm.createIndex('section_contents', ['section_id', 'group_index'])
}

exports.down = (pgm) => {
  pgm.dropTable('section_contents')
}
