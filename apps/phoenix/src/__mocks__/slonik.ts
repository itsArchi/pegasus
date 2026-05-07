const noop = () => ({})
const sqlProxy: any = new Proxy(noop, {
  get: (_t, prop) => {
    if (prop === 'type') return () => sqlProxy
    if (prop === 'fragment') return sqlProxy
    if (prop === 'join') return noop
    return sqlProxy
  },
  apply: () => ({}),
})

export const sql = sqlProxy
export class NotFoundError extends Error { name = 'NotFoundError' }
export class UniqueIntegrityConstraintViolationError extends Error { name = 'UniqueIntegrityConstraintViolationError' }
export const createPool = jest.fn()
