//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const {buildPoseidon} = require('circomlibjs');

const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

const convertUINT8ArrayToBI = (u8) => {
    var hex = [];
    u8.forEach(function (i) {
      var h = i.toString(16);
      if (h.length % 2) { h = '0' + h; }
      hex.push(h);
    });
  
    return BigInt('0x' + hex.join(''));
}

describe("Mastermind test", function () {
    this.timeout(100000000);

    it("Mastermind", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const poseidon = await buildPoseidon();
        const INPUT = {
            "pubGuessA": "4",
            "pubGuessB": "2",
            "pubGuessC": "5",
            "pubGuessD": "1",
            "pubNumHit": "2",
            "pubNumBlow": "0",
            "pubSolnHash": poseidon.F.toString(poseidon([149023,6,2,3,1,12])),
            "pubGuessSum": "12",
            "privSolSum": "12",
            "privSolnA": "6",
            "privSolnB": "2",
            "privSolnC": "3",
            "privSolnD": "1",
            "privSalt": "149023"
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(poseidon.F.toString(poseidon([149023,6,2,3,1,12])))));
    });
});