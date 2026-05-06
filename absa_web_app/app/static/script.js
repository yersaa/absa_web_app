const ASPECT_NAMES = {
  FQ: "Food Quality",
  SS: "Staff Service",
  OA: "Order Accuracy",
  CL: "Cleanliness/Hygiene",
  PV: "Price/Value",
  WS: "Wait/Speed",
  AM: "Ambience",
  LO: "Location",
};

const DEFAULT_WEIGHTS = {
  "Food Quality": 0.25,
  "Staff Service": 0.20,
  "Wait/Speed": 0.15,
  "Order Accuracy": 0.10,
  "Cleanliness/Hygiene": 0.10,
  "Price/Value": 0.10,
  "Ambience": 0.05,
  "Location": 0.05,
};

const state = {
  analysis: null,
  selectedTab: "overview",
  currentFile: null,
  manualTextColumn: null,
  reviewPage: 1,
  reviewMode: "cards",
  branchFilters: { ratingMin: 0, ratingMax: 5, sqiMin: 0, sqiMax: 100, negMax: 1, minReviews: 0 },
};

const $ = (id) => document.getElementById(id);

function fmt(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return Number(value).toFixed(digits);
}

function pct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("absa-theme", theme);
}

function getWeights() {
  const weights = {};
  document.querySelectorAll("[data-weight-name]").forEach((input) => {
    weights[input.dataset.weightName] = Number(input.value);
  });
  return weights;
}

function renderWeights() {
  const box = $("weightsContainer");
  box.innerHTML = Object.entries(DEFAULT_WEIGHTS).map(([name, value]) => `
    <label>${name} <span id="weight-${name.replaceAll(" ", "-")}">${value.toFixed(2)}</span></label>
    <input type="range" min="0" max="0.5" step="0.01" value="${value}" data-weight-name="${name}">
  `).join("");
  box.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const span = $(`weight-${input.dataset.weightName.replaceAll(" ", "-")}`);
      if (span) span.textContent = Number(input.value).toFixed(2);
      if (state.analysis) renderAll();
    });
  });
}

function setLoading(isLoading, message = "Analyzing reviews...") {
  $("loadingBox").classList.toggle("hidden", !isLoading);
  $("loadingText").textContent = message;
}

function showError(message) {
  const box = $("errorBox");
  box.textContent = message;
  box.classList.remove("hidden");
}

function clearError() {
  $("errorBox").classList.add("hidden");
  $("errorBox").textContent = "";
}

async function checkHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();
    $("healthBadge").textContent = `Backend OK · ${data.device}`;
  } catch {
    $("healthBadge").textContent = "Backend unavailable";
  }
}

