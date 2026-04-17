import { useState } from 'react'
import './MathSection.css'

const techniques = [
  {
    id: 'svd',
    num: '01',
    title: 'Singular Value Decomposition',
    formula: 'X = U Σ Vᵀ',
    color: 'blue',
    content: {
      intro: 'For any real matrix X ∈ ℝ^(m×n), SVD guarantees a unique factorization into three orthogonal/diagonal matrices.',
      blocks: [
        {
          label: 'The Decomposition',
          equation: 'X(m×n) = U(m×k) · Σ(k×k) · Vᵀ(k×n)',
          note: 'U = left singular vectors (gene space), Σ = diagonal singular values σ₁≥σ₂≥...≥0, Vᵀ = right singular vectors (patient space)',
        },
        {
          label: 'Outer Product Expansion',
          equation: 'X = σ₁u₁v₁ᵀ + σ₂u₂v₂ᵀ + ... + σᵣuᵣvᵣᵀ',
          note: 'Each term is one "mode of variation". σ₁u₁v₁ᵀ captures the biggest biological pattern (cancer signal).',
        },
        {
          label: 'Eckart-Young Theorem (Low-Rank Approximation)',
          equation: 'X̂_k = U_k Σ_k V_kᵀ     minimizes ‖X − B‖_F over all rank-k B',
          note: 'X̂_k is the BEST rank-k approximation. Error = σ²_(k+1) + ... + σ²_r. We capture R² > 0.70 with just k = 20-50 components.',
        },
        {
          label: 'Explained Variance Ratio',
          equation: 'EVR_i = σᵢ² / Σⱼ σⱼ²     CVR_k = Σᵢ₌₁ᵏ σᵢ² / Σⱼ σⱼ²',
          note: 'Plotted in the Scree Plot. The "elbow" gives the optimal k — where adding more components yields diminishing returns.',
        },
      ],
    },
  },
  {
    id: 'pca',
    num: '02',
    title: 'Principal Component Analysis',
    formula: 'C = QΛQᵀ',
    color: 'purple',
    content: {
      intro: 'PCA finds the directions of maximum variance, rotating the coordinate system to align with the principal axes of the data.',
      blocks: [
        {
          label: 'Step 1 — Center the Data',
          equation: 'X̃ = Xᵀ − 1ₙ · μᵀ     (subtract each gene\'s mean across samples)',
          note: 'Without centering, the first PC would just point at the mean. Centering forces PCs to capture actual variance patterns.',
        },
        {
          label: 'Step 2 — Covariance Matrix',
          equation: 'C = X̃ᵀX̃ / (n−1) ∈ ℝ^(m×m)',
          note: 'C is symmetric and positive semi-definite → all eigenvalues ≥ 0. This is guaranteed by the Spectral Theorem.',
        },
        {
          label: 'Step 3 — Eigendecomposition (Spectral Theorem)',
          equation: 'C · qᵢ = λᵢ · qᵢ     →     C = QΛQᵀ     (λ₁ ≥ λ₂ ≥ ... ≥ 0)',
          note: 'Each eigenvector qᵢ is a Principal Component — a direction in gene space. Eigenvalue λᵢ = variance along that direction.',
        },
        {
          label: 'SVD–PCA Connection',
          equation: 'X̃ = UΣVᵀ  →  C = VΣ²Vᵀ/(n−1)  →  V = Q (eigenvectors!)',
          note: 'PCA on X̃ is mathematically equivalent to SVD of X̃. sklearn internally runs truncated SVD for efficiency.',
        },
        {
          label: 'Scores & Loadings',
          equation: 'Scores = X̃ · Q_k ∈ ℝ^(n×k)     Loadings = Q_k ∈ ℝ^(m×k)',
          note: 'Large |Q[i,1]| → gene i strongly drives PC1 → disease-associated gene. Scores are plotted to visualize sample separation.',
        },
      ],
    },
  },
  {
    id: 'nmf',
    num: '03',
    title: 'Non-Negative Matrix Factorization',
    formula: 'X ≈ W · H,  W,H ≥ 0',
    color: 'green',
    content: {
      intro: 'PCA allows negative loadings (biologically meaningless). NMF enforces non-negativity, giving "parts-based" biologically interpretable gene modules.',
      blocks: [
        {
          label: 'The Factorization',
          equation: 'X ≈ W · H     W ∈ ℝ^(m×k),  H ∈ ℝ^(k×n),  all entries ≥ 0',
          note: 'W = metagene signatures (which genes define each module), H = sample usage (how strongly each patient uses each module).',
        },
        {
          label: 'Optimization Objective',
          equation: 'min ‖X − WH‖²_F = Σᵢⱼ(Xᵢⱼ − (WH)ᵢⱼ)²     subject to W,H ≥ 0',
          note: 'Non-convex optimization — no guaranteed global minimum. Multiple random starts used, best solution selected.',
        },
        {
          label: 'Multiplicative Update Rules (Lee & Seung 1999)',
          equation: 'H ← H ⊙ (WᵀX) ⊘ (WᵀWH)     W ← W ⊙ (XHᵀ) ⊘ (WHHᵀ)',
          note: '⊙ = element-wise multiply, ⊘ = element-wise divide. Each update preserves non-negativity. Guaranteed to never increase the objective.',
        },
        {
          label: 'Biological Interpretation',
          equation: 'X[:,j] ≈ Σᵢ H[i,j] · W[:,i]     (patient j = weighted sum of metagenes)',
          note: 'Each metagene represents a co-expression program (e.g., immune response, cell proliferation). H tells us which cancer types activate which programs.',
        },
      ],
    },
  },
  {
    id: 'eigen',
    num: '04',
    title: 'Eigendecomposition & Marchenko-Pastur Law',
    formula: 'λ_max = σ²(1 + √γ)²',
    color: 'orange',
    content: {
      intro: 'Eigendecomposition of the gene-gene correlation matrix reveals coordinated expression programs. Random Matrix Theory tells us which eigenvalues are real signals vs. noise.',
      blocks: [
        {
          label: 'Gene-Gene Correlation Matrix',
          equation: 'C_gene = X̃ · X̃ᵀ / (n−1) ∈ ℝ^(m×m)',
          note: 'C[i,j] = Pearson correlation between gene i and gene j across all patients. Symmetric & positive semi-definite.',
        },
        {
          label: 'Spectral Decomposition',
          equation: 'C_gene = Q · Λ · Qᵀ     (Spectral Theorem for symmetric matrices)',
          note: 'Each eigenvector is an "eigengene" — a coordinated gene expression program. Corresponding eigenvalue = its strength.',
        },
        {
          label: 'Marchenko-Pastur Upper Bound (Random Matrix Theory)',
          equation: 'λ_max = σ² · (1 + √γ)²     where γ = m/n  (aspect ratio)',
          note: 'If data were pure noise, eigenvalues would follow the M-P distribution. Any eigenvalue ABOVE λ_max cannot be explained by chance — it is REAL biology.',
        },
        {
          label: 'Concrete Example',
          equation: 'γ = 15,000/300 = 50  →  λ_max = (1 + √50)² ≈ 65.1',
          note: 'Only eigenvalues > 65 are biological signal. In practice, gene expression data has 5–50 signal eigenvalues out of thousands — confirming disease lives in a tiny subspace.',
        },
        {
          label: 'Gene Correlation Network',
          equation: 'Edge (i,j) exists iff |C[i,j]| ≥ 0.7     Hub genes = high degree',
          note: 'Hub genes = connected to many other genes = biological master regulators. These become the primary biomarker candidates.',
        },
      ],
    },
  },
]

