"""
Linear Algebra utilities for gene expression analysis.

This module provides core LA decomposition methods:
- Singular Value Decomposition (SVD)
- Principal Component Analysis (PCA)
- Non-negative Matrix Factorization (NMF)
- Eigenvalue analysis of correlation matrices
"""

import numpy as np
import pandas as pd
from scipy import linalg
from scipy.stats import pointbiserialr
from sklearn.decomposition import PCA, NMF
from sklearn.cluster import KMeans
from typing import Dict, List, Tuple, Optional
from statsmodels.stats import multitest


def svd_decomposition(
    expr_matrix: np.ndarray,
    full_matrices: bool = False
) -> Dict:
    """
    Perform Singular Value Decomposition on expression matrix.

    X = U @ diag(s) @ Vt

    Args:
        expr_matrix: Centered expression matrix (genes × samples)
        full_matrices: Whether to return full or economy SVD

    Returns:
        Dictionary with U, s, Vt, and derived statistics
    """
    # Economy SVD for tall matrices (more genes than samples)
    U, s, Vt = linalg.svd(expr_matrix, full_matrices=full_matrices)

    n_samples = expr_matrix.shape[1]

    # Explained variance from singular values
    explained_variance = (s ** 2) / (n_samples - 1)
    variance_ratio = explained_variance / explained_variance.sum()
    cumulative_variance = np.cumsum(variance_ratio)

    # Optimal k for different variance thresholds
    k_90 = np.searchsorted(cumulative_variance, 0.90) + 1
    k_95 = np.searchsorted(cumulative_variance, 0.95) + 1
    k_99 = np.searchsorted(cumulative_variance, 0.99) + 1

    return {
        'U': U,  # Left singular vectors (genes × components)
        's': s,  # Singular values
        'Vt': Vt,  # Right singular vectors (components × samples)
        'explained_variance': explained_variance,
        'variance_ratio': variance_ratio,
        'cumulative_variance': cumulative_variance,
        'k_90': int(k_90),
        'k_95': int(k_95),
        'k_99': int(k_99),
        'n_components': len(s)
    }


def pca_analysis(
    expr_matrix: np.ndarray,
    n_components: int = 50,
    svd_solver: str = 'full'
) -> Dict:
    """
    Perform Principal Component Analysis on expression matrix.

    Args:
        expr_matrix: Expression matrix (samples × genes) - sklearn convention
        n_components: Number of PCs to compute
        svd_solver: SVD solver to use

    Returns:
        Dictionary with PCA results and statistics
    """
    pca = PCA(n_components=n_components, svd_solver=svd_solver)
    X_pca = pca.fit_transform(expr_matrix)

    return {
        'X_pca': X_pca,  # Transformed data (samples × components)
        'components': pca.components_,  # Principal axes (components × genes)
        'explained_variance': pca.explained_variance_,
        'explained_variance_ratio': pca.explained_variance_ratio_,
        'cumulative_variance_ratio': np.cumsum(pca.explained_variance_ratio_),
        'singular_values': pca.singular_values_,
        'mean': pca.mean_,
        'n_components': pca.n_components_,
        'model': pca
    }


def nmf_decomposition(
    expr_matrix: np.ndarray,
    n_components: int = 10,
    init: str = 'nndsvda',
    max_iter: int = 500,
    random_state: int = 42
) -> Dict:
    """
    Perform Non-negative Matrix Factorization.

    X ≈ W @ H  where W >= 0, H >= 0

    Args:
        expr_matrix: Non-negative expression matrix (samples × genes)
        n_components: Number of metagenes (rank of factorization)
        init: Initialization method ('random', 'nndsvd', 'nndsvda', 'nndsvdar')
        max_iter: Maximum iterations
        random_state: Random seed for reproducibility

    Returns:
        Dictionary with W, H, and model statistics
    """
    nmf = NMF(
        n_components=n_components,
        init=init,
        max_iter=max_iter,
        random_state=random_state,
        tol=1e-4,
        alpha_W=0.0,
        alpha_H=0.0
    )

    W = nmf.fit_transform(expr_matrix)  # Samples × Metagenes
    H = nmf.components_  # Metagenes × Genes

    # Reconstruction error (Frobenius norm)
    reconstruction_error = np.linalg.norm(expr_matrix - W @ H, 'fro')

    # Relative error
    relative_error = reconstruction_error / np.linalg.norm(expr_matrix, 'fro')

    return {
        'W': W,  # Sample coefficients (samples × metagenes)
        'H': H,  # Metagene basis (metagenes × genes)
        'reconstruction_error': reconstruction_error,
        'relative_error': relative_error,
        'n_iter': nmf.n_iter_,
        'model': nmf
    }


