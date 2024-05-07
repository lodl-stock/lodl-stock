import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config()

if (process.argv.length != 3) {
    console.log("Please provide exactly one argument (test run json file)");
    process.exit(1);
}

const checkout = require(process.argv[2]);

axios.post(
    `${process.env.BUSINESS_URL}/${checkout.storeId}/checkout`,
    checkout.cart,
    { headers: { "Authorization": process.env.AUTH } }
);
