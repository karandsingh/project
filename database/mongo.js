use machine_round

db.users.createIndex(
   { name: 1 },
   { unique: true }
)