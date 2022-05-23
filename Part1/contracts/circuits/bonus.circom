// [bonus] implement an example game from part d 
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

template GuessWho() {
    // Public inputs
    signal input pubGuessHair;
    signal input pubGuessEyes;
    signal input pubGuessSkin;
    signal input pubGuessAge;
    signal input pubGuessExpression;
    signal input pubNumHit;
    signal input pubSolnHash;

    // Private inputs
    signal input privSolnHair;
    signal input privSolnEyes;
    signal input privSolnSkin;
    signal input privSolnAge;
    signal input privSolnExpression;
    signal input privSalt;

    // Output
    signal output solnHashOut;

    var guess[5] = [pubGuessHair, pubGuessEyes, pubGuessSkin, pubGuessAge, pubGuessExpression];
    var soln[5] =  [privSolnHair, privSolnEyes, privSolnSkin, privSolnAge, privSolnExpression];
    var j = 0;
    var k = 0;
    component lessThan[8];
    component equalGuess[6];
    component equalSoln[6];

    // Count hit 
    var hit = 0;
    component equalHB[25];

    for (j=0; j<5; j++) {
        for (k=0; k<5; k++) {
            equalHB[5*j+k] = IsEqual();
            equalHB[5*j+k].in[0] <== soln[j];
            equalHB[5*j+k].in[1] <== guess[k];
            if (j == k) {
                hit += equalHB[5*j+k].out;
            }
        }
    }

    // Create a constraint around the number of hit
    component equalHit = IsEqual();
    equalHit.in[0] <== pubNumHit;
    equalHit.in[1] <== hit;
    equalHit.out === 1;
    
    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(6);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSolnHair;
    poseidon.inputs[2] <== privSolnEyes;
    poseidon.inputs[3] <== privSolnSkin;
    poseidon.inputs[4] <== privSolnAge;
    poseidon.inputs[5] <== privSolnExpression;

    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
 }

 component main {public [pubGuessHair, pubGuessEyes, pubGuessSkin, pubGuessAge,pubGuessExpression, pubNumHit, pubSolnHash]} = GuessWho();