def nmf_rank_selection(
    expr_matrix: np.ndarray,
    n_components_range: List[int],
    **nmf_kwargs
) -> Dict:
    """
    Run NMF across multiple rank values for component selection.

    Args:
        expr_matrix: Non-negative expression matrix
        n_components_range: List of k values to try
        **nmf_kwargs: Additional arguments for NMF

    Returns:
        Dictionary with results for each k
    """
    results = []

    for k in n_components_range:
        result = nmf_decomposition(expr_matrix, n_components=k, **nmf_kwargs)
        results.append({
            'k': k,
            **result
        })

    return {
        'results': results,
        'errors': [r['reconstruction_error'] for r in results],
        'relative_errors': [r['relative_error'] for r in results],
        'k_values': n_components_range
    }


def correlation_eigenvalue_analysis(
    expr_matrix: np.ndarray,
    method: str = 'pearson'
) -> Dict:
    """
    Perform eigenvalue decomposition of gene-gene correlation matrix.

    Args:
        expr_matrix: Expression matrix (samples × genes)
        method: Correlation method ('pearson', 'spearman')

    Returns:
        Dictionary with eigenvalue analysis results
    """
    # Compute correlation matrix (genes × genes)
    corr_matrix = np.corrcoef(expr_matrix.T)

    # Handle NaN values in correlation matrix
    corr_matrix = np.nan_to_num(corr_matrix, nan=0.0)

    # Eigenvalue decomposition (symmetric matrix)
    eigenvalues, eigenvectors = np.linalg.eigh(corr_matrix)

    # Sort by eigenvalue magnitude (descending)
    idx = np.argsort(eigenvalues)[::-1]
    eigenvalues = eigenvalues[idx]
    eigenvectors = eigenvectors[:, idx]

    # Marchenko-Pastur threshold for random matrix
    n_genes, n_samples = expr_matrix.shape
    Q = n_genes / n_samples
    lambda_max = (1 + np.sqrt(1/Q)) ** 2
    lambda_min = (1 - np.sqrt(1/Q)) ** 2

    # Significant eigenvalues (outside MP distribution)
    significant_mask = eigenvalues > lambda_max

    # Explained variance
    total_variance = eigenvalues.sum()
    variance_ratio = eigenvalues / total_variance
    cumulative_variance = np.cumsum(variance_ratio)

    return {
        'eigenvalues': eigenvalues,
        'eigenvectors': eigenvectors,
        'corr_matrix': corr_matrix,
        'lambda_max': lambda_max,
        'lambda_min': lambda_min,
        'significant_eigenvalues': eigenvalues[significant_mask],
        'n_significant': significant_mask.sum(),
        'variance_ratio': variance_ratio,
        'cumulative_variance': cumulative_variance,
        'marchenko_pastur_threshold': lambda_max
    }


def identify_hub_genes(
    corr_matrix: np.ndarray,
    gene_names: List[str],
    top_k: int = 100
) -> pd.DataFrame:
    """
    Identify hub genes using eigenvector centrality.

    Args:
        corr_matrix: Gene-gene correlation matrix
        gene_names: List of gene names
        top_k: Number of top hub genes to return

    Returns:
        DataFrame with hub gene rankings
    """
    # Power iteration for dominant eigenvector (eigenvector centrality)
    n_genes = corr_matrix.shape[0]
    v = np.ones(n_genes) / n_genes

    for _ in range(100):  # Power iterations
        v_new = corr_matrix @ v
        v_new = v_new / np.linalg.norm(v_new)
        if np.linalg.norm(v_new - v) < 1e-10:
            break
        v = v_new

    # Gene rankings by centrality
    centrality_df = pd.DataFrame({
        'gene': gene_names,
        'eigenvector_centrality': v
    })
    centrality_df = centrality_df.sort_values('eigenvector_centrality', ascending=False)

    return centrality_df.head(top_k)


