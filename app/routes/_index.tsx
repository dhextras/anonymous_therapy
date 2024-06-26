import { useEffect } from "react";
import {
  Form,
  json,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";

import { createPendingUser } from "~/db/utils";
import { handleError } from "~/utils/notifications";
import { generateMeta } from "~/utils/generateMeta";
import { preventUserAccessForTherapists } from "~/utils/session.server";
import {
  generateRandomName,
  getPredefinedText,
} from "~/utils/userDetailsHelper";

import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import type { PendingUser } from "~/types/db.types";

export const meta: MetaFunction = generateMeta("Home");

/**
 * Prevents therapists from accessing the page.
 * @param {LoaderFunctionArgs} args - Remix loader function arguments.
 * @returns {Promise<null>} - Always returns null.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await preventUserAccessForTherapists(request);
  return null;
};

/**
 * Creates a new pending user and redirects to the user chat page.
 * @param {ActionFunctionArgs} args - Remix action function arguments.
 * @returns {Promise<Response>} - Redirect response or JSON response with pending user data.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  let userName = formData.get("userName")?.toString() || "";
  let userMessage = formData.get("userMessage")?.toString() || "";

  if (userName === "") {
    userName = generateRandomName();
  }
  if (userMessage === "") {
    userMessage = getPredefinedText();
  }

  const pendingUser = await createPendingUser(userName, userMessage);
  if (pendingUser) {
    return redirect(`/userChat/${pendingUser.user_id}`);
  }

  return json({ pendingUser });
};

export default function Index() {
  const pendingUser = useActionData<PendingUser>();
  const navigation = useNavigation();

  useEffect(() => {
    if (pendingUser !== undefined) {
      handleError(
        "Wasn't able to create a pending user on the database",
        "Something wrong. Try again..."
      );
    }
  }, [pendingUser]);

  return (
    <div className="max-w-md mx-auto flex flex-col justify-between max-h-secondary-div py-6">
      <div className="text-center mb-8 mx-4">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to GuardedHeart Therapy!
        </h1>
        <p className="text-secondary">
          Get matched with a therapist ANONYMOUSLY
        </p>
      </div>

      <div className="flex flex-col space-y-4 mx-4">
        <Form method="post" className="flex flex-col space-y-4 mb-2">
          <div>
            <input
              type="text"
              name="userName"
              className="w-full border border-custom rounded-md py-2 px-3 focus:outline-none focus:ring-2 text-black "
              placeholder="Your name (if you'd like)"
            />
          </div>
          <div>
            <textarea
              name="userMessage"
              rows={4}
              className="w-full border border-custom rounded-md py-2 px-3 focus:outline-none focus:ring-2 text-black bg-white"
              placeholder="What's on your mind that's troubling you? We are here to listen."
            />
          </div>
          <button
            type="submit"
            disabled={
              navigation.state === "submitting" ||
              navigation.state === "loading"
            }
            className="w-full bg-base text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 "
          >
            {navigation.state === "submitting" || navigation.state === "loading"
              ? "Starting Chat..."
              : "Start Chat"}
          </button>
        </Form>
      </div>
    </div>
  );
}
