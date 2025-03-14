import faker from 'faker';
import { Db } from 'mongodb';

export const up = async (db: Db) => {
    // Create Users Collection
    await db.createCollection('users');

    // Insert Dummy Users
    const users = Array.from({ length: 100 }).map(async () => {
        const password = await Bun.password.hash('password123'); // Hash password using Argon2
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        return {
            username: faker.internet.userName(firstName, lastName),
            firstName,
            lastName,
            DOB: faker.date.between('01-01-1960', '01-01-2004'),
            password,
            email: faker.internet.email(firstName, lastName).toLowerCase(),
            phoneNumber: faker.phone.phoneNumber('23480########'),
        };
    });

    // Wait for all user promises to resolve
    const resolvedUsers = await Promise.all(users);
    //@ts-ignore;

    // Insert users into the collection
    await db.collection('users').insertMany(resolvedUsers);

    // Extract usernames from the resolved users
    const usernames = resolvedUsers.map((user) => user.username);

    // Create Articles Collection
    await db.createCollection('articles');

    // Insert Dummy Articles
    const articles = Array.from({ length: 200 }).map(() => {
        // Generate random comments using the resolved usernames
        const comments = Array.from({ length: faker.datatype.number(5) }).map(() => ({
            username: faker.random.arrayElement(usernames), // Randomly pick a username from the resolved users
            comment: faker.lorem.sentence(),
        }));

        return {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            author: faker.random.arrayElement(usernames),
            publicationDate: faker.date.past(),
            likes: faker.datatype.number(100),
            dislikes: faker.datatype.number(10),
            comments,
        };
    });

    // Insert articles into the collection
    await db.collection('articles').insertMany(articles);
};

export const down = async (db: Db) => {
    // Drop the users and articles collections
    await db.collection('users').drop();
    await db.collection('articles').drop();
};
