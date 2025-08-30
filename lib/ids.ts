export function newDid() {
  return "did:example:" + Math.random().toString(36).slice(2)
}
export function newId() {
  return Math.random().toString(36).slice(2)
}
