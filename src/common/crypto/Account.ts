type Algorithm = "secp256k1" | "rsa";

export class KeyManager {

    private alg: Algorithm;

    constructor(alg: Algorithm){
        this.alg = alg
    }

    sign(message: Uint8Array){

    }


}