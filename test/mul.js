const path = require("path");

const bigInt = require("big-integer");
const Scalar = require("ffjavascript").Scalar;
const tester = require("circom").tester;

const { splitToArray } = require("./util.js");


describe("Montgomery exponent 64bits/32words111111", function () {
    this.timeout(100000);

    let circuit;
    before(async () => {
        circuit = await tester(path.join(__dirname, "circuits", "mul.circom"));
    });

    it("64bits/1words. Polynomial Multiplier", async () => {

        const x = bigInt("27166015521685750287064830171899789431519297967327068200526003963687696216659347317736779094212876326032375924944649760206771585778103092909024744594654706678288864890801000499430246054971129440518072676833029702477408973737931913964693831642228421821166326489172152903376352031367604507095742732994611253344812562891520292463788291973539285729019102238815435155266782647328690908245946607690372534644849495733662205697837732960032720813567898672483741410294744324300408404611458008868294953357660121510817012895745326996024006347446775298357303082471522757091056219893320485806442481065207020262668955919408138704593");

        const y = bigInt("27166015521685750287064830171899789431519297967327068200526003963687696216659347317736779094212876326032375924944649760206771585778103092909024744594654706678288864890801000499430246054971129440518072676833029702477408973737931913964693831642228421821166326489172152903376352031367604507095742732994611253344812562891520292463788291973539285729019102238815435155266782647328690908245946607690372534644849495733662205697837732960032720813567898672483741410294744324300408404611458008868294953357660121510817012895745326996024006347446775298357303082471522757091056219893320485806442481065207020262668955919408138704593");

        const result = x.multiply(y);
        var testCases = [{
            description: "calc powerMod",
            input: {
                // 1844674407370955161600
                in0: splitToArray(x, 64, 32),
                in1: splitToArray(y, 64, 32),

            },
            output: { out: [
                "184844210027151388892934458841320724129",
                "458877555447551606985976398272636369790",
                "310847914647051799709057266981032763843",
                "68158120836031314442767057703068634816",
                "501339735894090405155201467959470373683"
            ] },
        }];


        for (var i = 0; i < testCases.length; i++) {
            const witness = await circuit.calculateWitness(testCases[i].input, true);

            await circuit.assertOut(witness, testCases[i].output);
        }
    });
});
