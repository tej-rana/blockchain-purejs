const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const uuid = require('uuid');
const ec = new EC('secp256k1');

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuid.v1(); //https://www.sohamkamani.com/uuid-versions-explained/
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    /**
     *
     * @param publicKey Public key to decrypt
     * @param signature Signature provided
     * @param dataHash Message
     * @returns {*}  True if public key matches sig of message
     */
    static verifySignature(publicKey, signature, dataHash)
    {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
    }
}

module.exports = ChainUtil;