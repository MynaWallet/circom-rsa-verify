const path = require("path");

const bigInt = require("big-integer");
const Scalar = require("ffjavascript").Scalar;
const tester = require("circom").tester;

const { splitToArray } = require("./util.js");


describe("montgomery reduction 64bits/32words.", function () {
    this.timeout(100000);

    let circuit;
    before(async () => {
        circuit = await tester(path.join(__dirname, "circuits", "montgomery_64_32.circom"));
    });

    it("64bits/32words. and 2048bits modulus", async () => {
        const n = bigInt("27333278531038650284292446400685983964543820405055158402397263907659995327446166369388984969315774410223081038389734916442552953312548988147687296936649645550823280957757266695625382122565413076484125874545818286099364801140117875853249691189224238587206753225612046406534868213180954324992542640955526040556053150097561640564120642863954208763490114707326811013163227280580130702236406906684353048490731840275232065153721031968704703853746667518350717957685569289022049487955447803273805415754478723962939325870164033644600353029240991739641247820015852898600430315191986948597672794286676575642204004244219381500407");

        const m0ninv = "12890617734997456953";

        const sign = bigInt("27166015521685750287064830171899789431519297967327068200526003963687696216659347317736779094212876326132375924944649760206771585778103092909024744594654706678288864890801000499430246054971129440518072576833029702477408973737931913964693831642228421821166326489172152903376352031367604507095742732994611253344812562891520292463788291973539285729019102238815435155266782647328690908245946607690372534644849495733662205697837732960032720813567898672483741410294744324300408404611458008868294953357660121510817012895745326996024006347446775298357303082471522757091056219893320485806442481065207020262668955919408138704593");

        // p_A = (2 ** (64 * 32)) % modulus
        const p_A = bigInt("8090504373870994679612627222357908172758809628981258425784309037819139630322144671528165987384165881554828460235243846620448472971597333672100823634983655619029776040825234445735663391689708464300724937302764614255809108270510144580635273488990507929690660037680329790107264933452413195230785359054440855482839030680434847591404383105898217683831262927377177125853366529615844393994132094172487120401275260427990790479346279705147628336449313356516920320620281725278025278479103610090304469418605506553142667456793187284519065351481384226307824293012777494286385249767131477166992943622060450204816237194204381391317");

        // p_a = (a * r) % modulus
        const p_a = sign.shiftLeft(bigInt(32 * 64)).mod(n);

        const result = sign.multiply(sign).mod(n);

        var testCases = [{
            description: "one word",
            input: {
                x: splitToArray(p_a, 64, 32),
                y: splitToArray(sign, 64, 32),
                modulus: splitToArray(n, 64, 32),
                m0inv: m0ninv,
            },
            output: {
                out: splitToArray(result, 64, 32)
            },
        }]

        for (var i = 0; i < testCases.length; i++) {
            const witness = await circuit.calculateWitness(testCases[i].input, true);

            await circuit.assertOut(witness, testCases[i].output);
        }
    });
});
