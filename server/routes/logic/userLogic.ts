import crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';
import mongo from 'mongodb';

export class UserLogic {
    async createPassword(password: string) {
        const salt = cryptoRandomString({ length: 16 });
        const hashedPassword = await this.hashPassword(password, salt);

        return {
            'salt': salt,
            'hashedPassword': hashedPassword
        }
    }

    hashPassword(password: string, salt: any) {
        return new Promise((resolve, reject) => {
            const iterations = 100000;
            const keylen = 64;
            const digest = 'sha512';

            crypto.pbkdf2(password, salt, iterations, keylen, digest, (error, derivedKey) => {
                error ? reject(error) : resolve(derivedKey.toString('hex'));
            });
        });
    }

    async validatePassword(inputPassword: string, storedHashedPassword: string, storedSalt: any) {
        const inputHashedPassword = await this.hashPassword(inputPassword, storedSalt);
        return inputHashedPassword == storedHashedPassword;
    }

    async create(username: string, password: string, collection) {
        try {
            const doesUserExist = await this.doesUserExist(username, collection);

            if (doesUserExist) {
                throw new Error('User already exists.');
            } else {
                const newUserPasswordData = await this.createPassword(password);
                const response = await collection.insertOne({
                    'username': username,
                    'password': newUserPasswordData.hashedPassword,
                    'salt': newUserPasswordData.salt
                });
                return response['ops']._id
            }
        } catch (err) {
            console.log(err);
            throw new Error('Failed to create user.');
        }
    }

    async doesUserExist(username, collection): Promise<boolean> {
        try {
            const result = await collection.findOne({ username: username });
            return Boolean(result);
        } catch (err) {
            console.log(err);
            throw new Error('Failed user existence validation.');
        }
    }

    async login(username, password, collection) {
            try {
                const result = await collection.findOne({ username: username });
                
                if (!result) {
                    return false;
                }
                
                const isPasswordValid = await this.validatePassword(password, result.password, result.salt);
        
                if (isPasswordValid) {
                    return {
                        status: 'success',
                        userId: result._id,
                        firstName: result.first_name,
                        lastName: result.last_name
                    };
                } else {
                    return false;
                }
            } catch (err) {
                console.log(err);
                return false;
            }        
    }

    async getUserData(userId, collection) {
        try {
            const mongoObjectId = new mongo.ObjectID(userId)
            const result = await collection.findOne({ "_id": mongoObjectId })

            if (!result) {
                return false;
            } else {
                return {
                    status: 'success',
                    firstName: result.first_name,
                    lastName: result.last_name,
                    systemUsed: result.measurement_system
                }
            }
        } catch (err) {
            console.log(err);
            throw new Error('Failed user return user data.');
        }
    }
}

export default UserLogic;