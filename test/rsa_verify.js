const chai = require("chai");
const path = require("path");
const snarkjs = require("snarkjs");
const bigInt = require("big-integer");
const assert = chai.assert;
const tester = require("circom").tester;


const compiler = require("circom");

const { splitToWords, assertWitnessHas, splitToArray } = require("./util.js");

chai.should();

describe("Rsa pkcs1v15 verify", () => {
    let circuit;
    before(async () => {
        circuit = await tester(path.join(__dirname, "circuits", "rsa_verify.circom"));
    });


    it("2048 bits public key. correct sign. 1", async () => {
        // public key params. decimal
        const modulus = bigInt("27333278531038650284292446400685983964543820405055158402397263907659995327446166369388984969315774410223081038389734916442552953312548988147687296936649645550823280957757266695625382122565413076484125874545818286099364801140117875853249691189224238587206753225612046406534868213180954324992542640955526040556053150097561640564120642863954208763490114707326811013163227280580130702236406906684353048490731840275232065153721031968704703853746667518350717957685569289022049487955447803273805415754478723962939325870164033644600353029240991739641247820015852898600430315191986948597672794286676575642204004244219381500407");
        const exp = 65537;
        // signature. decimal
        const sign = bigInt("27166015521685750287064830171899789431519297967327068200526003963687696216659347317736779094212876326032375924944649760206771585778103092909024744594654706678288864890801000499430246054971129440518072676833029702477408973737931913964693831642228421821166326489172152903376352031367604507095742732994611253344812562891520292463788291973539285729019102238815435155266782647328690908245946607690372534644849495733662205697837732960032720813567898672483741410294744324300408404611458008868294953357660121510817012895745326996024006347446775298357303082471522757091056219893320485806442481065207020262668955919408138704593");
        // hashed data. decimal
        const hashed = bigInt("83814198383102558219731078260892729932246618004265700685467928187377105751529");

        const p_a = sign.shiftLeft(bigInt(64 * 32)).mod(modulus);
        const p_A = bigInt(1).shiftLeft(bigInt(64 * 32)).mod(modulus);
        const m0ninv = "12890617734997456953";

        const input = {
            p_a: splitToArray(p_a, 64, 32),
            p_A: splitToArray(p_A, 64, 32),
            exp: exp,
            p: splitToArray(modulus, 64, 32),
            m0ninv: m0ninv,
            hashed: splitToArray(hashed, 64, 4),
        };
        const witness = circuit.calculateWitness(input, true);
    });

    it("2048 bits public key. correct sign. 2", () => {
        // public key params. decimal
        const modulus = bigInt("24226501697440012621102249466312043787685293040734225606346036389705515508545746221669035424138747582133889500686654172873671086178893587422987328751464627501601101326475761646014534358699943642495332701081302954020983110372109611581202820849485662540890985814355975252780310958088652613376767040069489530039075302709233494829280591680666351811024913107949144932224439129715181798714328219977771472462901856297952813239115577652450722815852332547886777292613005505949100406231716599634852632308325816916535875123863510650526931916871614411907700873376659841257216885666098127478325534982891697988739616416855214839339");
        const exp = bigInt(65537);
        // signature. decimal
        const sign = bigInt("18928545496959757512579438348223103860103247450097569223971486743312798156950374943336714741350742176674694049986481729075548718599712271054643150030165230392897481507710187505775911256946250999396358633095137650326818007610162375520522758780751710735664264200260854016867498935206556916247099180950775474524799944404833222133011134000549939512938205188018503377612813102061504146765520561811620128786062447005833886367575841545493555268747671930923697279690399480501746857825917608323993022396398648205737336204493624060285359455268389160802763426461171262704764369336704988874821898000892148693988241020931055723252");
        // hashed data. decimal
        const hashed = bigInt("83814198383102558219731078260892729932246618004265700685467928187377105751529");

        const p_a = sign.shiftLeft(bigInt(64 * 32)).mod(modulus);
        const p_A = bigInt(1).shiftLeft(bigInt(64 * 32)).mod(modulus);
        const m0ninv = "4736324870124914557";

        const input = {
            p_a: splitToArray(p_a, 64, 32),
            p_A: splitToArray(p_A, 64, 32),
            exp: exp,
            p: splitToArray(modulus, 64, 32),
            m0ninv: m0ninv,
            hashed: splitToArray(hashed, 64, 4),
        };

        const witness = circuit.calculateWitness(input, true);
    });

    it("2048 bits public key. uncorrect sign. ", () => {
        // public key params. decimal
        const modulus = bigInt("24226501697440012621102249466312043787685293040734225606346036389705515508545746221669035424138747582133889500686654172873671086178893587422987328751464627501601101326475761646014534358699943642495332701081302954020983110372109611581202820849485662540890985814355975252780310958088652613376767040069489530039075302709233494829280591680666351811024913107949144932224439129715181798714328219977771472462901856297952813239115577652450722815852332547886777292613005505949100406231716599634852632308325816916535875123863510650526931916871614411907700873376659841257216885666098127478325534982891697988739616416855214839339");
        const exp = bigInt(65537);
        // signature. decimal
        const sign = bigInt("18928545496959756512579438348223103860103247450097569223971486743312798156950374943336714741350742176674694049986481729075548718599712271054643150030165230392897481507710187505775911256946250999396358633095137650326818007610162375520522758780751710735664264200260854016867498935206556916247099180950775474524799944404833222133011134000549939512938205188018503377612813102061504146765520561811620128786062447005833886367575841545493555268747671930923697279690399480501746857825917608323993022396398648205737336204493624060285359455268389160802763426461171262704764369336704988874821898000892148693988241020931055723252");
        // hashed data. decimal
        const hashed = bigInt("83814198383102558219731078260892729932246618004265700685467928187377105751529");


        const p_a = sign.shiftLeft(bigInt(64 * 32)).mod(modulus);
        const p_A = bigInt(1).shiftLeft(bigInt(64 * 32)).mod(modulus);
        const m0ninv = "4736324870124914557";

        const input = {
            p_a: splitToArray(p_a, 64, 32),
            p_A: splitToArray(p_A, 64, 32),
            exp: exp,
            p: splitToArray(modulus, 64, 32),
            m0ninv: m0ninv,
            hashed: splitToArray(hashed, 64, 4),
        };

        (function () {
            const witness = rsa_pkvs1v15_circuit.calculateWitness(input);
        }.should.throw());

    });
});

