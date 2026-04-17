import './Validation.css'

const metrics = [
  {
    id: 'r2',
    threshold: 'R² > 0.70',
    name: 'Reconstruction R²',
    pct: 70,
    color: '#00e5a0',
    how: '‖X − X̂_k‖_F / ‖X‖_F',
    desc: 'Top-k SVD components must reconstruct ≥70% of the original matrix variance. Confirms low-rank approximation is valid.',
    notebook: 'Notebook 03',
  },
  {
    id: 'stab',
    threshold: 'Cosine > 0.85',
    name: 'Component Stability',
    pct: 85,
    color: '#7c6fff',
    how: 'Bootstrap PCA (100 runs)',
    desc: 'Re-run PCA on 100 bootstrap samples. Average cosine similarity of PC loading vectors across runs must exceed 0.85.',
    notebook: 'Notebook 03 + 07',
  },
  {
    id: 'auc',
    threshold: 'AUC > 0.80',
    name: 'Classification AUC',
    pct: 80,
    color: '#00d4ff',
    how: 'Stratified 5-fold cross-validation',
    desc: 'Classifier trained on PCA/NMF features must achieve AUC > 0.80 on held-out folds — confirming LA features genuinely separate disease classes.',
    notebook: 'Notebook 06',
  },
  {
    id: 'perm',
    threshold: 'p < 0.01',
    name: 'Permutation p-value',
    pct: 99,
    color: '#ff8c42',
    how: '1000 label-shuffle permutations',
    desc: 'Shuffle disease labels 1000 times, recompute AUC each time. Observed AUC must exceed 99% of shuffled AUCs — proving results are not random.',
    notebook: 'Notebook 06',
  },
  {
    id: 'fdr',
    threshold: 'FDR < 0.05',
    name: 'FDR Threshold',
    pct: 95,
    color: '#ff4dba',
    how: 'Benjamini-Hochberg correction',
    desc: 'With 15,000 genes tested simultaneously, FDR correction prevents false positives. B-H controls the expected fraction of rejections that are false discoveries.',
    notebook: 'Notebook 07',
  },
]

export default function Validation() {
  return (
    <section id="validation" className="section dark-section validation-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">SUCCESS CRITERIA</span>
          <h2>Validation Metrics</h2>
          <p>Every finding is statistically verified. These thresholds ensure results are reproducible and not by chance.</p>
        </div>

        <div className="metrics-grid">
          {metrics.map(m => (
            <div key={m.id} className="metric-card">
              <div className="mc-top">
                <div className="mc-threshold" style={{ color: m.color }}>{m.threshold}</div>
                <span className="mc-nb">{m.notebook}</span>
              </div>
              <h4 className="mc-name">{m.name}</h4>
              <div className="mc-bar-wrap">
                <div className="mc-bar-bg">
                  <div
                    className="mc-bar-fill"
                    style={{ width: `${m.pct}%`, background: m.color }}
                  />
                </div>
                <span className="mc-pct">{m.pct}%</span>
              </div>
              <code className="mc-how">{m.how}</code>
              <p className="mc-desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <div className="val-summary">
          <div className="vs-title">At a Glance</div>
          <div className="vs-items">
            <div className="vs-item">
              <span className="vs-num" style={{ color: '#00e5a0' }}>70%+</span>
              <span>Variance explained by low-rank SVD</span>
            </div>
            <div className="vs-sep" />
            <div className="vs-item">
              <span className="vs-num" style={{ color: '#7c6fff' }}>0.85+</span>
              <span>Bootstrap loading stability</span>
            </div>
            <div className="vs-sep" />
            <div className="vs-item">
              <span className="vs-num" style={{ color: '#00d4ff' }}>0.80+</span>
              <span>Classification AUC (5-fold CV)</span>
            </div>
            <div className="vs-sep" />
            <div className="vs-item">
              <span className="vs-num" style={{ color: '#ff8c42' }}>&lt;0.01</span>
              <span>Permutation test p-value</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
