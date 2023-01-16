// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import YahooStockAPI from '../../../src/dist/index'
import APIResponse from '../../../src/dist/index'

type Data = {
  stockA: any,
  stockB: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let { stockA, stockB } = req.query
    stockA = String(stockA).toLowerCase()
    stockB = String(stockB).toLowerCase()

    const yahoo = new YahooStockAPI();
    
    const stockAData = await yahoo.getSymbol({ symbol: `${stockA}.ST` });
    const stockBData = await yahoo.getSymbol({ symbol: `${stockB}.ST` });
    
    res.status(200).json({
      stockA: stockAData,
      stockB: stockBData
    })
}