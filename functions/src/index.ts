import * as functions from "firebase-functions";
import axios from "axios";

type RequestBody = {
  name: string;
  company?: string;
  email: string;
  summary: string;
  token: string;
  subscribe?: boolean;
};

export const emailMe = functions
  .runWith({ secrets: ["RECAPTCHA_SECRET_KEY"] })
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    functions.logger.info(JSON.stringify(request.body));

    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    const { token } = request.body as RequestBody;

    try {
      const reCaptcha = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
      );
      const isSuccess = reCaptcha.data && reCaptcha.data.success;
      if (isSuccess) {
        // call api
      }
    } catch (err) {
      functions.logger.error(`Unable to process: ${JSON.stringify(err)}`, {
        structuredData: true,
      });
    }

    response.send({
      success: false,
      message: "Unable to process request",
    });
  });
