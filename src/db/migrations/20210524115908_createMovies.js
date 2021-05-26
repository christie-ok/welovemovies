
exports.up = function(knex) {
  return knex.schema.createTable("movies", (table) => {
      table.increments("movie_id").primary().unsigned().notNullable();
      table.string("title");
      table.integer("runtime_in_minutes");
      table.string("rating");
      table.string("description", 5000);
      table.string("image_url");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("movies");
};
