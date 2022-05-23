// [bonus] unit test for bonus.circom
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

describe("Bonus test", function () {
    this.timeout(100000000);

    it("Bonus", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();
        const poseidon = await buildPoseidon();
        const pubGuessHair = BigInt('0x' + Buffer.from("blonde", "utf-8").toString('hex'));
        const pubGuessEyes = BigInt('0x' + Buffer.from("blue", "utf-8").toString('hex'));
        const pubGuessSkin = BigInt('0x' + Buffer.from("dark", "utf-8").toString('hex'));
        const pubGuessAge = BigInt('0x' + Buffer.from("elderly", "utf-8").toString('hex'));
        const pubGuessExpression = BigInt('0x' + Buffer.from("smiling", "utf-8").toString('hex'));
        const privSolnHair = BigInt('0x' + Buffer.from("blonde", "utf-8").toString('hex'));
        const privSolnEyes = BigInt('0x' + Buffer.from("green", "utf-8").toString('hex'));
        const privSolnSkin = BigInt('0x' + Buffer.from("light", "utf-8").toString('hex'));
        const privSolnAge = BigInt('0x' + Buffer.from("young", "utf-8").toString('hex'));
        const privSolnExpression = BigInt('0x' + Buffer.from("smiling", "utf-8").toString('hex'));
        const INPUT = {
            "pubGuessHair": pubGuessHair,
            "pubGuessEyes": pubGuessEyes,
            "pubGuessSkin": pubGuessSkin,
            "pubGuessAge": pubGuessAge,
            "pubGuessExpression": pubGuessExpression,
            "pubNumHit": "2",
            "pubSolnHash": poseidon.F.toString(poseidon([149023,privSolnHair, privSolnEyes, privSolnSkin, privSolnAge,privSolnExpression])),
            "privSolnHair": privSolnHair,
            "privSolnEyes": privSolnEyes,
            "privSolnSkin": privSolnSkin,
            "privSolnAge": privSolnAge,
            "privSolnExpression": privSolnExpression,
            "privSalt": "149023"
        }
        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(poseidon.F.toString(poseidon([149023,privSolnHair,privSolnEyes,privSolnSkin,privSolnAge,privSolnExpression])))));
    });
});