import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Denom } from "kujira.js";
import { FC, Fragment } from "react";
import { Controller } from "./App";

const icons: Record<string, string> = {
  "factory/kujira1hf3898lecj8lawxq8nwqczegrla9denzfkx4asjg0q27cyes44sq68gvc9/ampKUJI":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/ampkuji.png",

  "factory/kujira1n3fr5f56r2ce0s37wdvwrk98yhhq3unnxgcqus8nzsfxvllk0yxquurqty/ampKUJI":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/ampkuji.png",

  "factory/kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr/ampMNTA":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/ampmnta.png",

  "factory/kujira1eqqr3ad0lh84ua4m5qu2n4jjz6h73d64jfwvng0w2k0lnhltt4jqdex4z9/urcpt":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/qckuji.svg",

  "factory/kujira1m96ucsfpt2yy72w09z2rxjdj38y5qd8lqx5jtggnejmdua2ynpnsxyvjex/urcpt":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/qckuji.svg",

  "factory/kujira1qzu3up50auxhqyzfq56znuj8n38q2ra7daaf9ef7vg8gu66jh4fqd2wd2y/urcpt":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/qcmnta.svg",

  "factory/kujira1l04ged98c7a7s9tllu62ld09ztylwf442qgm4thfgmadrvngeumsz4zrh2/urcpt":
    "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/qcfuzn.svg",

  "factory/kujira15e8q5wzlk5k38gjxlhse3vu6vqnafysncx2ltexd6y9gx50vuj2qpt7dgv/boneKuji":
    "https://raw.githubusercontent.com/unstake-fi/ui/master/public/bKUJI.png",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const TokenSelect: FC<{
  controllers?: Record<string, Controller>;
  controller?: Controller;
  setSelected: (v: string) => void;
}> = ({ controllers, controller, setSelected }) => {
  return (
    <Listbox value={controller?.address} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-semibold leading-6 text-slate-400">
            Unbond:
          </Listbox.Label>
          <div className="relative mt-1">
            {controller && (
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-800 py-2 pl-3 pr-10 text-left text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 focus:outline-none focus:ring-slate-500 sm:text-sm sm:leading-6 text-base">
                <span className="flex items-center">
                  <img
                    src={icons[controller.config.ask_denom]}
                    alt=""
                    className="h-5 w-5 flex-shrink-0 rounded-full"
                  />
                  <span className="ml-3 block truncate">
                    {Denom.from(controller.config.ask_denom).symbol}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-slate-500"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
            )}

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-700 text-base shadow-lg ring-1 ring-slate-600 focus:outline-none sm:text-sm">
                {controllers &&
                  Object.entries(controllers).map(([address, x]) => (
                    <Listbox.Option
                      key={address}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-slate-600 text-white" : "text-slate-400",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={address}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={icons[x.config.ask_denom]}
                              alt=""
                              className="h-5 w-5 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {Denom.from(x.config.ask_denom).symbol}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-slate-400",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
