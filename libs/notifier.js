
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

let iolog = function() {};
for (let i = 0; i < process.argv.length; i++) {
    let arg = process.argv[i];
    if (arg === "-debug") {
        iolog = function(msg) {
            if (typeof msg == 'string') console.log(new Date().toISOString()+' - '+msg);
            else console.log(msg);
        };
        console.log('Debug mode on!');
    }
}

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, JSON.parse(process.env.MONGO_CONNECTION_PARAMS));

['disconnected', 'close', 'error'].forEach(function (name) {
    mongoose.connection.on(name, err => {
        console.log(err);
        let exit = process.exit;
        exit(1);
    });
});

// models
let Notification    = require('./models/notification');
let NotificationLog = require('./models/notificationlog');

async function onNotification(notification) {
    try {

        let log_data = {
            notification: notification._id,
            delayed: notification.delayed,
            data: {}
        };
// console.log(notification);
        try {

            if (notification.extra_data && notification.extra_data.company && notification.extra_data.company.email_settings) {
                nodemailer.createTransport({
                    service: notification.extra_data.company.email_settings.service,
                    auth: {
                        user: notification.extra_data.company.email_settings.user,
                        pass: notification.extra_data.company.email_settings.pass,
                    }
                });
            }

            let mailOptions = null;
            let transport_response = null;

            let textBody = notification.message;

            if (notification.transport == 'email') {

                log_data.data = {
                    type: 'email',
                    destination: notification.destination.join(',')
                };

                mailOptions = {
                    from: {
                        name: 'Ecomm',
                        address: 'no-reply@ecomm.com'
                    },
                    sender: {
                        name: 'Ecomm',
                        address: 'no-reply@ecomm.com'
                    },
                    to: notification.destination.join(','),
                    subject: notification.subject,
                    html: textBody
                };

            }

            if (mailOptions) {
                transport_response = await transporter.sendMail(mailOptions);
                iolog('Message sent: ');
                iolog(transport_response.response);
                log_data.data.status = 'success';
            }
            else {
                throw 'notification type "' + notification.type + '" not handled';
            }

        }
        catch(err) {
            iolog('Message not sent: ');
console.log(err);
            log_data.data.status = 'error';
        }

        let log = new NotificationLog(log_data);
        await log.save();

    }
    catch(err) {
        iolog('onNotification error');
console.log(err);
    }
}

let on_error_count = 0;
let on_close_count = 0;

function onError(err) {
    iolog('notification cursor error');
    iolog(err);
    if (on_error_count > 5) process.exit(1);
    on_error_count++;
    startNotifier();
}
function onClose() {
    iolog('notification cursor closed');
    //if (on_close_count > 5) process.exit(1);
    on_close_count++;
    startNotifier();
}

async function startNotifier() {
iolog('notification process started');
    try {
        let any = await  NotificationLog.find({}).limit(1).lean().exec();
        if (!any.length) {
            let fe = new NotificationLog({ data: {}, created: Date.now() });
            await fe.save();
        }

        let logs = await NotificationLog.find({ 'delayed': { $in: [0, null, false] } }).sort({ $natural: -1 }).limit(1);

        let filter = {};
        const opts = { tailable: true, awaitdata: true, numberOfRetries: Number.MAX_VALUE };

        if (!logs.length || !logs[0].notification) {
            filter.created = { $gt: 0 };
        }
        else {
            filter._id = { $gt: logs[0].notification };
        }

        let stream = Notification.find(filter).setOptions(opts).stream();
        stream.on('data', onNotification);
        stream.on('error', onError);
        stream.on('close', onClose);
    }
    catch (err) {
        onError(err);
    }
}

startNotifier();
