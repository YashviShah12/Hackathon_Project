import { MongoClient, type Db, type Collection } from "mongodb"

type InMemoryStore = {
  producers: any[]
  iotReadings: any[]
  certifications: any[]
  credits: any[]
  listings: any[]
  transactions: any[]
  proposals: any[]
  votes: any[]
  passports: any[]
  haas: any[]
}

let cachedDb: Db | null = null
let cachedClient: MongoClient | null = null
let mem: InMemoryStore | null = null

export async function getMongo() {
  const uri = process.env.MONGODB_URI
  if (!uri) return null
  if (cachedDb && cachedClient) return cachedDb
  cachedClient = new MongoClient(uri)
  await cachedClient.connect()
  cachedDb = cachedClient.db(process.env.MONGODB_DB || "hydrogen_nexus")
  return cachedDb
}

function getMem(): InMemoryStore {
  if (!mem) {
    mem = {
      producers: [],
      iotReadings: [],
      certifications: [],
      credits: [],
      listings: [],
      transactions: [],
      proposals: [],
      votes: [],
      passports: [],
      haas: [],
    }
  }
  return mem
}

export async function getCollection<T = any>(
  name: keyof InMemoryStore,
): Promise<
  Collection<T> | { find: any; insertOne: any; updateOne: any; deleteOne: any; findOne: any; findOneAndUpdate: any }
> {
  const db = await getMongo()
  if (db) return db.collection<T>(String(name))

  // In-memory polyfill with minimal Mongo-like API
  const store = getMem()
  const arr = store[name] as any[]

  return {
    find: (query: any = {}) => ({
      toArray: async () => {
        return arr.filter((doc) => {
          return Object.entries(query).every(([k, v]) => doc[k] === v)
        })
      },
    }),
    insertOne: async (doc: any) => {
      arr.push({ ...doc, _id: doc._id || cryptoRandomId() })
      return { acknowledged: true }
    },
    updateOne: async (filter: any, update: any) => {
      const idx = arr.findIndex((d) => matches(d, filter))
      if (idx !== -1) {
        if (update.$set) arr[idx] = { ...arr[idx], ...update.$set }
        if (update.$inc) {
          for (const k in update.$inc) {
            arr[idx][k] = (arr[idx][k] || 0) + update.$inc[k]
          }
        }
        return { matchedCount: 1, modifiedCount: 1 }
      }
      return { matchedCount: 0, modifiedCount: 0 }
    },
    deleteOne: async (filter: any) => {
      const idx = arr.findIndex((d) => matches(d, filter))
      if (idx !== -1) {
        arr.splice(idx, 1)
        return { deletedCount: 1 }
      }
      return { deletedCount: 0 }
    },
    findOne: async (filter: any) => {
      return arr.find((d) => matches(d, filter)) || null
    },
    findOneAndUpdate: async (filter: any, update: any) => {
      const idx = arr.findIndex((d) => matches(d, filter))
      if (idx !== -1) {
        if (update.$set) arr[idx] = { ...arr[idx], ...update.$set }
        return { value: arr[idx] }
      }
      return { value: null }
    },
  }
}

function matches(doc: any, filter: any) {
  return Object.entries(filter).every(([k, v]) => doc[k] === v)
}
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return (crypto as any).randomUUID()
  return Math.random().toString(36).slice(2)
}
