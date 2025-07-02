import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";

export default const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;
    
    return res.json({ message: "User created successfully" });
}
