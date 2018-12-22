import {superRichThailand} from "./superRichThailand";
import {centralBankOfThailand} from "./centralBankOfThailand";
import {siaMoneyExchange} from "./SIAMoneyExchange";
import {panneeExchange} from "./panneeExchange";
import {siamExchange} from "./siamExchange";

export const scrapersConfig = [
  {
    name: "SuperRichThailand",
    difficulties: 3,
    scrape: superRichThailand
  },
  {
    name: "Central Bank Of Thailand",
    difficulties: 2,
    scrape: centralBankOfThailand
  },
  {
    name: "SIA Money Exchange",
    difficulties: 1,
    scrape: siaMoneyExchange
  },
  {
    name: "Pannee Exchange",
    difficulties: 1,
    scrape: panneeExchange
  },
  {
    name: "Siam Exchange",
    difficulties: 1,
    scrape: siamExchange
  }
];