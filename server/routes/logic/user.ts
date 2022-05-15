export class UserLogic {

    login(req, res, collection) {
        return collection.find({ username: req.body.username, password: req.body.password })
            .toArray()
            .then(result => {
                if (result[0].username === req.body.username && result[0].password === req.body.password) {
                    return res.status(200).json({
                        status: 'success',
                        userId: result[0]._id
                    });
                }
            })
            .catch(err => res.status(500).json({
                status: 'error',
                result: 'Failed to login.',
                message: `${err}`
            })
        );
    }
}

export default UserLogic;