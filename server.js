const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    next = require('next'),
    api = require('./api.js'),
    helmet = require('helmet'),
    dev = process.env.NODE_ENV !== 'production',
    app = next({ dev }),
    handle = app.getRequestHandler(),
    PORT = process.env.PORT || 8080;

app.prepare()
    .then(() => {
        const server = express();
        server.use(helmet());
        server.use(cors({ credentials: true, origin: true }));
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());
        
        server.use('/api', api);

        server.get('*', (req, res) => {
            return handle(req, res)
        });

        /* 
         * Listen to the App Engine-specified port, or 8080 otherwise 
         */
        server.listen(PORT, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${PORT}`);
        })
    })
    .catch((ex) => {
        console.error(ex);
        process.exit(1);
    });