def correlate_components_with_disease(
    component_scores: np.ndarray,
    disease_labels: np.ndarray,
    component_names: List[str],
    alpha: float = 0.05
) -> pd.DataFrame:
    """
    Correlate PCA/NMF components with disease labels.

    Args:
        component_scores: Sample scores on components (samples × components)
        disease_labels: Disease labels for each sample
        component_names: Names for each component
        alpha: Significance threshold

    Returns:
        DataFrame with correlation statistics
    """
    # Encode disease labels if categorical
    if not np.issubdtype(disease_labels.dtype, np.number):
        from sklearn.preprocessing import LabelEncoder
        le = LabelEncoder()
        disease_encoded = le.fit_transform(disease_labels)
    else:
        disease_encoded = disease_labels

    correlations = []
    pvalues = []

    for i in range(component_scores.shape[1]):
        corr, pval = pointbiserialr(component_scores[:, i], disease_encoded)
        correlations.append(corr)
        pvalues.append(pval)

    # Multiple testing correction (FDR)
    _, corrected_pvalues, _, _ = multitest.multipletests(
        pvalues, alpha=alpha, method='fdr_bh'
    )

    results_df = pd.DataFrame({
        'component': component_names,
        'correlation': correlations,
        'pvalue': pvalues,
        'corrected_pvalue': corrected_pvalues,
        'significant': corrected_pvalues < alpha
    })

    return results_df.sort_values('correlation', key=abs, ascending=False)


def low_rank_approximation(
    expr_matrix: np.ndarray,
    k: int,
    method: str = 'svd'
) -> Dict:
    """
    Compute rank-k approximation of expression matrix.

    Args:
        expr_matrix: Original expression matrix
        k: Target rank
        method: Decomposition method ('svd' or 'pca')

    Returns:
        Dictionary with approximation results
    """
    if method == 'svd':
        U, s, Vt = linalg.svd(expr_matrix, full_matrices=False)
        X_approx = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
    elif method == 'pca':
        pca = PCA(n_components=k)
        X_pca = pca.fit_transform(expr_matrix)
        X_approx = pca.inverse_transform(X_pca)
    else:
        raise ValueError(f"Unknown method: {method}")

    # Approximation error
    error = np.linalg.norm(expr_matrix - X_approx, 'fro')
    relative_error = error / np.linalg.norm(expr_matrix, 'fro')

    # R-squared (variance explained)
    ss_res = np.sum((expr_matrix - X_approx) ** 2)
    ss_tot = np.sum((expr_matrix - expr_matrix.mean()) ** 2)
    r_squared = 1 - (ss_res / ss_tot)

    return {
        'X_approx': X_approx,
        'error': error,
        'relative_error': relative_error,
        'r_squared': r_squared,
        'rank': k
    }


def effective_dimensionality(
    eigenvalues: np.ndarray,
    method: str = 'participation'
) -> float:
    """
    Estimate effective dimensionality of data.

    Args:
        eigenvalues: Eigenvalues from covariance/correlation matrix
        method: Estimation method ('participation' or 'entropy')

    Returns:
        Effective dimensionality estimate
    """
    # Normalize eigenvalues
    eigenvalues = np.maximum(eigenvalues, 0)  # Ensure non-negative
    total = eigenvalues.sum()
    if total == 0:
        return 0.0

    p = eigenvalues / total

    if method == 'participation':
        # Participation ratio (inverse Simpson index)
        return 1.0 / np.sum(p ** 2)
    elif method == 'entropy':
        # Entropy-based dimensionality
        p_nonzero = p[p > 0]
        return np.exp(-np.sum(p_nonzero * np.log(p_nonzero)))
    else:
        raise ValueError(f"Unknown method: {method}")
