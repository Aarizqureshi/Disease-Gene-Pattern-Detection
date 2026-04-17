import './Modules.css'

const modules = [
  {
    id: 'la',
    icon: 'Σ',
    name: 'linear_algebra.py',
    stat: '316 lines · 17 functions',
    color: 'blue',
    description: 'The core LA engine. Implements every matrix decomposition technique used in the analysis.',
    groups: [
      {
        label: 'SVD',
        fns: ['run_svd(expr, n_components)', 'svd_explained_variance_table(svd_result)', 'select_n_components_by_variance(svd_result, threshold)'],
      },
      {
        label: 'PCA',
        fns: ['run_pca(expr, n_components, center, scale)', 'pca_gene_contributions(pca_result, pc, top_n)', 'project_new_samples(pca_result, new_expr)', 'biplot_loadings(pca_result, pc_x, pc_y, top_n)'],
      },
      {
        label: 'NMF',
        fns: ['run_nmf(expr, n_components, max_iter)', 'top_metagene_genes(nmf_result, metagene, top_n)'],
      },
      {
        label: 'ICA / Correlation / Eigen',
        fns: ['run_ica(expr, n_components)', 'gene_correlation_matrix(expr, method)', 'sample_correlation_matrix(expr, method)', 'eigenvalue_decomposition(corr_matrix)', 'marchenko_pastur_threshold(n_genes, n_samples)', 'significant_eigengenes(eig_result, threshold)'],
      },
      {
        label: 'Matrix Utilities',
        fns: ['condition_number(matrix)', 'effective_rank(singular_values, threshold)', 'reconstruct_from_components(U, S, Vt, k)', 'cosine_similarity_matrix(A)'],
      },
    ],
  },
  {
    id: 'pre',
    icon: '⚙',
    name: 'preprocessing.py',
    stat: '242 lines · 12 functions',
    color: 'teal',
    description: 'Data loading, quality control, normalization, batch correction. One-shot pipeline function.',
    groups: [
      {
        label: 'Data Loading',
        fns: ['load_geo_matrix(filepath)', 'load_expression_csv(filepath, index_col)', 'load_metadata(filepath, sample_col)'],
      },
      {
        label: 'Quality Control',
        fns: ['qc_report(expr)', 'filter_low_expression(expr, min_mean, min_frac)', 'filter_low_variance(expr, variance_quantile)', 'remove_duplicate_genes(expr, keep)', 'detect_outlier_samples(expr, z_threshold)'],
      },
      {
        label: 'Normalization',
        fns: ['log2_transform(expr, pseudocount)', 'quantile_normalize(expr)', 'zscore_normalize(expr, axis)', 'tpm_normalize(counts, gene_lengths)', 'robust_scale(expr)'],
      },
      {
        label: 'Batch + Pipeline',
        fns: ['mean_center_batches(expr, batch_labels)', 'full_preprocessing_pipeline(expr, log_transform, remove_low_expr, normalise)'],
      },
    ],
  },
  {
    id: 'val',
    icon: '✓',
    name: 'validation.py',
    stat: '274 lines · 9 functions',
    color: 'purple',
    description: 'Statistical tests proving findings are real: differential expression, classifier AUC, permutation tests, bootstrap stability.',
    groups: [
      {
        label: 'Differential Expression',
        fns: ['t_test_de(expr, group_labels, group_a, group_b)', 'mann_whitney_de(expr, group_labels, group_a, group_b)'],
      },
      {
        label: 'Component Tests',
        fns: ['pc_group_anova(scores, group_labels)', 'pc_continuous_correlation(scores, continuous_var, method)'],
      },
      {
        label: 'Classifier Validation',
        fns: ['cross_validate_classifier(clf, X, y, n_splits, scoring)', 'evaluate_binary_classifier(clf, X_train, y_train, X_test, y_test)'],
      },
      {
        label: 'Enrichment + Robustness',
        fns: ['hypergeometric_enrichment(gene_list, gene_sets, background_size)', 'bootstrap_pca_stability(expr, n_bootstraps, n_components)', 'permutation_test_auc(clf, X, y, n_permutations)'],
      },
    ],
  },
  {
    id: 'vis',
    icon: '📊',
    name: 'visualization.py',
    stat: '408 lines · 13 plot types',
    color: 'orange',
    description: '13 publication-quality plot functions for every analysis output — scree, volcano, biplot, UMAP, heatmaps, network.',
    groups: [
      {
        label: 'Dimensionality Reduction',
        fns: ['plot_scree(explained_variance_ratio)', 'plot_pca_scatter(scores, labels)', 'plot_pca_3d(scores, labels)', 'plot_biplot(scores, loadings, labels)', 'plot_umap(embedding, labels)'],
      },
      {
        label: 'Heatmaps',
        fns: ['plot_expression_heatmap(expr, top_n_genes)', 'plot_correlation_heatmap(corr_matrix)', 'plot_nmf_H_heatmap(H, col_labels)'],
      },
      {
        label: 'Gene Analysis',
        fns: ['plot_gene_loadings(loadings_col, top_n)', 'plot_metagene_weights(W, metagene, top_n)', 'plot_eigenvalue_spectrum(eigenvalues, mp_threshold)', 'plot_correlation_network(corr_matrix, threshold)', 'plot_volcano(de_df, fc_thresh, p_thresh)'],
      },
    ],
  },
]

export default function Modules() {
  return (
    <section id="modules" className="section dark-section modules-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">SOURCE CODE</span>
          <h2>Python Module Reference</h2>
          <p>Four reusable library modules — the engineering backbone of the analysis.</p>
        </div>

        <div className="modules-grid">
          {modules.map(m => (
            <div key={m.id} className={`mod-card mod-${m.color}`}>
              <div className="mod-header">
                <span className="mod-icon">{m.icon}</span>
                <div className="mod-meta">
                  <h3>{m.name}</h3>
                  <span className="mod-stat">{m.stat}</span>
                </div>
              </div>
              <p className="mod-desc">{m.description}</p>
              <div className="mod-groups">
                {m.groups.map(g => (
                  <div key={g.label} className="mod-group">
                    <div className="mg-label">{g.label}</div>
                    {g.fns.map(fn => (
                      <code key={fn} className="mg-fn">{fn}</code>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
