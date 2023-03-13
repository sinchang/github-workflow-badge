import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import CodeCopy from 'react-codecopy'
import { type RestEndpointMethodTypes } from '@octokit/rest'
import styles from '../styles/Home.module.css'


type Workflows = RestEndpointMethodTypes["actions"]["listRepoWorkflows"]["response"]['data']['workflows']
type Response = { workflows: Workflows }

const Home: NextPage = () => {
  const [repo, setRepo] = useState('actions/setup-node')
  const [branch, setBranch] = useState('')
  const [workflows, setWorkflows] = useState<Workflows>([])

  const fetchRepoInfo = async (
    repoName: string
  ): Promise<Response> => {
    return fetch(`/api/workflows/${repoName}`)
      .then((res) => res.json())
      .then((res) => res)
  }

  const handleRepoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepo(e.currentTarget.value?.trim())
    setWorkflows([])
  }

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranch(e.currentTarget.value?.trim())
  }

  const handlePreview = async () => {
    const data = await fetchRepoInfo(repo)

    if (data.workflows) setWorkflows(data.workflows)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Workflow Badge</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>GitHub Workflow Badge</h1>

        <div className={styles.form}>
          <input
            className='zi-input big search-input'
            placeholder='Repo...'
            value={repo}
            onChange={handleRepoChange}
          />
           <input
            className='zi-input big search-input'
            placeholder='Specific branch...'
            value={branch}
            onChange={handleBranchChange}
          />
          <button
            className='zi-btn preview-btn'
            type='button'
            onClick={handlePreview}
          >
            Preview
          </button>
        </div>
        <div>
          {
            workflows.map(workflow => {
              const badgeUrl = `${workflow.badge_url}${branch ? `?branch=${branch}` : ''}`
              const fullPath = `https://github.com/${repo}/${workflow.path.replace('.github', 'actions')}`
              const md = `[![${workflow.name}](${badgeUrl})](${fullPath})`
              return <div className={styles.badge} key={workflow.id}>
                <img
                  alt='badge'
                  src={badgeUrl}
                />
                <CodeCopy text={md}>
                  <div className={styles.code}>
                    {md}
                  </div>
                </CodeCopy>
              </div>
            })
          }
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href='https://github.com/sinchang/github-workflow-badge'
          target='_blank'
          rel='noopener noreferrer'
        >
          Made with ❤️ for the Open Source Community by Jeff Wen
        </a>
      </footer>
    </div>
  )
}

export default Home
