import { ACCOUNT_STATUS } from '@local/shared';
import { TABLES } from '../tables';
import bcrypt from 'bcrypt';
import { HASHING_ROUNDS } from '../../consts';
import { db } from '../db';

// Create a user, with emails, and roles
async function createUser({ userData, emailsData, roleIds }) {
    let customer = await db(TABLES.Customer).select('id').where({ username: userData.username }).first();
    if (!customer) {
        console.info(`👩🏼‍💻 Creating account for ${userData.username}`);
        // Insert account
        const customerId = (await db(TABLES.Customer).insert([{ ...userData }]).returning('id'))[0];
        // Insert emails
        for (const email of emailsData) {
            await db(TABLES.Email).insert([{ ...email, customerId }]);
        }
        // Insert roles
        for (const roleId of roleIds) {
            await db(TABLES.CustomerRoles).insert([{ roleId, customerId }]);
        }
    }
}

export async function seed() {
    console.info('🎭 Creating mock data...');

    // Find existing roles
    const roles = (await db(TABLES.Role).select('id', 'title'));
    const customerRoleId = roles.filter(r => r.title === 'Customer')[0].id;
    const ownerRoleId = roles.filter(r => r.title === 'Owner')[0].id;
    // const adminRoleId = roles.filter(r => r.title === 'Admin')[0].id;

    // Create user with owner role
    await createUser({
        userData: {
            username: 'Elon Tusk🦏',
            password: bcrypt.hashSync('Elon', HASHING_ROUNDS),
            status: ACCOUNT_STATUS.Unlocked,
        },
        emailsData: [
            { emailAddress: 'notarealemail@afakesite.com', receivesDeliveryUpdates: false, verified: true },
            { emailAddress: 'backupemailaddress@afakesite.com', receivesDeliveryUpdates: false, verified: false }
        ],
        roleIds: [ownerRoleId]
    });

    // Create a few customers
    await createUser({
        userData: {
            username: 'JohnCena87',
            password: bcrypt.hashSync('John', HASHING_ROUNDS),
            status: ACCOUNT_STATUS.Unlocked,
        },
        emailsData: [
            { emailAddress: 'itsjohncena@afakesite.com', receivesDeliveryUpdates: false, verified: true }
        ],
        roleIds: [customerRoleId]
    });
    await createUser({
        userData: {
            username: 'Spongebob Customerpants',
            password: bcrypt.hashSync('Spongebob', HASHING_ROUNDS),
            status: ACCOUNT_STATUS.Unlocked,
        },
        emailsData: [
            { emailAddress: 'spongebobmeboy@afakesite.com', receivesDeliveryUpdates: false, verified: true }
        ],
        roleIds: [customerRoleId]
    });

    console.info(`✅ Database mock complete.`);
}