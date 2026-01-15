import { liffId, transactionsLiffId } from "@/configs";
import liff, { Liff } from "@line/liff";

export const initLiff = (): Promise<Liff | null> => {
  const resolvedLiffId =
    typeof window !== "undefined"
      ? (() => {
          const referrer = new URLSearchParams(globalThis.location.search).get(
            "liff.referrer"
          );

          if (referrer === "transactions" && transactionsLiffId) {
            return transactionsLiffId;
          }

          return liffId;
        })()
      : liffId;

  return liff
    .init({ liffId: resolvedLiffId })
    .then(() => {
      console.log("liff.init() done");
      return liff;
    })
    .catch((error) => {
      console.log(`liff.init() failed: ${error}`);
      if (!resolvedLiffId) {
        console.info(
          "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
        );
      }
      throw error;
    });
};

export const liffLogin = (): void => {
  return liff.login();
};
