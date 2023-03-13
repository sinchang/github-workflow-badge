import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest'
const octokit = new Octokit({
  auth: process.env.GH_AUTH_TOKEN,
})

type Response  = { workflows: RestEndpointMethodTypes["actions"]["listRepoWorkflows"]["response"]['data']['workflows']} | { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'GET') return res.status(401)

  const query = req.query as { repo: string[] }
  const repo = query.repo

  if (!repo)
    return res.status(400).json({ message: 'Please provide the GitHub Repo' })

  const [owner, repoName] = repo

  const result = await octokit.rest.actions.listRepoWorkflows({
    owner,
    repo: repoName,
  });


  res.setHeader('Cache-Control', 's-maxage=3600')
  res.status(200).json({
    workflows: result.data.workflows
  })
}
