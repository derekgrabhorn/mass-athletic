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

    async create(req, res, collection) {
        try {
            const doesUserExist = await this.doesUserExist(req.body.username, collection);

            if (doesUserExist) {
                res.status(400).json({
                    status: 'error',
                    message: 'User already exists.'
                })
            } else {
                const newUserPasswordData = await this.createPassword(req.body.password);
                const response = await collection.insertOne({
                    'username': req.body.username,
                    'password': newUserPasswordData.hashedPassword,
                    'salt': newUserPasswordData.salt
                });

                res.status(200).json({
                    status: 'success',
                    userId: response['ops']._id
                })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Failed to create user.'
            });
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

    login(req, res, collection) {
        return collection.findOne({ username: req.body.username })
            .then(result => {
                this.validatePassword(req.body.password, result.password, result.salt).then((isPasswordValid) => {
                    if (isPasswordValid) {
                        return res.status(200).json({
                            status: 'success',
                            userId: result._id,
                            firstName: result.first_name,
                            lastName: result.last_name
                        });
                    } else {
                        return res.status(200).json({
                            status: 'error',
                            message: 'Password incorrect.'
                        })
                    }
                })
            })
            .catch(err => res.status(400).json({
                status: 'error',
                result: 'Failed to login.',
                message: `${err}`
            })
        );
    }

    getUserData(req, res, collection) {
        try {
            let mongoObjectId = new mongo.ObjectID(req.body.userId)
            collection.findOne({ "_id": mongoObjectId })
            .then(result => {
                return res.status(200).json({
                    status: 'success',
                    firstName: result.first_name,
                    lastName: result.last_name,
                    systemUsed: result.measurement_system
                });
            }) 
        } catch (err) {
            return res.status(200).json({
                status: 'error',
                message: 'Unable to retrieve user data.'
            })
        }
    }
}

export default UserLogic;