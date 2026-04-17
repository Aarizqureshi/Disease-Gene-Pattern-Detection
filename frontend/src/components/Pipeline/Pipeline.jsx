import './Pipeline.css'

const notebooks = [
  {
    num: '01',
    title: 'Data Exploration',
    file: '01_data_exploration.ipynb',
    desc: 'Load the GSE68086 dataset, inspect matrix shape and data types, visualize raw expression distributions per sample. Understand data quality before any math.',
    tags: ['GEOparse', 'matplotlib', 'pandas'],
    color: 'nb-blue',
    output: 'Data quality report, distribution plots',
  },
  {
    num: '02',
    title: 'Preprocessing',
    file: '02_preprocessing.ipynb',
    desc: 'Apply the full cleaning pipeline: log₂(x+1) transform → filter low-expression genes → filter low-variance genes → Z-score normalize across samples. Detect and remove outlier samples.',
    tags: ['log₂ transform', 'Z-score', 'QC report'],
    color: 'nb-teal',
    output: 'Clean expression matrix → data/processed/',
  },
  {
    num: '03',
    title: 'SVD / PCA Analysis',
    file: '03_svd_pca_analysis.ipynb',
    desc: 'Truncated SVD scree plot to find optimal k. PCA scatter colored by disease group. Biplot with gene loading arrows. 3D PCA visualization. Select components explaining ≥90% variance.',
    tags: ['SVD', 'PCA', 'Biplot', 'Scree Plot'],
    color: 'nb-purple',
    output: 'PC scores, gene loadings, optimal k',
  },
  {
    num: '04',
    title: 'NMF Metagenes',
    file: '04_nmf_metagenes.ipynb',
    desc: 'Factorize X ≈ WH using multiplicative updates. Each column of W = co-expression gene module. H-matrix heatmap shows which patients activate which metagene programs.',
    tags: ['NMF', 'Metagenes', 'W matrix', 'H matrix'],
    color: 'nb-green',
    output: 'Gene modules (W), sample usage (H)',
  },
  {
    num: '05',
    title: 'Correlation Networks',
    file: '05_correlation_networks.ipynb',
    desc: 'Build gene-gene Pearson correlation matrix. Eigendecompose to find eigengenes. Apply Marchenko-Pastur threshold to filter noise eigenvalues. Draw gene network graph with NetworkX.',
    tags: ['Pearson r', 'Eigenvalues', 'M-P Law', 'NetworkX'],
    color: 'nb-orange',
    output: 'Significant eigengenes, correlation network',
  },
  {
    num: '06',
    title: 'Disease Classification',
    file: '06_disease_classification.ipynb',
    desc: 'PCA/NMF features → Logistic Regression / SVM classifier → 5-fold stratified cross-validation → ROC curves with AUC. Permutation test (1000 runs) confirms AUC > 0.80 is non-random.',
    tags: ['AUC', 'ROC', 'Cross-Val', 'Permutation Test'],
    color: 'nb-red',
    output: 'AUC > 0.80, permutation p < 0.01',
  },
  {
    num: '07',
    title: 'Biomarker Discovery',
    file: '07_biomarker_discovery.ipynb',
    desc: 'Welch t-test + Benjamini-Hochberg FDR correction per gene. Volcano plot (log₂FC vs −log₁₀p). Gene set enrichment via Fisher\'s exact test. Bootstrap PCA stability (100 runs). Final ranked biomarker gene list.',
    tags: ['t-test', 'FDR', 'Volcano', 'Bootstrap'],
    color: 'nb-pink',
    output: 'Ranked biomarker gene list',
  },
]

export default function Pipeline() {
  return (
    <section id="pipeline" className="section pipeline-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">7 JUPYTER NOTEBOOKS</span>
          <h2>The Analysis Pipeline</h2>
          <p>Run notebooks in order 01 → 07. Each step builds on the previous output.</p>
        </div>

        <div className="flow-arrow">
          <span>01</span>
          <span className="fa-arr">→</span>
          <span>02</span>
          <span className="fa-arr">→</span>
          <span>03</span>
          <span className="fa-arr">→</span>
          <span>04</span>
          <span className="fa-arr">→</span>
          <span>05</span>
          <span className="fa-arr">→</span>
          <span>06</span>
          <span className="fa-arr">→</span>
          <span>07</span>
        </div>

        <div className="nb-timeline">
          {notebooks.map((nb, i) => (
            <div key={nb.num} className={`nb-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="nb-connector">
                <div className={`nb-dot ${nb.color}`}>{nb.num}</div>
                {i < notebooks.length - 1 && <div className="nb-line" />}
              </div>
              <div className={`nb-card ${nb.color}`}>
                <div className="nbc-header">
                  <h3>{nb.title}</h3>
                  <code className="nbc-file">{nb.file}</code>
                </div>
                <p className="nbc-desc">{nb.desc}</p>
                <div className="nbc-tags">
                  {nb.tags.map(t => (
                    <span key={t} className="nbc-tag">{t}</span>
                  ))}
                </div>
                <div className="nbc-output">
                  <span className="output-icon">📤</span>
                  <span>{nb.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
