import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";

const secretKey = "hidupblonde";

export default const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;
    
    const data = [
      {
        username: "mannr",
        password: "123"
      },
      {
        username: "dep",
        password: "123"
      }
    ];
    
    const Username = data.find(p => p.username === username);
    const Password = data.find(p => p.password === password);
    
    if (username && password) {
        const token = sign({ username }, secretKey, { expiresIn: "1h" });
        return res.json({ token });
    }
    
    return res.status(401).json({ error: "Unauthorized" });
                               }
