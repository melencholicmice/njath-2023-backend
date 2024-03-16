import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import logger from './utils/logger.js'
import cookieParser from 'cookie-parser'
import config from './config/default.mjs'
import authRouter from './routes/auth.route.js'
import { connectdb } from './utils/connectDb.js'
import { USER_ROLE } from './models/user.model.js'
import { checkUser } from './middlewares/checkUser.js'
import questionRouter from './routes/question.route.js'
import participantRoutes from './routes/participant.route.js'

const app = express()

const allowedOrigins = [
    'http://localhost:3000',
    // NOTE: remove this origins in case your frontend is not hosted on these domains
    'https://njath-2023.vercel.app',
    'https://njath-2023-demo.netlify.app',
    // Add more origins as needed
]

// -----------MIDDLEWARE-------------
app.use(
    cors({
        origin: allowedOrigins,
        // NOTE: Allowing all methods currently, remove unused ones for more security
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    }),
)

app.use(express.json())
app.use(cookieParser())

morgan.token('pino-logger', (req, res) => {
    // all it does is print incoming http request
    logger.info({ method: req.method, url: req.originalUrl }, 'HTTP Request')
    return ''
})
app.use(morgan(':pino-logger'))

// -----------ROUTES---------------

app.use('/api/auth', authRouter)
app.use('/api/question', questionRouter)
app.use(
    '/api/participant',
    checkUser([USER_ROLE.PARTICIPANT]),
    participantRoutes,
)

app.use('*', (req, res, next) => {
    return res.status(404).json({
        message: 'Not found',
    })
})

// -----------START SERVER------------
app.listen(config.port, () => {
    logger.info(`🚀 Server is running on port ${config.port}`)
})
connectdb()
