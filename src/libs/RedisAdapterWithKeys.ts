import { RedisAdapter } from '@grammyjs/storage-redis'
import type { StorageAdapter } from 'grammy'
import type { Redis } from 'ioredis'

export class RedisAdapterWithKeys<T> extends RedisAdapter<T> implements StorageAdapter<T> {
  constructor(private readonly instance: Redis) {
    super({
      instance,
      autoParseDates: true,
    })
  }

  async *readAllKeys(): AsyncIterable<string> {
    const pattern = '*'
    let cursor = '0'

    do {
      const [nextCursor, keys] = await this.instance.scan(cursor, 'MATCH', pattern, 'COUNT', 100)

      cursor = nextCursor

      for (const key of keys) {
        yield key
      }
    } while (cursor !== '0')
  }
}
