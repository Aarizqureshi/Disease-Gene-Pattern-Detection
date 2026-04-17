import { useState } from 'react'
import './HowToRun.css'

function CodeBlock({ code, id }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-block">
      <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  )
}

const steps = [
  {
    num: '1',
    title: 'Clone the Repository',
    icon: '📦',
    color: 'blue',
    content: (
      <>
        <CodeBlock code={`git clone https://github.com/anaghabpoojari/LAA.git\ncd LAA`} />
        <p className="step-note">This clones the full project with all notebooks and source modules.</p>
      </>
    ),
  },
  {
    num: '2',
    title: 'Create a Virtual Environment',
    icon: '🔒',
    color: 'teal',
    content: <OSTabs />,
  },
  {
    num: '3',
    title: 'Install Dependencies',
    icon: '📥',
    color: 'purple',
    content: (
      <>
        <CodeBlock code={`pip install -r requirements.txt`} />
        <div className="dep-chips">
          {['numpy', 'pandas', 'scipy', 'scikit-learn', 'matplotlib', 'seaborn', 'plotly', 'networkx', 'statsmodels', 'GEOparse', 'biopython', 'umap-learn', 'lifelines', 'pydeseq2'].map(d => (
            <span key={d} className="dep-chip">{d}</span>
          ))}
        </div>
        <p className="step-note">⚠️ pydeseq2 may need: <code>pip install pydeseq2 --no-build-isolation</code> on some systems.</p>
      </>
    ),
  },
  {
    num: '4',
    title: 'Download the Dataset',
    icon: '🗃️',
    color: 'green',
    content: (
      <>
        <p className="step-note">Place <code>GSE68086_TEP_data_matrix.csv</code> into <code>data/raw/</code></p>
        <div className="step-options">
          <div className="opt-block">
            <div className="opt-label">Option A — Manual Download</div>
            <p>Visit <a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE68086" target="_blank" rel="noreferrer" className="inline-link">NCBI GEO GSE68086 ↗</a> and download the series matrix file.</p>
          </div>
          <div className="opt-block">
            <div className="opt-label">Option B — Auto Download (GEOparse)</div>
            <CodeBlock code={`python -c "import GEOparse; GEOparse.get_GEO('GSE68086', destdir='data/raw/')"`} />
          </div>
        </div>
      </>
    ),
  },
  {
    num: '5',
    title: 'Launch Jupyter & Run Notebooks',
    icon: '🚀',
    color: 'orange',
    content: (
      <>
        <CodeBlock code={`jupyter notebook\n# Or JupyterLab:\njupyter lab`} />
        <div className="run-order">
          <div className="ro-label">Run notebooks in this exact order:</div>
          <div className="ro-steps">
            {['01_data_exploration', '02_preprocessing', '03_svd_pca_analysis', '04_nmf_metagenes', '05_correlation_networks', '06_disease_classification', '07_biomarker_discovery'].map((nb, i, arr) => (
              <span key={nb} className="ro-nb">
                {nb}<code>.ipynb</code>
                {i < arr.length - 1 && <span className="ro-arrow">→</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="success-banner">
          ✅ Results will be saved to <code>data/results/</code> after each notebook.<br />
          For each notebook: <strong>Kernel → Restart &amp; Run All</strong>
        </div>
      </>
    ),
  },
]

function OSTabs() {
  const [os, setOs] = useState('win')
  return (
    <div>
      <div className="os-tabs">
        <button className={os === 'win' ? 'active' : ''} onClick={() => setOs('win')}>🪟 Windows</button>
        <button className={os === 'mac' ? 'active' : ''} onClick={() => setOs('mac')}>🍎 macOS / Linux</button>
      </div>
      {os === 'win' && <CodeBlock code={`python -m venv venv\nvenv\\Scripts\\activate`} />}
      {os === 'mac' && <CodeBlock code={`python3 -m venv venv\nsource venv/bin/activate`} />}
    </div>
  )
}

export default function HowToRun() {
  return (
    <section id="howtorun" className="section howtorun-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">SETUP GUIDE</span>
          <h2>How to Run Locally</h2>
          <p>Get the full analysis pipeline running in 5 simple steps. Requires Python 3.9+.</p>
        </div>

        <div className="steps-list">
          {steps.map(s => (
            <div key={s.num} className={`step-item step-${s.color}`}>
              <div className="step-left">
                <div className="step-num">{s.icon}</div>
                <div className="step-line" />
              </div>
              <div className="step-body">
                <h3><span className="sn-badge">Step {s.num}</span>{s.title}</h3>
                <div className="step-content">{s.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Run Frontend section */}
        <div className="frontend-run-box">
          <div className="frb-header">
            <span>⚛️</span>
            <h3>Running This Frontend Locally</h3>
          </div>
          <CodeBlock code={`cd frontend\nnpm install\nnpm run dev\n# Opens at http://localhost:5173`} />
          <p className="step-note">Built with Vite + React. No backend required — pure static frontend.</p>
        </div>
      </div>
    </section>
  )
}
