import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id_negara } = req.query;

  if (!id_negara) {
    return res.status(400).json({ message: "id_negara is required" });
  }

  try {
    const filter = {
      where: { id_negara: Number(id_negara) },
    };

    const response = await axios.get(
      `http://202.157.176.100:3001/pelabuhans?filter=${encodeURIComponent(
        JSON.stringify(filter)
      )}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching pelabuhans:", error);
    res.status(500).json({ message: "Failed to fetch pelabuhans" });
  }
}
