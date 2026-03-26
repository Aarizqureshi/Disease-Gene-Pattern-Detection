"""
Preprocessing module for gene expression data.

This module provides functions for quality control, normalization,
and standardization of high-dimensional gene expression matrices.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, RobustScaler
from typing import Tuple, Dict, Optional


def load_expression_data(filepath: str, clinical_path: Optional[str] = None) -> Tuple[pd.DataFrame, Optional[pd.DataFrame]]:
    """
    Load gene expression data and optional clinical metadata.

    Args:
        filepath: Path to expression matrix CSV (genes as rows, samples as columns)
        clinical_path: Optional path to clinical metadata CSV

    Returns:
        Tuple of (expression_df, clinical_df or None)
    """
    expr_df = pd.read_csv(filepath, index_col=0)

    clinical_df = None
    if clinical_path:
        clinical_df = pd.read_csv(clinical_path, index_col=0)

    return expr_df, clinical_df


def quality_control_report(expr_df: pd.DataFrame) -> Dict:
    """
    Generate comprehensive QC report for expression data.

    Args:
        expr_df: Raw expression DataFrame

    Returns:
        Dictionary with QC statistics
    """
    n_genes, n_samples = expr_df.shape

    # Zero statistics
    zeros_per_gene = (expr_df == 0).sum(axis=1)
    zeros_per_sample = (expr_df == 0).sum(axis=0)

    # Missing values
    missing_per_gene = expr_df.isna().sum()
    missing_per_sample = expr_df.isna().sum(axis=0)

    # Expression statistics
    mean_expr = expr_df.mean(axis=1)
    std_expr = expr_df.std(axis=1)
    median_expr = expr_df.median(axis=1)

    return {
        'n_genes': n_genes,
        'n_samples': n_samples,
        'total_zeros': (expr_df == 0).sum().sum(),
        'zero_fraction_per_gene': zeros_per_gene / n_samples,
        'zero_fraction_per_sample': zeros_per_sample / n_genes,
        'missing_per_gene': missing_per_gene,
        'missing_per_sample': missing_per_sample,
        'mean_expression': mean_expr,
        'std_expression': std_expr,
        'median_expression': median_expr,
        'genes_with_any_zero': (zeros_per_gene > 0).sum(),
        'genes_all_zero': (zeros_per_gene == n_samples).sum(),
        'samples_with_any_zero': (zeros_per_sample > 0).sum(),
    }


def filter_genes_by_expression(
    expr_df: pd.DataFrame,
    max_zero_fraction: float = 0.8,
    min_variance_percentile: float = 50,
    remove_missing: bool = True
) -> pd.DataFrame:
    """
    Filter genes based on expression quality and variability.

    Args:
        expr_df: Raw expression DataFrame
        max_zero_fraction: Maximum allowed fraction of zeros per gene
        min_variance_percentile: Keep genes above this variance percentile
        remove_missing: Whether to remove genes with any missing values

    Returns:
        Filtered expression DataFrame
    """
    df = expr_df.copy()

    # Remove genes with all zeros
    non_zero_mask = (df != 0).any(axis=1)
    df = df.loc[non_zero_mask]
    print(f"After removing all-zero genes: {df.shape[0]} genes remaining")

    # Remove genes with excessive zeros
    zero_fraction = (df == 0).sum(axis=1) / df.shape[1]
    zero_mask = zero_fraction < max_zero_fraction
    df = df.loc[zero_mask]
    print(f"After zero fraction filter (<{max_zero_fraction}): {df.shape[0]} genes remaining")

    # Remove genes with missing values
    if remove_missing:
        missing_mask = ~df.isna().any(axis=1)
        df = df.loc[missing_mask]
        print(f"After removing missing values: {df.shape[0]} genes remaining")

    # Variance-based filtering (applied after log transform typically)
    if min_variance_percentile > 0:
        gene_variance = df.var(axis=1)
        variance_threshold = np.percentile(gene_variance, min_variance_percentile)
        variance_mask = gene_variance > variance_threshold
        df = df.loc[variance_mask]
        print(f"After variance filter (>{min_variance_percentile}th percentile): {df.shape[0]} genes remaining")

    return df


def log_transform(expr_df: pd.DataFrame, pseudocount: float = 1.0) -> pd.DataFrame:
    """
    Apply log2 transformation to expression data.

    Args:
        expr_df: Expression DataFrame (non-negative values)
        pseudocount: Value to add before log transform

    Returns:
        Log-transformed DataFrame
    """
    return np.log2(expr_df + pseudocount)


def normalize_samples(
    expr_df: pd.DataFrame,
    method: str = 'zscore',
    axis: str = 'genes'
) -> pd.DataFrame:
    """
    Normalize expression data using specified method.

    Args:
        expr_df: Expression DataFrame
        method: Normalization method ('zscore', 'robust', 'minmax')
        axis: Whether to normalize genes (rows) or samples (columns)

    Returns:
        Normalized DataFrame
    """
    if axis == 'genes':
        normalize_axis = 0
    elif axis == 'samples':
        normalize_axis = 1
    else:
        raise ValueError("axis must be 'genes' or 'samples'")

    if method == 'zscore':
        scaler = StandardScaler()
    elif method == 'robust':
        scaler = RobustScaler()
    else:
        raise ValueError(f"Unknown method: {method}")

    # sklearn works on samples as rows, so transpose if needed
    if axis == 'genes':
        normalized = scaler.fit_transform(expr_df.T).T
    else:
        normalized = scaler.fit_transform(expr_df)

    return pd.DataFrame(
        normalized,
        index=expr_df.index,
        columns=expr_df.columns
    )


def preprocess_expression(
    expr_df: pd.DataFrame,
    max_zero_fraction: float = 0.8,
    min_variance_percentile: float = 50,
    log_transform_flag: bool = True,
    normalization_method: str = 'zscore'
) -> Tuple[pd.DataFrame, Dict]:
    """
    Complete preprocessing pipeline for gene expression data.

    Args:
        expr_df: Raw expression DataFrame
        max_zero_fraction: Max zeros allowed per gene
        min_variance_percentile: Min variance percentile to keep gene
        log_transform_flag: Whether to apply log2 transform
        normalization_method: Method for final normalization

    Returns:
        Tuple of (preprocessed DataFrame, QC statistics dict)
    """
    # Step 1: QC report on raw data
    qc_stats = quality_control_report(expr_df)
    qc_stats['raw_shape'] = expr_df.shape

    # Step 2: Filter genes
    expr_filtered = filter_genes_by_expression(
        expr_df,
        max_zero_fraction=max_zero_fraction,
        min_variance_percentile=0,  # Variance filter after log transform
        remove_missing=True
    )

    # Step 3: Log transform
    if log_transform_flag:
        expr_log = log_transform(expr_filtered)
        qc_stats['log_transformed'] = True
    else:
        expr_log = expr_filtered
        qc_stats['log_transformed'] = False

    # Step 4: Variance filter (on log-transformed data)
    if min_variance_percentile > 0:
        gene_variance = expr_log.var(axis=1)
        variance_threshold = np.percentile(gene_variance, min_variance_percentile)
        variance_mask = gene_variance > variance_threshold
        expr_log = expr_log.loc[variance_mask]
        qc_stats['variance_filtered'] = expr_log.shape[0]

    # Step 5: Normalize
    expr_normalized = normalize_samples(expr_log, method=normalization_method)

    # Final QC
    qc_stats['final_shape'] = expr_normalized.shape
    qc_stats['genes_removed'] = qc_stats['raw_shape'][0] - qc_stats['final_shape'][0]
    qc_stats['samples_removed'] = qc_stats['raw_shape'][1] - qc_stats['final_shape'][1]

    return expr_normalized, qc_stats


def batch_correction_comBat(
    expr_df: pd.DataFrame,
    batch_labels: pd.Series
) -> pd.DataFrame:
    """
    Apply ComBat batch correction (simplified implementation).

    For production use, consider the pycombat or sva packages.

    Args:
        expr_df: Normalized expression DataFrame
        batch_labels: Series indicating batch for each sample

    Returns:
        Batch-corrected DataFrame
    """
    # Simple mean-centering per batch (simplified ComBat)
    df = expr_df.copy()
    batches = batch_labels.unique()

    # Calculate global mean
    global_mean = df.mean(axis=1)

    # Center each batch
    for batch in batches:
        batch_mask = batch_labels == batch
        batch_mean = df.loc[:, batch_mask].mean(axis=1)
        # Adjust batch to have same mean as global
        df.loc[:, batch_mask] = df.loc[:, batch_mask] - batch_mean.values[:, np.newaxis] + global_mean.values[:, np.newaxis]

    return df


def select_most_variable_genes(
    expr_df: pd.DataFrame,
    n_genes: int = 5000
) -> pd.DataFrame:
    """
    Select the most variable genes for downstream analysis.

    Args:
        expr_df: Normalized expression DataFrame
        n_genes: Number of genes to select

    Returns:
        DataFrame with selected genes only
    """
    gene_variance = expr_df.var(axis=1)
    top_genes = gene_variance.nlargest(n_genes).index
    return expr_df.loc[top_genes]
