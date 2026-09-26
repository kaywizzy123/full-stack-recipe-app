import { CronJob } from "cron";
import { ENV } from "./env.js";

// Ping the API every 14 minutes so the hosting provider doesn't spin it down for inactivity
const job = new CronJob("*/14 * * * *", async function () {
  try {
    const res = await fetch(ENV.API_URL);

    if (res.ok) console.log("GET request sent successfully");
    else console.log("GET request failed", res.status);
  } catch (error) {
    console.error("Error while sending request", error);
  }
});

export default job;
