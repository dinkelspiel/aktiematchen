import { NextApiRequest, NextApiResponse } from "next";
import yahooFinance from "yahoo-finance2";
import StockInfo from "~/type/stockInfo";

export interface StockResponse {
  stockA: StockInfo;
  stockB: StockInfo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StockResponse>,
) {
  let { stockA, stockB } = req.query;
  stockA = String(stockA).toLowerCase();
  stockB = String(stockB).toLowerCase();

  const stockAData = await yahooFinance.quote(stockA + ".ST");
  const stockBData = await yahooFinance.quote(stockB + ".ST");

  res.status(200).json({
    stockA: stockAData as unknown as StockInfo,
    stockB: stockBData as unknown as StockInfo,
  });
}
