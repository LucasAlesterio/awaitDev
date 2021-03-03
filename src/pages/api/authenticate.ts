// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import initMiddleware from '../../lib/init-middleware';
import Cors from 'cors';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async (req: NextApiRequest , res: NextApiResponse) => {
  await cors(req, res);
  const {
    body: { 
      client_id,
      client_secret,
      code },
    method,
  } = req;
  switch (method) {
    case 'POST':
      try{
        const {data} = await axios.post('https://github.com/login/oauth/access_token',
              {
                  client_id,
                  client_secret,
                  code
              })
        const pair = data.split('=');
        const [token] = pair[1].split('&');
        return res.status(200).json(token);
      }catch(err){
        return res.status(500).json(err);
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