async function analyzeSingle() {
  clearError();
  const text = $("singleText").value.trim();
  if (!text) return;
  $("singleResult").innerHTML = `<p class="muted">Analyzing...</p>`;
  const payload = {
    text,
    star_rating: $("singleRating").value ? Number($("singleRating").value) : null,
    model_name: $("modelSelect").value,
    aspect_threshold: Number($("thresholdInput").value),
  };
  try {
    const response = await fetch("/api/analyze-single", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Single review analysis failed");
    $("singleResult").innerHTML = `
      <div class="review-meta">${data.predictions.map(p => `<span class="aspect-pill">${p.aspect_id} · ${p.aspect_name}</span>`).join("")}</div>
      <p><strong>Tendency:</strong> ${escapeHtml(data.summary.overall_tendency)}</p>
      <p class="muted">${escapeHtml(data.summary.business_insight)}</p>
      ${tableHtml(data.predictions, ["aspect_id", "aspect_name", "aspect_confidence", "sentiment", "sentiment_confidence", "low_confidence_flag"])}
    `;
  } catch (error) {
    $("singleResult").innerHTML = `<p class="error-box">${escapeHtml(error.message)}</p>`;
  }
}

async function analyzeFile() {
  clearError();
  const file = $("fileInput").files[0] || state.currentFile;
  if (!file) {
    showError("Please choose an .xlsx file first.");
    return;
  }
  state.currentFile = file;
  const form = new FormData();
  form.append("file", file);
  form.append("model_name", $("modelSelect").value);
  form.append("aspect_threshold", $("thresholdInput").value);
  form.append("sqi_weights", JSON.stringify(getWeights()));
  if (state.manualTextColumn) form.append("text_column", state.manualTextColumn);

  setLoading(true, "Uploading file and running local model inference...");
  $("analyzeFileBtn").disabled = true;
  try {
    const response = await fetch("/api/analyze-file", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) {
      if (data.error_code === "missing_text_column" || data.detail?.columns) {
        const columns = data.columns || data.detail.columns || [];
        renderManualColumnSelect(columns);
        throw new Error(data.message || data.detail.message || "Select the review text column manually.");
      }
      throw new Error(data.detail || "File analysis failed.");
    }
    state.analysis = data;
    state.reviewPage = 1;
    $("emptyState").classList.add("hidden");
    $("dashboardArea").classList.remove("hidden");
    $("manualColumnBox").classList.add("hidden");
    renderAll();
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
    $("analyzeFileBtn").disabled = false;
  }
}

function renderManualColumnSelect(columns) {
  const box = $("manualColumnBox");
  const select = $("manualTextColumn");
  select.innerHTML = columns.map(col => `<option>${escapeHtml(col)}</option>`).join("");
  select.onchange = () => { state.manualTextColumn = select.value; };
  state.manualTextColumn = columns[0] || null;
  box.classList.remove("hidden");
}

function tableHtml(rows, columns) {
  if (!rows || !rows.length) return `<p class="muted">No data available.</p>`;
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>
    ${rows.map(row => `<tr>${columns.map(c => `<td>${escapeHtml(formatCell(row[c]))}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div>`;
}

function formatCell(value) {
  if (typeof value === "number") return Number.isInteger(value) ? value : value.toFixed(3);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return value ?? "";
}

function kpiHtml(label, value, sub = "") {
  return `<div class="kpi-card"><span>${label}</span><strong>${value}</strong>${sub ? `<p class="muted">${sub}</p>` : ""}</div>`;
}

function renderAll() {
  if (!state.analysis) return;
  renderOverview();
  renderPraise();
  renderProblems();
  renderBranches();
  renderReviews();
  renderActions();
  renderBranchAnalysis();
}

function renderOverview() {
  const area = $("overview");
  const summary = state.analysis.dashboard.summary;
  const hasBranches = state.analysis.venue_analytics?.length;
  area.innerHTML = `
    <div class="kpi-grid">
      ${kpiHtml("Average rating", fmt(summary.average_rating, 2))}
      ${kpiHtml("Total reviews", summary.total_reviews ?? 0)}
      ${kpiHtml("Aspect mentions", summary.total_aspect_mentions ?? 0)}
      ${kpiHtml("Response rate", summary.response_rate == null ? "N/A" : pct(summary.response_rate))}
      ${kpiHtml("NPS", summary.nps == null ? "N/A" : fmt(summary.nps, 0))}
      ${kpiHtml("Overall SQI", fmt(summary.overall_sqi, 1))}
      ${kpiHtml("Negative share", pct(summary.negative_aspect_share))}
      ${kpiHtml("Main problem", escapeHtml(summary.most_problematic_aspect || "N/A"))}
    </div>
    <div class="actions-row">
      <button class="primary-button" id="downloadCsvBtn">Download predictions CSV</button>
      <button class="ghost-button" id="downloadExcelBtn">Download Excel report</button>
    </div>
    <div class="grid-2">
      ${chartCard("ratingTrend", "Rating trend by month")}
      ${chartCard("ratingDistribution", "Star rating distribution")}
      ${chartCard("aspectDistribution", "Aspect mention distribution")}
      ${chartCard("sentimentDistribution", "Sentiment distribution")}
      ${chartCard("sentimentByAspectOverview", "Sentiment by aspect")}
      ${chartCard("sqiByAspectOverview", "SQI by aspect")}
      ${chartCard("negativeShareOverview", "Negative share by aspect")}
      ${chartCard("sqiTrendOverview", "SQI trend over time")}
      ${chartCard("venueComparisonOverview", "Venue comparison")}
    </div>
    ${hasBranches ? `<div class="grid-2"><div class="card">${tableHtml(state.analysis.dashboard.top_branches_best, ["branch_name", "review_count", "overall_sqi", "negative_share"])}</div><div class="card">${tableHtml(state.analysis.dashboard.top_branches_worst, ["branch_name", "review_count", "overall_sqi", "negative_share"])}</div></div>` : ""}
  `;
  $("downloadCsvBtn").onclick = downloadCsv;
  $("downloadExcelBtn").onclick = downloadExcel;
  drawLineChart("ratingTrend", state.analysis.dashboard.rating_trend || [], { x: "month", y: "average_rating", color: "#3b82f6", maxY: 5 });
  drawHorizontalBarChart("ratingDistribution", state.analysis.dashboard.rating_distribution || [], { label: "rating", value: "count", color: "#3b82f6" });
  drawBarChart("aspectDistribution", state.analysis.dashboard.aspect_distribution || [], { label: "aspect_name", value: "count", color: "#3b82f6" });
  drawDonutChart("sentimentDistribution", state.analysis.dashboard.sentiment_distribution || [], { label: "sentiment", value: "count" });
  drawStackedBarChart("sentimentByAspectOverview", pivotSentimentByAspect(state.analysis.dashboard.sentiment_by_aspect || []), { label: "aspect_name" });
  drawBarChart("sqiByAspectOverview", state.analysis.sqi.by_aspect || [], { label: "aspect_name", value: "sqi", color: "#3b82f6", maxY: 100 });
  drawBarChart("negativeShareOverview", state.analysis.aspect_analytics || [], { label: "aspect_name", value: "negative_share", color: "#ef4444", maxY: 1 });
  drawLineChart("sqiTrendOverview", state.analysis.time_trend || [], { x: "month", y: "sqi", color: "#22c55e", maxY: 100 });
  drawBarChart("venueComparisonOverview", state.analysis.venue_analytics || [], { label: "branch_name", value: "overall_sqi", color: "#3b82f6", maxY: 100 });
}

function renderPraise() {
  const positives = state.analysis.strengths || [];
  const quotes = state.analysis.predictions.filter(p => p.sentiment === "positive").slice(0, 8);
  $("praise").innerHTML = `
    <div class="grid-2">
      <div class="card"><h2>Positive aspects ranked by positive share</h2>${tableHtml(positives, ["aspect_name", "positive_share", "positive_count", "sample_quote"])}</div>
      <div class="card"><h2>Positive keyword cloud</h2><div class="word-cloud">${keywordCloudHtml(state.analysis.keyword_clouds?.positive || [])}</div></div>
    </div>
    <div class="card"><h2>Positive customer quotes</h2>${reviewQuoteHtml(quotes)}</div>
  `;
}

function renderProblems() {
  const problems = state.analysis.problem_areas || [];
  const quotes = state.analysis.predictions.filter(p => p.sentiment === "negative").slice(0, 10);
  $("problems").innerHTML = `
    <div class="grid-2">
      <div class="card"><h2>Negative aspects ranked by negative share</h2>${tableHtml(problems, ["aspect_name", "negative_share", "negative_count", "priority", "recommendation"])}</div>
      <div class="card"><h2>Negative keyword cloud</h2><div class="word-cloud">${keywordCloudHtml(state.analysis.keyword_clouds?.negative || [])}</div></div>
    </div>
    <div class="card"><h2>Negative customer quotes</h2>${reviewQuoteHtml(quotes)}</div>
  `;
}

function renderBranches() {
  const branches = state.analysis.venue_analytics || [];
  if (!branches.length) {
    $("branches").innerHTML = `<section class="card empty-state"><h2>Branch analytics unavailable</h2><p>Branch analytics is available when your Excel file contains a branch or restaurant column.</p></section>`;
    return;
  }
  const f = state.branchFilters;
  const filtered = branches.filter(b =>
    (b.average_rating == null || (b.average_rating >= f.ratingMin && b.average_rating <= f.ratingMax)) &&
    (b.overall_sqi == null || (b.overall_sqi >= f.sqiMin && b.overall_sqi <= f.sqiMax)) &&
    (b.negative_share == null || b.negative_share <= f.negMax) &&
    (b.review_count || 0) >= f.minReviews
  );
  $("branches").innerHTML = `
    <div class="card">
      <h2>Branch table</h2>
      <div class="filters">
        ${rangeInput("Rating min", "branchRatingMin", f.ratingMin, 0, 5, 0.5)}
        ${rangeInput("SQI min", "branchSqiMin", f.sqiMin, 0, 100, 5)}
        ${rangeInput("Max negative share", "branchNegMax", f.negMax, 0, 1, 0.05)}
        ${rangeInput("Minimum reviews", "branchMinReviews", f.minReviews, 0, 100, 1)}
      </div>
      ${tableHtml(filtered, ["branch_name", "address", "average_rating", "review_count", "aspect_mentions", "overall_sqi", "negative_share", "positive_share", "response_rate", "nps", "most_problematic_aspect", "strongest_aspect"])}
    </div>
  `;
  bindBranchFilters();
}

function renderReviews() {
  const rows = filteredReviews();
  const grouped = groupByReview(rows);
  const totalPages = Math.max(1, Math.ceil(grouped.length / 20));
  state.reviewPage = Math.min(state.reviewPage, totalPages);
  const pageItems = grouped.slice((state.reviewPage - 1) * 20, state.reviewPage * 20);
  $("reviews").innerHTML = `
    <div class="card">
      <h2>Review Explorer</h2>
      <div class="filters">
        <input id="reviewSearch" placeholder="Search review text" value="${escapeHtml($("reviewSearch")?.value || "")}">
        <select id="reviewAspect">${optionList(["All", ...unique(state.analysis.predictions.map(p => p.aspect_name))], $("reviewAspect")?.value || "All")}</select>
        <select id="reviewSentiment">${optionList(["All", "positive", "neutral", "negative"], $("reviewSentiment")?.value || "All")}</select>
        <select id="reviewMode">${optionList(["cards", "table"], state.reviewMode)}</select>
        <select id="reviewBranch">${optionList(["All", ...unique(state.analysis.predictions.map(p => p.venue).filter(Boolean))], $("reviewBranch")?.value || "All")}</select>
        <input id="reviewRatingMin" type="number" min="0" max="5" step="0.5" placeholder="Min rating" value="${escapeHtml($("reviewRatingMin")?.value || "")}">
        <input id="reviewRatingMax" type="number" min="0" max="5" step="0.5" placeholder="Max rating" value="${escapeHtml($("reviewRatingMax")?.value || "")}">
        <label class="inline-check"><input id="reviewLowConfidence" type="checkbox" ${$("reviewLowConfidence")?.checked ? "checked" : ""}> Low confidence only</label>
      </div>
      <div class="actions-row">
        <button class="ghost-button" id="prevPage">Previous</button>
        <span>Page ${state.reviewPage} of ${totalPages}</span>
        <button class="ghost-button" id="nextPage">Next</button>
      </div>
      <div id="reviewList">${state.reviewMode === "table" ? tableHtml(rows.slice(0, 200), ["review_id", "original_review", "star_rating", "venue", "date", "aspect_name", "sentiment", "aspect_confidence", "sentiment_confidence"]) : pageItems.map(reviewCardHtml).join("")}</div>
    </div>
  `;
  bindReviewFilters();
}

function renderActions() {
  const recs = state.analysis.recommendations || [];
  $("actions").innerHTML = `
    <div class="card">
      <h2>Recommended management actions</h2>
      ${recs.length ? recs.map(r => `
        <div class="review-card">
          <div class="review-meta"><span class="badge negative">${escapeHtml(r.priority)}</span><span class="aspect-pill">${escapeHtml(r.aspect_name)}</span></div>
          <p><strong>Why it matters:</strong> ${escapeHtml(r.why_it_matters)}</p>
          <p><strong>Recommended action:</strong> ${escapeHtml(r.recommendation)}</p>
          <p><strong>Example quote:</strong> ${escapeHtml(r.sample_quote || "N/A")}</p>
          <p><strong>Suggested response:</strong> ${escapeHtml(r.response_template)}</p>
        </div>
      `).join("") : "<p class='muted'>No urgent problem areas detected.</p>"}
    </div>
  `;
}

function renderBranchAnalysis() {
  const branches = state.analysis.venue_analytics || [];
  if (!branches.length) {
    $("branchAnalysis").innerHTML = `<section class="card empty-state"><h2>Branch-level analysis requires a branch column</h2><p>Upload a file with venue, restaurant or branch information to unlock this section.</p></section>`;
    return;
  }
  const current = $("branchSelect")?.value || branches[0].branch_name;
  const branch = branches.find(b => String(b.branch_name) === String(current)) || branches[0];
  const branchPredictions = state.analysis.predictions.filter(p => String(p.venue) === String(branch.branch_name));
  const positive = branchPredictions.filter(p => p.sentiment === "positive").slice(0, 5);
  const negative = branchPredictions.filter(p => p.sentiment === "negative").slice(0, 5);
  $("branchAnalysis").innerHTML = `
    <div class="card">
      <label>Select branch</label>
      <select id="branchSelect">${branches.map(b => `<option ${b.branch_name === branch.branch_name ? "selected" : ""}>${escapeHtml(b.branch_name)}</option>`).join("")}</select>
    </div>
    <div class="kpi-grid">
      ${kpiHtml("Average rating", fmt(branch.average_rating, 2))}
      ${kpiHtml("Reviews", branch.review_count)}
      ${kpiHtml("SQI", fmt(branch.overall_sqi, 1))}
      ${kpiHtml("Negative share", pct(branch.negative_share))}
      ${kpiHtml("Strongest aspect", escapeHtml(branch.strongest_aspect || "N/A"))}
      ${kpiHtml("Weakest aspect", escapeHtml(branch.most_problematic_aspect || "N/A"))}
    </div>
    <div class="grid-2">
      ${chartCard("branchSentiment", "Sentiment by aspect")}
      ${chartCard("branchSqi", "SQI by aspect")}
    </div>
    <div class="grid-2">
      <div class="card"><h2>Representative positive reviews</h2>${reviewQuoteHtml(positive)}</div>
      <div class="card"><h2>Representative negative reviews</h2>${reviewQuoteHtml(negative)}</div>
    </div>
  `;
  $("branchSelect").onchange = renderBranchAnalysis;
  const byAspect = aggregateSentimentByAspect(branchPredictions);
  drawStackedBarChart("branchSentiment", byAspect, { label: "aspect_name" });
  drawBarChart("branchSqi", branchAspectSqi(branchPredictions), { label: "aspect_name", value: "sqi", color: "#3b82f6", maxY: 100 });
}

function chartCard(id, title) {
  return `<div class="card chart-card"><h2>${title}</h2><canvas id="${id}"></canvas></div>`;
}

function keywordCloudHtml(words) {
  return words.map(w => `<span style="font-size:${Math.min(28, 12 + w.count * 2)}px">${escapeHtml(w.keyword)}</span>`).join("");
}

function reviewQuoteHtml(rows) {
  if (!rows.length) return "<p class='muted'>No matching reviews.</p>";
  return rows.map(r => `<div class="review-card"><p>${escapeHtml(r.original_review)}</p><div class="review-meta"><span class="badge ${r.sentiment}">${r.sentiment}</span><span>${escapeHtml(r.aspect_name)}</span><span>Rating: ${escapeHtml(r.star_rating ?? "N/A")}</span></div></div>`).join("");
}

function reviewCardHtml(group) {
  const first = group[0];
  return `<div class="review-card">
    <p>${escapeHtml(first.original_review)}</p>
    <div class="review-meta">
      <span>Rating: ${escapeHtml(first.star_rating ?? "N/A")}</span>
      <span>${escapeHtml(first.venue ?? "")}</span>
      <span>${escapeHtml(first.date ?? "")}</span>
      <span>${escapeHtml(first.platform ?? "")}</span>
    </div>
    <div class="review-meta">${group.map(p => `<span class="aspect-pill">${escapeHtml(p.aspect_id)} · ${escapeHtml(p.aspect_name)} · ${escapeHtml(p.aspect_confidence?.toFixed?.(2) ?? "")}</span><span class="badge ${p.sentiment}">${escapeHtml(p.sentiment)} ${escapeHtml(p.sentiment_confidence?.toFixed?.(2) ?? "")}</span>`).join("")}</div>
  </div>`;
}

function aggregateSentimentByAspect(rows) {
  const map = {};
  rows.forEach(r => {
    map[r.aspect_name] ||= { aspect_name: r.aspect_name, positive: 0, neutral: 0, negative: 0 };
    map[r.aspect_name][r.sentiment] += 1;
  });
  return Object.values(map);
}

function pivotSentimentByAspect(rows) {
  const map = {};
  rows.forEach(r => {
    map[r.aspect_name] ||= { aspect_name: r.aspect_name, positive: 0, neutral: 0, negative: 0 };
    map[r.aspect_name][r.sentiment] = (map[r.aspect_name][r.sentiment] || 0) + (r.count || 0);
  });
  return Object.values(map);
}

function branchAspectSqi(rows) {
  const map = {};
  rows.forEach(r => {
    const score = ({ positive: 100, neutral: 60, negative: 20 }[r.sentiment] || 60) * (r.sentiment_confidence || 0);
    map[r.aspect_name] ||= [];
    map[r.aspect_name].push(score);
  });
  return Object.entries(map).map(([aspect_name, values]) => ({ aspect_name, sqi: values.reduce((a, b) => a + b, 0) / values.length }));
}

function filteredReviews() {
  let rows = [...state.analysis.predictions];
  const search = $("reviewSearch")?.value?.toLowerCase() || "";
  const aspect = $("reviewAspect")?.value || "All";
  const sentiment = $("reviewSentiment")?.value || "All";
  const branch = $("reviewBranch")?.value || "All";
  const minRating = $("reviewRatingMin")?.value === "" ? null : Number($("reviewRatingMin")?.value);
  const maxRating = $("reviewRatingMax")?.value === "" ? null : Number($("reviewRatingMax")?.value);
  const lowOnly = $("reviewLowConfidence")?.checked || false;
  if (search) rows = rows.filter(r => String(r.original_review).toLowerCase().includes(search));
  if (aspect !== "All") rows = rows.filter(r => r.aspect_name === aspect);
  if (sentiment !== "All") rows = rows.filter(r => r.sentiment === sentiment);
  if (branch !== "All") rows = rows.filter(r => String(r.venue) === String(branch));
  if (minRating !== null) rows = rows.filter(r => Number(r.star_rating) >= minRating);
  if (maxRating !== null) rows = rows.filter(r => Number(r.star_rating) <= maxRating);
  if (lowOnly) rows = rows.filter(r => r.low_confidence_flag);
  return rows;
}

function groupByReview(rows) {
  const map = {};
  rows.forEach(row => {
    map[row.review_id] ||= [];
    map[row.review_id].push(row);
  });
  return Object.values(map);
}

function unique(values) {
  return [...new Set(values.filter(v => v !== null && v !== undefined))].sort();
}

function optionList(options, selected) {
  return options.map(o => `<option ${String(o) === String(selected) ? "selected" : ""}>${escapeHtml(o)}</option>`).join("");
}

function rangeInput(label, id, value, min, max, step) {
  return `<label>${label}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
}

function bindBranchFilters() {
  const mapping = [
    ["branchRatingMin", "ratingMin"],
    ["branchSqiMin", "sqiMin"],
    ["branchNegMax", "negMax"],
    ["branchMinReviews", "minReviews"],
  ];
  mapping.forEach(([id, key]) => {
    const el = $(id);
    if (el) el.oninput = () => { state.branchFilters[key] = Number(el.value); renderBranches(); };
  });
}

function bindReviewFilters() {
  ["reviewSearch", "reviewAspect", "reviewSentiment", "reviewBranch", "reviewRatingMin", "reviewRatingMax", "reviewLowConfidence"].forEach(id => {
    const el = $(id);
    if (el) el.oninput = () => { state.reviewPage = 1; renderReviews(); };
  });
  const mode = $("reviewMode");
  if (mode) mode.onchange = () => { state.reviewMode = mode.value; renderReviews(); };
  $("prevPage").onclick = () => { state.reviewPage = Math.max(1, state.reviewPage - 1); renderReviews(); };
  $("nextPage").onclick = () => { state.reviewPage += 1; renderReviews(); };
}

function downloadCsv() {
  const rows = state.analysis?.predictions || [];
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const csv = [columns.join(",")].concat(rows.map(row => columns.map(c => `"${String(row[c] ?? "").replaceAll('"', '""')}"`).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, "absa_predictions.csv");
}

async function downloadExcel() {
  if (!state.analysis) return;
  const response = await fetch("/api/export-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.analysis),
  });
  const blob = await response.blob();
  downloadBlob(blob, "absa_manager_report.xlsx");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.tab).classList.add("active");
      state.selectedTab = btn.dataset.tab;
      if (state.analysis) renderAll();
    });
  });
}

