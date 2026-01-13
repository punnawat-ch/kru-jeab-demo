import { liffId } from "@/configs";
import liff, { Liff } from "@line/liff";

export const initLiff = (): Promise<Liff | null> => {
  return liff
    .init({ liffId: liffId })
    .then(() => {
      console.log("liff.init() done");
      return liff;
    })
    .catch((error) => {
      console.log(`liff.init() failed: ${error}`);
      if (!liffId) {
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
