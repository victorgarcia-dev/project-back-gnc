'use strict';

let express = require('express');
let jwt = require('jsonwebtoken');

let router = express.Router({ mergeParams: true });

router.route('/')
    .get((req, res) => {
        res.status(200).json({ message: 'GNC API esta con vida!' });
    });


router.post('/access', async (req, res) => {
    try {
        var data = req.body;

        if (!hasRequired(['username', 'password'], data, true)) throw { status: 401, error: 'Unauthorized' };

        let user = await User.findOne({ 'username': data.username, 'enabled': 1 }).exec();
        if (!user) throw { status: 401, error: 'Unauthorized' };
        if (!user.authenticate(data.password)) throw { status: 401, error: 'Unauthorized' };

        const userData = {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            legalId: user.legalId,
            username: user.username,
            company: user.company,
            roles: user.roles,
            picture: user.picture,
            verified: user.verification.verified,
            _id: user._id,
        };

        if (user.address && user.address instanceof Object && !Array.isArray(user.address)) {
            userData.address = user.address
        }

        if (user.phone && user.phone.length) {
            userData.phone = user.phone
        }

        const cdn = process.env.UPLOADS_URL;
        const token = user.getToken();

        return res.status(200).json({ success: true, access_token: token.access, refresh_token: token.refresh, user: userData, cdn });
    }
    catch (err) {
        return errorResponse(err, res);
    }
});

router.post('/access/refresh', async (req, res) => {
    try {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (!token || token.length === 0) throw { status: 401, error: 'Unauthorized' };

        const decoded = await jwt.verify(token, process.env.API_KEY);
        if (decoded.type !== 'refresh' || decoded.entity !== 'user') throw { status: 401, error: 'Unauthorized' };

        let user = await User.findOne({ '_id': decoded._id, 'enabled': 1 }).exec();
        if (!user) throw { status: 401, error: 'Unauthorized' };

        token = user.getToken();
        return res.status(200).json({ success: true, access_token: token.access, refresh_token: token.refresh });
    }
    catch (err) {
        if (['JsonWebTokenError', 'TokenExpiredError'].indexOf(err.name) >= 0) return errorResponse({ status: 401, error: 'Unauthorized' }, res);
        return errorResponse(err, res);
    }
});


router.post('/pwreset', async (req, res) => {
    try {
        const data = req.body;

        if (!hasRequired(['username'], data, true)) throw { status: 400, error: 'Bad Request' };

        const user = await User.findOne({ username: data.username }).exec();

        if (!user) throw { status: 404, error: 'Not Found' };
        await user.requestPasswordReset();
        await user.save();


        let event = await new Event({
            service: 'email',
            type: 'pwreset',
            timestamp: Date.now(),
            data: user
        });
        await event.save();

        return res.status(200).json({ success: true })
    }
    catch (err) {
        return errorResponse(err, res)
    }
})
router.post('/pwreset/:username', async (req, res) => {
    try {
        const data = req.body;
        if (!hasRequired(['password', 'code'])) throw { status: 401, error: 'Unauthorized' };

        const user = await User.findOne({ username: req.params.username });
        if (!user) throw { status: 404, error: 'Not Found' };
        console.log(user.pwreset)
        const passwordChanged = await user.resetPassword(data.code, data.password);

        if (!passwordChanged) throw { status: 401, error: 'unauthorized' }

        await user.save();

        return res.status(200).json({ success: true, user: user.getPublicFields() });
    }
    catch (err) {
        return errorResponse(err, res);
    }
})

module.exports = router;

