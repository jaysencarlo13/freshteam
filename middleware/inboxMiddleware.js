const Users = require('../models/user');
const Inbox = require('../models/inbox');
const { FilterArray } = require('../models/methods');

const inboxMiddleware = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            const { user } = req.body;
            const usr = await Users.findById(user._id);
            const { google } = usr;
            const inbox = FilterArray(
                await Inbox.find(
                    {
                        $or: [
                            { to: { $in: [google.username] } },
                            { cc: { $in: [google.username] } },
                            { bcc: { $in: [google.username] } },
                        ],
                    },
                    '_id'
                ),
                '_id'
            );
            const google_pass = await usr.GooglePassword();
            await ConnectAndCollect(inbox, google.username, google_pass)
                .then(async (result) => {
                    array = result;
                    if (array && array.length !== 0) await Inbox.insertMany(array);
                    return next();
                })
                .catch((err) => {
                    console.log(err);
                    return res.json({ isGoogle: false });
                });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

async function ConnectAndCollect(array, email, password) {
    return new Promise((resolve, reject) => {
        try {
            var Imap = require('imap');
            const moment = require('moment');
            const { parse } = require('node-html-parser');

            let boundary = '';
            let date = '';
            let to = [];
            let from = '';
            let subject = '';
            let name = '';
            let content = '';
            let cc = [];
            let bcc = [];
            let text = '';
            let html = '';
            let messageId = '';
            let inbox = [];

            function parseBody(boundary, content) {
                let array = [];
                let text = '';
                let html = '';
                content.split('--' + boundary).forEach((element) => {
                    if (element.indexOf('Content-Type') !== -1) array.push(element);
                });
                array.forEach((element) => {
                    if (element.indexOf('text/plain') !== -1) {
                        let index = 0;
                        index = element.indexOf('Content-Transfer-Encoding');
                        index = element.indexOf('\r\n\r\n', index);
                        index = index + 4;
                        text = element.substring(index, element.length);
                    }
                    if (element.indexOf('text/html') !== -1) {
                        let index = 0;
                        index = element.indexOf('Content-Transfer-Encoding');
                        index = element.indexOf('\r\n\r\n', index);
                        index = index + 4;
                        html = parse(element.substring(index, element.length));
                        html = html.toString();
                    }
                });
                return { text, html };
            }

            var imap = new Imap({
                user: email,
                password: password,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                tlsOptions: {
                    rejectUnauthorized: false,
                },
            });

            function openInbox(cb) {
                imap.openBox('INBOX', true, cb);
            }

            imap.once('ready', function () {
                openInbox(function (err, box) {
                    if (err) throw err;
                    const min = box.messages.total <= 500 ? 1 : box.messages.total - 500;
                    var f = imap.seq.fetch(1 + ':*', {
                        bodies: [
                            'HEADER.FIELDS (FROM TO SUBJECT CC BCC CONTENT-TYPE DATE MESSAGE-ID)',
                            'TEXT',
                        ],
                    });
                    f.on('message', function (msg, seqno) {
                        msg.on('body', function (stream, info) {
                            var buffer = '';
                            stream.on('data', function (chunk) {
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', async function () {
                                if (info.which !== 'TEXT') {
                                    boundary = Imap.parseHeader(buffer)['content-type'].map((element) => {
                                        element = element.replace('multipart/alternative; boundary="', '');
                                        element = element.replace('"', '');
                                        return element;
                                    })[0];
                                    date = moment(Imap.parseHeader(buffer)['date'][0]).toDate();
                                    Imap.parseHeader(buffer)['from'].map((element) => {
                                        let thiselement = element.split(' ');
                                        thiselement.forEach((e) => {
                                            if (e.indexOf('<') === -1) name = name + ' ' + e;
                                            else from = e;
                                        });
                                        name = name.substring(1).trim();
                                        from = from.replace(/[<>]/gi, '');
                                    });
                                    Imap.parseHeader(buffer)['to'].map((element) => {
                                        if (element.indexOf(',') !== -1) {
                                            let thiselement = element.split(',');
                                            thiselement.forEach((e) => {
                                                if (e.indexOf('<') !== -1) {
                                                    const thise = e.split(' ');
                                                    thise.forEach((el) => {
                                                        if (el.indexOf('<') !== -1) {
                                                            el = el.replace(/[<>]/gi, '');
                                                            to.push(el.trim());
                                                        }
                                                    });
                                                } else {
                                                    to.push(e.trim());
                                                }
                                            });
                                        } else if (element.indexOf('<') !== -1) {
                                            let thiselement = element.split(' ');
                                            thiselement.forEach((e) => {
                                                if (e.indexOf('<') !== -1) {
                                                    e = e.replace(/[<>]/gi, '');
                                                    to.push(e);
                                                }
                                            });
                                        } else {
                                            to.push(element);
                                        }
                                    });
                                    if (Imap.parseHeader(buffer)['cc'])
                                        Imap.parseHeader(buffer)['cc'].map((element) => {
                                            if (element.indexOf(',') !== -1) {
                                                let thiselement = element.split(',');
                                                thiselement.forEach((e) => {
                                                    if (e.indexOf('<') !== -1) {
                                                        const thise = e.split(' ');
                                                        thise.forEach((el) => {
                                                            if (el.indexOf('<') !== -1) {
                                                                el = el.replace(/[<>]/gi, '');
                                                                cc.push(el.trim());
                                                            }
                                                        });
                                                    } else {
                                                        cc.push(e.trim());
                                                    }
                                                });
                                            } else if (element.indexOf('<') !== -1) {
                                                let thiselement = element.split(' ');
                                                thiselement.forEach((e) => {
                                                    if (e.indexOf('<') !== -1) {
                                                        e = e.replace(/[<>]/gi, '');
                                                        cc.push(e);
                                                    }
                                                });
                                            } else {
                                                cc.push(element);
                                            }
                                        });
                                    if (Imap.parseHeader(buffer)['bcc'])
                                        Imap.parseHeader(buffer)['bcc'].map((element) => {
                                            if (element.indexOf(',') !== -1) {
                                                let thiselement = element.split(',');
                                                thiselement.forEach((e) => {
                                                    if (e.indexOf('<') !== -1) {
                                                        const thise = e.split(' ');
                                                        thise.forEach((el) => {
                                                            if (el.indexOf('<') !== -1) {
                                                                el = el.replace(/[<>]/gi, '');
                                                                bcc.push(el.trim());
                                                            }
                                                        });
                                                    } else {
                                                        bcc.push(e.trim());
                                                    }
                                                });
                                            } else if (element.indexOf('<') !== -1) {
                                                let thiselement = element.split(' ');
                                                thiselement.forEach((e) => {
                                                    if (e.indexOf('<') !== -1) {
                                                        e = e.replace(/[<>]/gi, '');
                                                        bcc.push(e);
                                                    }
                                                });
                                            } else {
                                                bcc.push(element);
                                            }
                                        });
                                    subject = Imap.parseHeader(buffer)['subject'][0];
                                    const parse = parseBody(boundary, content);
                                    text = parse.text;
                                    html = parse.html;
                                    messageId = Imap.parseHeader(buffer)['message-id'][0];
                                }
                                if (info.which === 'TEXT') {
                                    content = buffer;
                                }
                            });
                        });
                        msg.once('attributes', function (attrs) {
                            if (
                                attrs['x-gm-labels'].indexOf('\\Important') !== -1 &&
                                array.indexOf(messageId) === -1 &&
                                (to.indexOf(email) !== -1 ||
                                    cc.indexOf(email) !== -1 ||
                                    bcc.indexOf(email) !== -1)
                            )
                                inbox.push({
                                    to,
                                    cc,
                                    bcc,
                                    from,
                                    subject,
                                    body: {
                                        text,
                                        html,
                                    },
                                    date,
                                    name,
                                    _id: messageId,
                                });
                            (to = []),
                                (cc = []),
                                (bcc = []),
                                (from = ''),
                                (subject = ''),
                                (body = ''),
                                (date = ''),
                                (name = ''),
                                (messageId = '');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });

            imap.once('error', function (err) {
                if (err.textCode === 'AUTHENTICATIONFAILED')
                    reject({ error: err, message: 'Not Authenticated' });
            });

            imap.once('end', function () {
                resolve(inbox);
            });

            imap.connect();
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = inboxMiddleware;
