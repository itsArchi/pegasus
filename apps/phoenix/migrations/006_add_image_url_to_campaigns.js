/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.addColumn('campaigns', {
    image_url: { type: 'text', notNull: false },
  })
}

exports.down = (pgm) => {
  pgm.dropColumn('campaigns', 'image_url')
}
