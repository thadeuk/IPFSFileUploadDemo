// Dependency
const IPFS = require("ipfs");
const all = require("it-all");

async function storeString(data) {
  const node = await IPFS.create();
  const cid = await node.add(data);
  console.log(cid.path);
  return cid.path;
}

async function retrieveString(cid) {
  const node = await IPFS.create();
  const chunks = await all(node.cat(cid));
  const resp = chunks.reduce((data, byte) => data + new TextDecoder("utf-8").decode(byte), '')
  return resp;
}

module.exports = {
  storeString,
  retrieveString
}