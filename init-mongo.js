db.createUser({
    user: 'mongodb',
    pwd: 'password',
    roles: [
        {
            role: 'readWrite',
            db: 'mespangolins',
        },
    ],
});

db = new Mongo().getDB("mespangolins");

db.createCollection('emptyCollection', { capped: false });