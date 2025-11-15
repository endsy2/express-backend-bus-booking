import crypto from "crypto"

const secret=crypto.randomBytes(64).toString("Hex")
console.log("Key:"+secret)