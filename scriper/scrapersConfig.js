import {superRichThailand} from "./superRichThailand";
import {centralBankOfThailand} from "./centralBankOfThailand";
import {siaMoneyExchange} from "./SIAMoneyExchange";
import {panneeExchange} from "./panneeExchange";
import {siamExchange} from "./siamExchange";
import {twelveVictoryExchange} from "./twelveVictoryExchange";

export const scrapersConfig = [
  {
    name: "Super Rich (Thailand)",
    difficulties: 3,
    scrape: superRichThailand
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
  },
  {
    name: "Twelve Victory Exchange",
    difficulties: 1,
    scrape: twelveVictoryExchange
  }
];