function TechBlock({ block }) {
  return (
    <div className="math-block">
      <div className="mb-label">{block.label}</div>
      <div className="mb-equation">
        <code>{block.equation}</code>
      </div>
      <p className="mb-note">{block.note}</p>
    </div>
  )
}

export default function MathSection() {
  const [open, setOpen] = useState('svd')

  const toggle = (id) => setOpen(o => o === id ? null : id)

  return (
    <section id="math" className="section dark-section math-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">CORE MATHEMATICS</span>
          <h2>Four LA Techniques, Fully Derived</h2>
          <p>Every formula used in this project — with proof context and biological meaning.</p>
        </div>

        <div className="math-accordion">
          {techniques.map(t => (
            <div key={t.id} className={`math-item math-${t.color} ${open === t.id ? 'is-open' : ''}`}>
              <button className="math-header" onClick={() => toggle(t.id)}>
                <div className="mh-left">
                  <span className="mh-num">{t.num}</span>
                  <div className="mh-info">
                    <span className="mh-title">{t.title}</span>
                    <code className="mh-formula">{t.formula}</code>
                  </div>
                </div>
                <span className="mh-chevron">{open === t.id ? '−' : '+'}</span>
              </button>

              <div className="math-body">
                <p className="math-intro">{t.content.intro}</p>
                <div className="math-blocks">
                  {t.content.blocks.map(b => (
                    <TechBlock key={b.label} block={b} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference Table */}
        <div className="formula-ref">
          <div className="ref-title">📋 Formula Quick Reference</div>
          <div className="ref-table">
            {[
              ['SVD factorization', 'X = UΣVᵀ'],
              ['Low-rank approx', 'X̂_k = U_k Σ_k Vᵀ_k'],
              ['Explained variance', 'EVR_i = σᵢ² / Σⱼ σⱼ²'],
              ['Covariance matrix', 'C = X̃X̃ᵀ / (n−1)'],
              ['PCA scores', 'Scores = X̃ · Q_k'],
              ['NMF objective', 'min ‖X − WH‖²_F, W,H ≥ 0'],
              ['Marchenko-Pastur', 'λ_max = σ²(1 + √(m/n))²'],
              ['Condition number', 'κ = σ_max / σ_min'],
              ['Pearson r', 'r = Σ(xᵢ−x̄)(yᵢ−ȳ) / (n·σₓ·σᵧ)'],
              ['log₂ Fold Change', 'log₂FC = log₂(μ_A / μ_B)'],
              ['FDR (B-H)', 'p₍ₖ₎ ≤ (k/m)·α'],
              ['Permutation p', 'p = #{AUC_null ≥ AUC_obs} / B'],
            ].map(([concept, formula]) => (
              <div key={concept} className="ref-row">
                <span className="ref-concept">{concept}</span>
                <code className="ref-formula">{formula}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
