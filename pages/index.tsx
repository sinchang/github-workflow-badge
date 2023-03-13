import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import CodeCopy from 'react-codecopy'
import { type RestEndpointMethodTypes } from '@octokit/rest'
import styles from '../styles/Home.module.css'


type Workflows = RestEndpointMethodTypes["actions"]["listRepoWorkflows"]["response"]['data']['workflows']
type Response = { workflows: Workflows }

const Home: NextPage = () => {
  const [repo, setRepo] = useState('fastify/help')
  const [workflows, setWorkflows] = useState<Workflows>([])

  const fetchRepoInfo = async (
    repoName: string
  ): Promise<Response> => {
    return fetch(`/api/workflows/${repoName}`)
      .then((res) => res.json())
      .then((res) => res)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepo(e.currentTarget.value)
    setWorkflows([])
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
            onChange={handleInputChange}
          ></input>
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
              const md = `![${workflow.name}](${workflow.badge_url})`
              return <div className={styles.badge}>
                <img
                  alt='badge'
                  src={workflow.badge_url}
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
