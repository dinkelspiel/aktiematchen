import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StockResponse } from "../api/[stockA]/[stockB]";
import StockInfo from "~/type/stockInfo";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import CompanyPicker from "~/components/companyPicker";
import TrendUp from "~/components/icons/trendUp";
import TrendDown from "~/components/icons/trendDown";

export default function Home() {
  const router = useRouter();

  const [stockA, setStockA] = useState<StockInfo | undefined>(undefined);
  const [stockB, setStockB] = useState<StockInfo | undefined>(undefined);

  const [stockATicker, setStockATicker] = useState<string>("");
  const [stockBTicker, setStockBTicker] = useState<string>("");

  const [marketCapData, setMarketCapData] = useState<
    { name: string; value: number }[]
  >([]);

  const formatter = new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  });

  const toHumanString = (price: number): string => {
    return formatter.format(price).substring(0, 6);
  };

  const fetchStocks = async (stockATicker: string, stockBTicker: string) => {
    let url = `/api/${stockATicker}/${stockBTicker}`;
    const response: StockResponse = await (await fetch(url)).json();

    window.history.replaceState(null, "", `/${stockATicker}/${stockBTicker}`);

    setStockA(response.stockA);
    setStockB(response.stockB);

    setMarketCapData([
      {
        name: response.stockA.symbol,
        value: response.stockA.marketCap,
      },
      {
        name: response.stockB.symbol,
        value: response.stockB.marketCap,
      },
    ]);
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { stockA, stockB } = router.query;
    fetchStocks(stockA as string, stockB as string);
    setStockATicker(stockA as string);
    setStockBTicker(stockB as string);
  }, [router.isReady]);

  let [changeOpen, setChangeOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{router.query.stockA}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full flex-col gap-[36px] min-[700px]:w-[700px]">
        <div className="flex h-[71px] w-full items-center justify-between bg-[#f5f5f5] px-[20px]">
          <div className="text-2xl font-semibold">Aktiematchen</div>
          <Drawer onOpenChange={(o) => setChangeOpen(o)} open={changeOpen}>
            <DrawerTrigger asChild>
              <div className="text-xsm cursor-pointer underline">
                Byt företag
              </div>
            </DrawerTrigger>
            <DrawerContent className="flex px-[40px]">
              <div className="flex flex-col gap-[40px]">
                <div className="mt-[20px] text-[20px] font-semibold">
                  Välj företag
                </div>
                <CompanyPicker
                  ticker={stockATicker}
                  label="Företag 1"
                  setTicker={setStockATicker}
                />
                <CompanyPicker
                  ticker={stockBTicker}
                  label="Företag 2"
                  setTicker={setStockBTicker}
                />
                <button
                  className="mb-[20px] h-[53px] bg-black text-white"
                  onClick={() => {
                    fetchStocks(stockATicker, stockBTicker);
                    setChangeOpen(false);
                  }}
                >
                  Uppdatera
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex flex-row justify-between px-[20px]">
          <div className="flex flex-col gap-[3px]">
            <div className="w-max rounded-full border border-gray-200 px-2 text-[9px] font-semibold">
              {stockA?.symbol.substring(0, stockA.symbol.length - 3)}
            </div>
            <div className="font-medium">{stockA?.shortName}</div>
          </div>
          <div className="text-bott mt-auto h-max align-text-bottom text-gray-500">
            vs
          </div>
          <div className="flex flex-col gap-[3px]">
            <div className="ms-auto w-max rounded-full border border-gray-200 px-2 text-[9px] font-semibold">
              {stockB?.symbol.substring(0, stockB.symbol.length - 3)}
            </div>
            <div className="font-medium">{stockB?.shortName}</div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col">
              <div>
                <span className="text-[36px] font-semibold">
                  {stockA !== undefined && stockB !== undefined
                    ? (
                        (stockA.marketCap /
                          (stockB.marketCap + stockA.marketCap)) *
                        100
                      ).toFixed(1)
                    : 0}
                </span>
                <span className="h-[54px] align-text-bottom text-[15px] font-semibold">
                  %
                </span>
              </div>
              {stockA !== undefined && (
                <div
                  className={` flex items-center gap-2 text-sm ${stockA.regularMarketChangePercent < 0 ? "fill-red-500 text-red-500" : "fill-green-500 text-green-500"}`}
                >
                  {stockA.regularMarketChangePercent >= 0 ? (
                    <TrendUp className="h-3 w-3" />
                  ) : (
                    <TrendDown className="h-3 w-3" />
                  )}
                  {stockA.regularMarketChangePercent.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <PieChart width={130} height={120}>
              <Pie
                data={marketCapData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                startAngle={-270}
                stroke="black"
                strokeWidth={1}
              >
                {marketCapData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#000000" : "#fff"}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col">
              <div>
                <span className="text-[36px] font-semibold">
                  {stockA !== undefined && stockB !== undefined
                    ? (
                        (stockB.marketCap /
                          (stockB.marketCap + stockA.marketCap)) *
                        100
                      ).toFixed(1)
                    : 0}
                </span>
                <span className="h-[54px] align-text-bottom text-[15px] font-semibold">
                  %
                </span>
              </div>
              {stockB !== undefined && (
                <div
                  className={` flex items-center justify-end gap-2 text-right text-sm ${stockB.regularMarketChangePercent < 0 ? "fill-red-500 text-red-500" : "fill-green-500 text-green-500"}`}
                >
                  {stockB.regularMarketChangePercent >= 0 ? (
                    <TrendUp className="h-3 w-3" />
                  ) : (
                    <TrendDown className="h-3 w-3" />
                  )}
                  {stockB.regularMarketChangePercent.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <table className="w-full">
            <thead>
              <tr className="h-[56px] border-b border-t border-[#C5C5C5] bg-[#F5F5F5] text-[14px] font-semibold text-[#A1A1A1]">
                <th className="w-full ps-[20px] text-left">JÄMFÖR</th>
                <th className="min-w-[71px] text-left ">
                  {stockA?.symbol.substring(0, stockA.symbol.length - 3)}
                </th>
                <th className="min-w-[71px] pr-[20px] text-left ">
                  {stockB?.symbol.substring(0, stockB.symbol.length - 3)}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Compared to yesterday */}
              <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                <td className="ps-[20px]">Igår</td>
                {stockA !== undefined && stockB !== undefined && (
                  <>
                    <td>
                      {(
                        (stockA.marketCap /
                          (1 + stockA.regularMarketChangePercent / 100) /
                          (stockA.marketCap /
                            (1 + stockA.regularMarketChangePercent / 100) +
                            stockB.marketCap /
                              (1 + stockB.regularMarketChangePercent / 100))) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td className="pr-[20px]">
                      {(
                        (stockB.marketCap /
                          (1 + stockB.regularMarketChangePercent / 100) /
                          (stockA.marketCap /
                            (1 + stockA.regularMarketChangePercent / 100) +
                            stockB.marketCap /
                              (1 + stockB.regularMarketChangePercent / 100))) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </>
                )}
              </tr>

              {/* Compared to last year */}
              <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                <td className="ps-[20px]">Ett år</td>
                {stockA !== undefined && stockB !== undefined && (
                  <>
                    <td>
                      {(
                        (stockA.marketCap /
                          (1 + stockA.fiftyTwoWeekChangePercent / 100) /
                          (stockA.marketCap /
                            (1 + stockA.fiftyTwoWeekChangePercent / 100) +
                            stockB.marketCap /
                              (1 + stockB.fiftyTwoWeekChangePercent / 100))) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td className="pr-[20px]">
                      {(
                        (stockB.marketCap /
                          (1 + stockB.fiftyTwoWeekChangePercent / 100) /
                          (stockA.marketCap /
                            (1 + stockA.fiftyTwoWeekChangePercent / 100) +
                            stockB.marketCap /
                              (1 + stockB.fiftyTwoWeekChangePercent / 100))) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </>
                )}
              </tr>

              {/* Kurs */}
              <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                <td className="ps-[20px]">Kurs</td>
                {stockA !== undefined && stockB !== undefined && (
                  <>
                    <td>{stockA.regularMarketPrice}</td>
                    <td className="pr-[20px]">{stockB.regularMarketPrice}</td>
                  </>
                )}
              </tr>

              {/* Vinst/Aktie */}
              <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                <td className="ps-[20px]">Vinst/Aktie</td>
                {stockA !== undefined && stockB !== undefined && (
                  <>
                    <td>{stockA.epsCurrentYear}</td>
                    <td className="pr-[20px]">{stockB.epsCurrentYear}</td>
                  </>
                )}
              </tr>

              {/* Market Cap */}
              <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                <td className="ps-[20px]">
                  Börsvärde <span className="text-[#BCBCBC]">MSEK</span>
                </td>
                {stockA !== undefined && stockB !== undefined && (
                  <>
                    <td>{toHumanString(stockA.marketCap)}</td>
                    <td className="pr-[20px]">
                      {toHumanString(stockB.marketCap)}
                    </td>
                  </>
                )}
              </tr>

              {stockA?.trailingPE && stockB?.trailingPE && (
                <>
                  {/* P/E */}
                  <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                    <td className="ps-[20px]">P/E</td>
                    {stockA !== undefined && stockB !== undefined && (
                      <>
                        <td>{stockA.trailingPE.toFixed(2)}</td>
                        <td className="pr-[20px]">
                          {stockB.trailingPE.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>

                  {/* P/E Ratio */}
                  <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[14px] font-semibold">
                    <td className="ps-[20px]">P/E Ratio</td>
                    {stockA !== undefined && stockB !== undefined && (
                      <>
                        <td>
                          {(
                            (stockA.trailingPE /
                              (stockA.trailingPE + stockB.trailingPE)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                        <td className="pr-[20px]">
                          {(
                            (stockB.trailingPE /
                              (stockA.trailingPE + stockB.trailingPE)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                      </>
                    )}
                  </tr>
                  <tr className="h-[56px] border-b border-b-[#E2E2E2] text-[12px] font-semibold">
                    <td className="ps-[20px]"></td>
                    {stockA !== undefined && stockB !== undefined && (
                      <td colSpan={2}>
                        <div className="flex flex-row">
                          <div
                            className="h-[22px] bg-black"
                            style={{
                              width:
                                (stockA.trailingPE /
                                  (stockA.trailingPE + stockB.trailingPE)) *
                                126,
                            }}
                          ></div>
                          <div
                            className="h-[22px] border border-black"
                            style={{
                              width:
                                (stockB.trailingPE /
                                  (stockA.trailingPE + stockB.trailingPE)) *
                                126,
                            }}
                          ></div>
                        </div>
                      </td>
                    )}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
