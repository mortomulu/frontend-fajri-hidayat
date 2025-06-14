import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id_pelabuhan } = req.query;

  if (!id_pelabuhan) {
    return res.status(400).json({ message: "id_pelabuhan is required" });
  }

  try {
    const filter = {
      where: { id_pelabuhan: Number(id_pelabuhan) },
    };

    const response = await axios.get(
      `http://202.157.176.100:3001/barangs?filter=${encodeURIComponent(
        JSON.stringify(filter)
      )}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching barangs:", error);
    res.status(500).json({ message: "Failed to fetch barangs" });
  }
}
