import { useCallback } from "react";

export const useMessage = () => {
  const sendSms = useCallback(async (message: string, to_phone: string) => {
    const sid = import.meta.env.VITE_TWILIO_SID;
    const token = import.meta.env.VITE_TWILIO_TOKEN;
    console.log(sid);
    const response = await fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: "Basic " + btoa(sid + ":" + token),
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_PHONE,
          To: to_phone,
          Body: message,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  }, []);
  return { sendSms };
};