function canvasSetup(id) {
  const canvas = $(id);
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.font = "12px system-ui";
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text");
  return { canvas, ctx, width: rect.width, height: rect.height };
}

function drawAxes(ctx, width, height) {
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
  ctx.beginPath();
  ctx.moveTo(42, 16);
  ctx.lineTo(42, height - 36);
  ctx.lineTo(width - 12, height - 36);
  ctx.stroke();
}

function drawBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId); if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  drawAxes(ctx, width, height);
  const max = options.maxY || Math.max(...data.map(d => Number(d[options.value]) || 0), 1);
  const barWidth = (width - 70) / data.length * 0.72;
  data.forEach((d, i) => {
    const value = Number(d[options.value]) || 0;
    const x = 52 + i * ((width - 70) / data.length);
    const h = (height - 60) * value / max;
    ctx.fillStyle = options.color || "#3b82f6";
    ctx.fillRect(x, height - 36 - h, barWidth, h);
    ctx.save(); ctx.translate(x, height - 18); ctx.rotate(-0.45); ctx.fillStyle = currentTextColor(); ctx.fillText(String(d[options.label]).slice(0, 14), 0, 0); ctx.restore();
  });
}

function drawHorizontalBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId); if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const max = Math.max(...data.map(d => Number(d[options.value]) || 0), 1);
  const rowH = Math.min(30, (height - 20) / data.length);
  data.forEach((d, i) => {
    const y = 16 + i * rowH;
    const value = Number(d[options.value]) || 0;
    const w = (width - 100) * value / max;
    ctx.fillStyle = currentTextColor(); ctx.fillText(String(d[options.label]), 8, y + 14);
    ctx.fillStyle = options.color || "#3b82f6";
    ctx.fillRect(80, y, w, rowH * 0.58);
    ctx.fillStyle = currentTextColor(); ctx.fillText(String(value), 88 + w, y + 14);
  });
}

function drawLineChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId); if (!setup) return;
  const { ctx, width, height } = setup;
  const clean = data.filter(d => d[options.y] !== null && d[options.y] !== undefined);
  if (!clean.length) return drawEmpty(ctx, width, height);
  drawAxes(ctx, width, height);
  const max = options.maxY || Math.max(...clean.map(d => Number(d[options.y]) || 0), 1);
  const min = 0;
  ctx.strokeStyle = options.color || "#3b82f6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  clean.forEach((d, i) => {
    const x = 42 + i * ((width - 60) / Math.max(1, clean.length - 1));
    const y = height - 36 - ((Number(d[options.y]) - min) / (max - min || 1)) * (height - 60);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    ctx.fillStyle = currentTextColor();
    ctx.fillText(String(d[options.x]).slice(2), x - 12, height - 18);
  });
  ctx.stroke();
}

function drawStackedBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId); if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const max = Math.max(...data.map(d => (d.positive || 0) + (d.neutral || 0) + (d.negative || 0)), 1);
  const barWidth = (width - 70) / data.length * 0.72;
  data.forEach((d, i) => {
    const x = 50 + i * ((width - 70) / data.length);
    let y = height - 36;
    [["positive", "#22c55e"], ["neutral", "#eab308"], ["negative", "#ef4444"]].forEach(([key, color]) => {
      const h = (height - 58) * (d[key] || 0) / max;
      y -= h;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, h);
    });
    ctx.save(); ctx.translate(x, height - 16); ctx.rotate(-0.45); ctx.fillStyle = currentTextColor(); ctx.fillText(String(d[options.label]).slice(0, 12), 0, 0); ctx.restore();
  });
}

function drawDonutChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId); if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const total = data.reduce((sum, d) => sum + (Number(d[options.value]) || 0), 0) || 1;
  const colors = { positive: "#22c55e", neutral: "#eab308", negative: "#ef4444" };
  let start = -Math.PI / 2;
  const cx = width / 2, cy = height / 2, r = Math.min(width, height) * 0.32;
  data.forEach(d => {
    const val = Number(d[options.value]) || 0;
    const end = start + (val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = colors[d[options.label]] || "#3b82f6";
    ctx.arc(cx, cy, r, start, end);
    ctx.fill();
    start = end;
  });
  ctx.beginPath();
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--panel-solid");
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = currentTextColor();
  ctx.textAlign = "center";
  ctx.fillText(`${total} mentions`, cx, cy + 4);
  ctx.textAlign = "left";
}

function drawEmpty(ctx, width, height) {
  ctx.fillStyle = currentTextColor();
  ctx.fillText("No data available", width / 2 - 45, height / 2);
}

function currentTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
}

function init() {
  const savedTheme = localStorage.getItem("absa-theme") || "light";
  setTheme(savedTheme);
  renderWeights();
  setupTabs();
  checkHealth();
  $("themeToggle").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  $("thresholdInput").oninput = () => { $("thresholdValue").textContent = Number($("thresholdInput").value).toFixed(2); };
  $("singleAnalyzeBtn").onclick = analyzeSingle;
  $("analyzeFileBtn").onclick = analyzeFile;
  $("clearBtn").onclick = () => {
    state.analysis = null;
    state.currentFile = null;
    $("fileInput").value = "";
    $("dashboardArea").classList.add("hidden");
    $("emptyState").classList.remove("hidden");
    clearError();
  };
}

window.addEventListener("resize", () => { if (state.analysis) renderAll(); });
document.addEventListener("DOMContentLoaded", init);
