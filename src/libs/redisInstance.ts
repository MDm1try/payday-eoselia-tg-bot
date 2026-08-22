import IORedis from 'ioredis'

import { REDIS_URL } from '../config'

const redisInstance = new IORedis(REDIS_URL as string)

export default redisInstance
