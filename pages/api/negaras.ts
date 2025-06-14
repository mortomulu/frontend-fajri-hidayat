import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get("http://202.157.176.100:3001/negaras");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch negara data" });
  }
}
