import React, { Dispatch, SetStateAction, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import tickers from "~/ticker";

type CompanyPickerProps = {
  label: string;
  ticker: string;
  setTicker: Dispatch<SetStateAction<string>>;
};

const CompanyPicker = ({ label, ticker, setTicker }: CompanyPickerProps) => {
  let [search, setSearch] = useState("");
  let [open, setOpen] = useState(false);
  return (
    <Drawer onOpenChange={(o) => setOpen(o)} open={open}>
      <DrawerTrigger asChild>
        <div className="flex flex-col gap-2">
          <div>{label}</div>
          <button className="h-[53px] border border-black p-2 text-left">
            {tickers[ticker]}
          </button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex">
        <div className="flex flex-col gap-[40px]">
          <div className="mx-[40px] mt-[20px] text-[20px] font-semibold">
            Välj företag
          </div>
          <input
            className="mx-[40px] mb-[20px] h-[53px] border border-black px-2 text-black"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-[60dvh] overflow-y-scroll">
            {Object.keys(tickers)
              .filter(
                (ticker) =>
                  tickers[ticker]
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) || search === "",
              )
              .map((ticker, idx) => {
                return (
                  <div
                    className="flex h-[50px] cursor-pointer items-center justify-between border-b border-b-[#E2E2E2] px-[20px]"
                    onClick={() => {
                      setTicker(ticker);
                      setOpen(false);
                    }}
                    key={ticker + idx}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <img src="/swe.png" className="h-[14px] w-[22px]" />
                      <div className="text-[16px] font-medium">
                        {tickers[ticker]}
                      </div>
                    </div>
                    <div className="text-[16px] font-light">{ticker}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CompanyPicker;
