"use server";

import { koinlyUniversal } from "@/src/adapters/koinly/universal";

export const convertToKoinlyUniversal = async ({
  exchangeName,
}: {
  exchangeName: keyof typeof koinlyUniversal;
}) => {
  try {
    await koinlyUniversal[exchangeName]();
    return {
      success: true,
      message: "Successfully converted to Koinly format",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `unable to convert data to Koinly format for ${exchangeName}`,
    };
  }
};
