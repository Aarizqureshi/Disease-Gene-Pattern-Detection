<div align="center">

# 🧬 Gene Expression LA Analysis

### Linear Algebra Based Discovery of Disease-Linked Gene Expression Patterns

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![NumPy](https://img.shields.io/badge/NumPy-SVD%2FPCA%2FNMF-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org)
[![Jupyter](https://img.shields.io/badge/Jupyter-7%20Notebooks-F37626?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[🌐 Live Demo](https://anaghabpoojari.github.io/LAA)** · **[📓 Notebooks](notebooks/)** · **[📦 Source Code](src/)**

</div>

---

## 📖 Overview

This project applies **core linear algebra techniques** to a real-world bioinformatics problem:

> *Can we identify cancer-linked genes purely from the mathematics of a gene expression matrix?*

Gene expression data is represented as a matrix **X ∈ ℝ^(m×n)** where rows are genes and columns are patient samples. Using **SVD**, **PCA**, **NMF**, and **eigenvalue analysis**, we decompose this matrix to discover latent disease-related subspaces — proving that diseases leave distinct linear algebraic "fingerprints" in gene activity.

### Dataset
**[GSE68086](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE68086)** — Tumor-Educated Platelets (TEP) RNA-seq data from NCBI GEO. Platelets from cancer patients carry tumor-derived RNA signals that can be used to detect and classify cancer non-invasively from a blood test.

---

## 🔢 Mathematical Foundation

The expression matrix **X ∈ ℝ^(m×n)** (m genes × n samples) is the central object. All analyses are matrix operations on X.

| Technique | Formula | Purpose |
|-----------|---------|---------|
| **SVD** | X = UΣVᵀ | Decompose into gene/sample subspaces |
| **PCA** | C = QΛQᵀ where C = X̃X̃ᵀ/(n-1) | Find principal axes of disease variation |
| **NMF** | X ≈ W·H, W,H ≥ 0 | Extract biologically interpretable gene modules |
| **Eigendecomposition** | C_gene = QΛQᵀ | Find coordinated gene programs |
| **Marchenko-Pastur** | λ_max = σ²(1+√(m/n))² | Separate signal from noise eigenvalues |

**Key insight**: The Eckart-Young theorem guarantees that the top-k SVD components yield the **best possible rank-k approximation** of X. Keeping only k=10–50 components (out of 15,000) captures 70–90% of all biological variance — confirming disease states occupy a tiny, discoverable subspace.

---

## 🗂️ Project Structure

```
LAA/
│
├── 📓 notebooks/                         # Analysis pipeline (run in order)
│   ├── 01_data_exploration.ipynb         # Load, inspect, visualize raw data
│   ├── 02_preprocessing.ipynb            # log₂ transform, filter, normalize
│   ├── 03_svd_pca_analysis.ipynb         # SVD scree plot, PCA scatter/biplot
│   ├── 04_nmf_metagenes.ipynb            # NMF metagene extraction
│   ├── 05_correlation_networks.ipynb     # Gene-gene Pearson correlation + eigenvalues
│   ├── 06_disease_classification.ipynb   # Classifier on PCA/NMF features, AUC/ROC
│   └── 07_biomarker_discovery.ipynb      # DE testing, volcano plot, biomarker list
│
├── 🐍 src/                               # Reusable Python library modules
│   ├── linear_algebra.py                 # SVD, PCA, NMF, ICA, eigenanalysis (316 lines)
│   ├── preprocessing.py                  # QC, filtering, normalization (242 lines)
│   ├── validation.py                     # Statistics: t-test, AUC, bootstrap, permutation (274 lines)
│   └── visualization.py                  # 13 plot types: scree, volcano, biplot, UMAP, etc. (408 lines)
│
├── 🗃️ data/
│   ├── raw/                              # GSE68086_TEP_data_matrix.csv (~34 MB)
│   ├── processed/                        # Cleaned expression matrices
│   └── results/                          # Output figures and tables
│
├── 🌐 docs/                              # Frontend (GitHub Pages)
│   └── index.html                        # Interactive project dashboard
│
├── requirements.txt                      # Python dependencies
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- Python 3.9 or higher
- pip
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/anaghabpoojari/LAA.git
cd LAA
```

### 2. Create a Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ **Note**: `pydeseq2` requires Python 3.9+ and may need `pip install pydeseq2 --no-build-isolation` on some systems.

### 4. Download the Dataset

Place the dataset file in `data/raw/`:

```
data/raw/GSE68086_TEP_data_matrix.csv
```

**Option A** — Manual download:  
Visit [GEO GSE68086](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE68086) and download the series matrix file.

**Option B** — Automatic via GEOparse (run this in Python):
```python
import GEOparse
gse = GEOparse.get_GEO("GSE68086", destdir="data/raw/")
```

### 5. Run the Notebooks

Launch Jupyter and execute notebooks **in order** (01 → 07):

```bash
jupyter notebook
```

Or use JupyterLab:

```bash
pip install jupyterlab
jupyter lab
```

Open `notebooks/01_data_exploration.ipynb` and run all cells (`Kernel → Restart & Run All`).

---

## 📓 Notebook Pipeline

```
01 Data Exploration
        ↓
02 Preprocessing (log₂ → filter → normalize)
        ↓
03 SVD / PCA Analysis (scree plot → optimal k → 2D/3D scatter)
        ↓
04 NMF Metagenes (gene modules → sample usage heatmap)
        ↓
05 Correlation Networks (Pearson matrix → Marchenko-Pastur → gene graph)
        ↓
06 Disease Classification (PCA features → classifier → AUC > 0.80)
        ↓
07 Biomarker Discovery (t-test + FDR → volcano → ranked gene list)
```

Each notebook is self-contained but depends on the processed data from the previous step. Results are saved to `data/results/`.

---

## 🧩 Source Module Reference

### `src/linear_algebra.py` — Core LA Engine

```python
from src.linear_algebra import run_svd, run_pca, run_nmf, eigenvalue_decomposition

# Singular Value Decomposition
svd_result = run_svd(expr_df, n_components=50)
# Returns: U (gene space), S (singular values), Vt (sample space), EVR

# PCA
pca_result = run_pca(expr_df, n_components=30, center=True)
# Returns: scores (samples × k), loadings (genes × k), EVR

# NMF — Non-negative Matrix Factorization
nmf_result = run_nmf(expr_df, n_components=10)
# Returns: W (genes × k metagenes), H (k × samples usage)

# Eigenvalue decomposition of correlation matrix
corr = gene_correlation_matrix(expr_df, method='pearson')
eig  = eigenvalue_decomposition(corr)
threshold = marchenko_pastur_threshold(n_genes=15000, n_samples=300)
sig_idx = significant_eigengenes(eig, threshold)
```

### `src/preprocessing.py` — Data Cleaning

```python
from src.preprocessing import full_preprocessing_pipeline, qc_report

# Check data quality first
qc = qc_report(raw_expr)

# One-shot cleaning pipeline
clean_expr = full_preprocessing_pipeline(
    raw_expr,
    log_transform=True,      # log₂(x + 1)
    remove_low_expr=True,    # min mean ≥ 1.0, expressed in ≥ 20% samples
    remove_low_var=True,     # discard bottom 10% variance genes
    normalise='zscore'       # 'zscore' | 'quantile' | 'robust'
)
```

### `src/validation.py` — Statistical Tests

```python
from src.validation import (
    t_test_de, cross_validate_classifier,
    permutation_test_auc, bootstrap_pca_stability
)

# Differential expression with FDR
de_results = t_test_de(expr, labels, group_a='Cancer', group_b='Healthy')

# Cross-validated AUC
cv = cross_validate_classifier(clf, X_features, y_labels, n_splits=5)

# Confirm AUC is non-random
perm = permutation_test_auc(clf, X, y, n_permutations=1000)
print(f"AUC={perm['observed_auc']:.3f}, p={perm['p_value']:.4f}")
```

### `src/visualization.py` — Plotting

```python
from src.visualization import (
    plot_scree, plot_pca_scatter, plot_biplot,
    plot_volcano, plot_correlation_network, plot_umap
)

plot_scree(pca_result['explained_variance_ratio'], save_path='data/results/scree.png')
plot_pca_scatter(pca_result['scores'], labels=sample_labels)
plot_volcano(de_results, fc_thresh=1.0, p_thresh=0.05, label_top=20)
plot_correlation_network(corr_matrix, threshold=0.7)
```

---

## ✅ Validation Thresholds

| Metric | Threshold | How It's Tested |
|--------|-----------|-----------------|
| Reconstruction R² | > 0.70 | `‖X - X̂_k‖²_F / ‖X‖²_F` |
| Component Stability | > 0.85 | Bootstrap cosine similarity (100 runs) |
| Classification AUC | > 0.80 | Stratified 5-fold cross-validation |
| Permutation p-value | < 0.01 | 1000 label-shuffle permutations |
| FDR threshold | < 0.05 | Benjamini-Hochberg correction |

---

## 📦 Dependencies

| Package | Version | Role |
|---------|---------|------|
| numpy | ≥1.24 | Core numerical arrays and SVD |
| pandas | ≥2.0 | DataFrame-based expression matrices |
| scipy | ≥1.11 | Eigenvalue decomposition, statistics |
| scikit-learn | ≥1.3 | PCA, NMF, ICA, classifiers, cross-validation |
| matplotlib | ≥3.7 | Base plotting |
| seaborn | ≥0.12 | Heatmaps, statistical visualization |
| plotly | ≥5.15 | Interactive charts |
| networkx | ≥3.1 | Gene correlation network graphs |
| statsmodels | ≥0.14 | FDR / Benjamini-Hochberg correction |
| GEOparse | ≥2.0.3 | Download GEO datasets programmatically |
| biopython | ≥1.81 | Bioinformatics utilities |
| umap-learn | ≥0.5.3 | Non-linear dimensionality reduction |
| lifelines | ≥0.27 | Survival analysis |
| pydeseq2 | ≥0.4 | RNA-seq differential expression |

---

## 🎓 Academic Context

This project was built for **Semester 4 — Linear Algebra** as a demonstration of applied matrix theory in computational biology. Core LA concepts demonstrated:

- **Matrix decomposition** (SVD, eigendecomposition)
- **Vector spaces and subspaces** (disease subspaces)
- **Orthogonality** (PC loadings are orthonormal)
- **Rank and low-rank approximation** (Eckart-Young theorem)
- **Norms** (Frobenius norm for reconstruction error)
- **Positive semi-definite matrices** (covariance matrix)
- **Spectral theorem** (symmetric matrices have real eigenvalues)
- **Random matrix theory** (Marchenko-Pastur distribution)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Made with 🧬 and linear algebra
</div>
