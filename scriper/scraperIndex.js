import {superRichThailand} from "./superRichThailand";
import {centralBankOfThailand} from "./centralBankOfThailand";
import {siaMoneyExchange} from "./SIAMoneyExchange";

export const scraperIndex = [
  {
    name: "SuperRichThailand",
    difficulties: 3,
    scraper: superRichThailand
  },
  {
    name: "Central Bank Of Thailand",
    difficulties: 2,
    scraper: centralBankOfThailand
  },
  {
    name: "SIA Money Exchange",
    difficulties: 1,
    scraper: siaMoneyExchange
  }
];