import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="fb-logo">
              <span>🧬</span>
              <span>Gene<span className="accent">LA</span></span>
            </div>
            <p>Linear Algebra meets computational biology. A Semester 4 project demonstrating real-world matrix decomposition on gene expression data.</p>
            <div className="fb-badges">
              <a href="https://github.com/anaghabpoojari/LAA" target="_blank" rel="noreferrer" className="fb-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE68086" target="_blank" rel="noreferrer" className="fb-badge">
                🧬 Dataset (NCBI GEO)
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <div className="flc-title">Sections</div>
            {['#overview', '#math', '#pipeline', '#modules', '#howtorun', '#validation'].map(h => (
              <a key={h} href={h}>{h.slice(1).charAt(0).toUpperCase() + h.slice(2)}</a>
            ))}
          </div>

          <div className="footer-links-col">
            <div className="flc-title">Core Techniques</div>
            <span>SVD — X = UΣVᵀ</span>
            <span>PCA — C = QΛQᵀ</span>
            <span>NMF — X ≈ WH</span>
            <span>Eigendecomposition</span>
            <span>Marchenko-Pastur Law</span>
            <span>Permutation Tests</span>
          </div>

          <div className="footer-links-col">
            <div className="flc-title">Python Libraries</div>
            <span>NumPy / SciPy</span>
            <span>scikit-learn</span>
            <span>pandas</span>
            <span>matplotlib / seaborn</span>
            <span>networkx</span>
            <span>statsmodels</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Built with ⚛️ React + Vite · Styled with vanilla CSS</span>
          <span>Semester 4 · Linear Algebra Applied Project · 2026</span>
        </div>
      </div>
    </footer>
  )
}
