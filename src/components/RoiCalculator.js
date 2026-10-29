import siteConfig from '../data/site-config.json';

/**
 * Validates US-11 ROI Calculator configuration
 */
function validateRoiConfig(config) {
  const { roiCalculator } = config;
  if (!roiCalculator) {
    throw new Error('US-11 Error: roiCalculator configuration is required.');
  }

  const { inputs, benchmarks } = roiCalculator;
  if (!inputs.salesReps || !inputs.monthlyLeads || !inputs.propertyPrice || !inputs.conversionRate) {
    throw new Error('US-11 Error: All 4 calculator inputs are required.');
  }
  if (!benchmarks.weeklyHoursSavedPerRep || !benchmarks.conversionUpliftPct) {
    throw new Error('US-11 Error: ROI benchmark constants are required.');
  }

  return roiCalculator;
}

/**
 * Formats currency values in Indian Lakhs/Crores or USD
 */
export function formatCurrency(amount, currency = 'INR', exchangeRate = 85.0) {
  if (currency === 'USD') {
    const usdVal = amount / exchangeRate;
    if (usdVal >= 1000000) {
      return `$${(usdVal / 1000000).toFixed(2)}M`;
    } else if (usdVal >= 1000) {
      return `$${(usdVal / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(usdVal).toLocaleString('en-US')}`;
  }

  // Indian Rupee (INR) Lakhs / Crores
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats whole integer numbers with comma separators
 */
function formatNumber(num) {
  return Math.round(num).toLocaleString('en-IN');
}

/**
 * Initializes and mounts US-11 Interactive ROI & Savings Calculator
 */
export function initRoiCalculator(mountTarget = '#roi-calculator-mount') {
  const container = typeof mountTarget === 'string'
    ? document.querySelector(mountTarget)
    : mountTarget;
  if (!container) return;

  const config = validateRoiConfig(siteConfig);

  // Initial reactive state
  const state = {
    currency: config.currencyDefaults.defaultCurrency || 'INR',
    exchangeRate: config.currencyDefaults.usdExchangeRate || 85.0,
    salesReps: config.inputs.salesReps.default,
    monthlyLeads: config.inputs.monthlyLeads.default,
    propertyPrice: config.inputs.propertyPrice.default,
    conversionRate: config.inputs.conversionRate.default
  };

  container.innerHTML = `
    <section class="roi-calculator-section" id="roi-calculator" aria-labelledby="roi-calculator-heading">
      <div class="roi-calc-container">
        
        <!-- Section Header -->
        <div class="roi-section-header">
          <span class="section-tag-pill">${config.badge}</span>
          <h2 class="section-main-heading" id="roi-calculator-heading">${config.headline}</h2>
          <p class="section-sub-copy">${config.subtext}</p>
          
          <!-- Currency Switcher -->
          <div class="roi-currency-toggle-row">
            <span class="currency-toggle-label">Currency:</span>
            <div class="currency-toggle-group" role="radiogroup" aria-label="Select calculation currency">
              <button type="button" class="btn-currency-pill is-active" data-currency="INR" aria-checked="true">
                <span>₹ INR (Lakhs & Cr)</span>
              </button>
              <button type="button" class="btn-currency-pill" data-currency="USD" aria-checked="false">
                <span>$ USD (Million)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Two-Column Interactive Layout -->
        <div class="roi-calculator-layout">
          
          <!-- Left Column: Interactive Sliders & Inputs -->
          <div class="roi-controls-card">
            <div class="controls-card-header">
              <h3 class="controls-card-title">Your Current Operations</h3>
              <p class="controls-card-desc">Adjust sliders or enter numbers matching your property sales team</p>
            </div>

            <!-- Slider 1: Sales Team Size -->
            <div class="calc-control-group" data-input-id="salesReps">
              <div class="control-label-row">
                <label for="slider-sales-reps" class="control-label">
                  ${config.inputs.salesReps.label}
                  <span class="control-info-badge" title="${config.inputs.salesReps.tooltip}">ℹ</span>
                </label>
                <div class="control-val-display">
                  <input type="number" 
                         id="input-sales-reps" 
                         class="control-num-input" 
                         min="${config.inputs.salesReps.min}" 
                         max="${config.inputs.salesReps.max}" 
                         step="${config.inputs.salesReps.step}" 
                         value="${state.salesReps}" 
                         aria-label="${config.inputs.salesReps.label}" />
                  <span class="control-unit-badge">reps</span>
                </div>
              </div>
              <input type="range" 
                     id="slider-sales-reps" 
                     class="calc-range-slider" 
                     min="${config.inputs.salesReps.min}" 
                     max="${config.inputs.salesReps.max}" 
                     step="${config.inputs.salesReps.step}" 
                     value="${state.salesReps}" 
                     aria-label="${config.inputs.salesReps.label} Slider" />
              <div class="slider-scale-row">
                <span>${config.inputs.salesReps.min} reps</span>
                <span>${config.inputs.salesReps.max} reps</span>
              </div>
            </div>

            <!-- Slider 2: Monthly Inbound Leads -->
            <div class="calc-control-group" data-input-id="monthlyLeads">
              <div class="control-label-row">
                <label for="slider-monthly-leads" class="control-label">
                  ${config.inputs.monthlyLeads.label}
                  <span class="control-info-badge" title="${config.inputs.monthlyLeads.tooltip}">ℹ</span>
                </label>
                <div class="control-val-display">
                  <input type="number" 
                         id="input-monthly-leads" 
                         class="control-num-input" 
                         min="${config.inputs.monthlyLeads.min}" 
                         max="${config.inputs.monthlyLeads.max}" 
                         step="${config.inputs.monthlyLeads.step}" 
                         value="${state.monthlyLeads}" 
                         aria-label="${config.inputs.monthlyLeads.label}" />
                  <span class="control-unit-badge">leads/mo</span>
                </div>
              </div>
              <input type="range" 
                     id="slider-monthly-leads" 
                     class="calc-range-slider" 
                     min="${config.inputs.monthlyLeads.min}" 
                     max="${config.inputs.monthlyLeads.max}" 
                     step="${config.inputs.monthlyLeads.step}" 
                     value="${state.monthlyLeads}" 
                     aria-label="${config.inputs.monthlyLeads.label} Slider" />
              <div class="slider-scale-row">
                <span>${config.inputs.monthlyLeads.min} leads</span>
                <span>${formatNumber(config.inputs.monthlyLeads.max)} leads</span>
              </div>
            </div>

            <!-- Slider 3: Average Unit / Property Price -->
            <div class="calc-control-group" data-input-id="propertyPrice">
              <div class="control-label-row">
                <label for="slider-property-price" class="control-label">
                  ${config.inputs.propertyPrice.label}
                  <span class="control-info-badge" title="${config.inputs.propertyPrice.tooltip}">ℹ</span>
                </label>
                <div class="control-val-display">
                  <span class="control-currency-val" id="text-property-price">₹85.0 Lakhs</span>
                </div>
              </div>
              <input type="range" 
                     id="slider-property-price" 
                     class="calc-range-slider" 
                     min="${config.inputs.propertyPrice.min}" 
                     max="${config.inputs.propertyPrice.max}" 
                     step="${config.inputs.propertyPrice.step}" 
                     value="${state.propertyPrice}" 
                     aria-label="${config.inputs.propertyPrice.label} Slider" />
              <div class="slider-scale-row">
                <span id="scale-min-price">₹25 Lakhs</span>
                <span id="scale-max-price">₹10 Cr</span>
              </div>
            </div>

            <!-- Slider 4: Current Conversion Rate -->
            <div class="calc-control-group" data-input-id="conversionRate">
              <div class="control-label-row">
                <label for="slider-conversion-rate" class="control-label">
                  ${config.inputs.conversionRate.label}
                  <span class="control-info-badge" title="${config.inputs.conversionRate.tooltip}">ℹ</span>
                </label>
                <div class="control-val-display">
                  <input type="number" 
                         id="input-conversion-rate" 
                         class="control-num-input" 
                         min="${config.inputs.conversionRate.min}" 
                         max="${config.inputs.conversionRate.max}" 
                         step="${config.inputs.conversionRate.step}" 
                         value="${state.conversionRate}" 
                         aria-label="${config.inputs.conversionRate.label}" />
                  <span class="control-unit-badge">%</span>
                </div>
              </div>
              <input type="range" 
                     id="slider-conversion-rate" 
                     class="calc-range-slider" 
                     min="${config.inputs.conversionRate.min}" 
                     max="${config.inputs.conversionRate.max}" 
                     step="${config.inputs.conversionRate.step}" 
                     value="${state.conversionRate}" 
                     aria-label="${config.inputs.conversionRate.label} Slider" />
              <div class="slider-scale-row">
                <span>${config.inputs.conversionRate.min}%</span>
                <span>${config.inputs.conversionRate.max}%</span>
              </div>
            </div>

          </div>

          <!-- Right Column: Real-Time Projected Outputs -->
          <div class="roi-results-card">
            
            <!-- Hero Impact Card: Additional Inventory Sold -->
            <div class="roi-hero-result-banner">
              <div class="hero-result-top">
                <span class="result-badge-live">⚡ Projected Annual Upside</span>
                <span class="result-highlight-pill" id="kpi-roi-multiple">18.8x ROI</span>
              </div>
              
              <div class="hero-result-amount" id="kpi-extra-revenue">₹42.50 Cr</div>
              <p class="hero-result-subtitle">Projected Accelerated Gross Sales Turnover</p>
              
              <div class="hero-result-metric-row">
                <div class="hero-sub-pill">
                  <span class="sub-pill-val" id="kpi-additional-units">+50</span>
                  <span class="sub-pill-lbl">Units Booked / yr</span>
                </div>
                <div class="hero-sub-pill">
                  <span class="sub-pill-val" id="kpi-conversion-boost">+28%</span>
                  <span class="sub-pill-lbl">Speed-to-Call Conversion</span>
                </div>
              </div>
            </div>

            <!-- Key Metric Breakdown Cards Grid -->
            <div class="roi-metric-cards-grid">
              
              <!-- Metric 1: Hours Reclaimed -->
              <div class="calc-metric-card">
                <div class="metric-card-icon" aria-hidden="true">⏱️</div>
                <div class="metric-card-body">
                  <span class="metric-card-label">Annual Rep Hours Reclaimed</span>
                  <div class="metric-card-val" id="kpi-hours-saved">2,625 hrs</div>
                  <p class="metric-card-hint" id="kpi-fte-equivalent">Equivalent to +1.3 full-time reps</p>
                </div>
              </div>

              <!-- Metric 2: Estimated Commission Saved -->
              <div class="calc-metric-card">
                <div class="metric-card-icon" aria-hidden="true">💰</div>
                <div class="metric-card-body">
                  <span class="metric-card-label">Commission / Margin Gained</span>
                  <div class="metric-card-val" id="kpi-commission-impact">₹85.00 Lakhs</div>
                  <p class="metric-card-hint">Modeled at 2.0% standard broker fee</p>
                </div>
              </div>

            </div>

            <!-- Before vs After Interactive Comparison Bar -->
            <div class="roi-comparison-box">
              <div class="comparison-bar-header">
                <span class="comp-title">Annual Unit Bookings Comparison</span>
                <span class="comp-ratio" id="comp-ratio-text">180 vs 230 Units</span>
              </div>
              
              <div class="comparison-track-wrap">
                <div class="comp-bar-baseline" id="comp-bar-baseline" style="width: 78%;" title="Current baseline bookings">
                  <span class="bar-tag">Baseline</span>
                </div>
                <div class="comp-bar-estateforce" id="comp-bar-estateforce" style="width: 22%;" title="EstateForce incremental bookings">
                  <span class="bar-tag">+EstateForce</span>
                </div>
              </div>
              <div class="comp-bar-legend">
                <span class="legend-item"><span class="legend-dot baseline-dot"></span> Without EstateForce</span>
                <span class="legend-item"><span class="legend-dot estateforce-dot"></span> Reclaimed with 5-min SLA</span>
              </div>
            </div>

            <!-- Conversion Call to Action -->
            <div class="roi-cta-box">
              <a href="#request-demo" class="btn-calc-demo btn-cta-demo" id="btn-roi-claim" data-area="roi-calculator">
                <span>${config.cta.buttonText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <p class="roi-disclaimer-text">${config.cta.disclaimer}</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;

  // Attach interactive controllers and recalculate
  setupCalculatorListeners(container, state, config);
}

/**
 * Controller: Handles all input changes, updates slider gradient track fills, and recalculates ROI outputs
 */
function setupCalculatorListeners(container, state, config) {
  const elements = {
    // Inputs & Sliders
    sliderSalesReps: container.querySelector('#slider-sales-reps'),
    inputSalesReps: container.querySelector('#input-sales-reps'),
    sliderMonthlyLeads: container.querySelector('#slider-monthly-leads'),
    inputMonthlyLeads: container.querySelector('#input-monthly-leads'),
    sliderPropertyPrice: container.querySelector('#slider-property-price'),
    textPropertyPrice: container.querySelector('#text-property-price'),
    scaleMinPrice: container.querySelector('#scale-min-price'),
    scaleMaxPrice: container.querySelector('#scale-max-price'),
    sliderConversionRate: container.querySelector('#slider-conversion-rate'),
    inputConversionRate: container.querySelector('#input-conversion-rate'),

    // Currency Buttons
    currencyButtons: container.querySelectorAll('.btn-currency-pill'),

    // Output Elements
    kpiRoiMultiple: container.querySelector('#kpi-roi-multiple'),
    kpiExtraRevenue: container.querySelector('#kpi-extra-revenue'),
    kpiAdditionalUnits: container.querySelector('#kpi-additional-units'),
    kpiConversionBoost: container.querySelector('#kpi-conversion-boost'),
    kpiHoursSaved: container.querySelector('#kpi-hours-saved'),
    kpiFteEquivalent: container.querySelector('#kpi-fte-equivalent'),
    kpiCommissionImpact: container.querySelector('#kpi-commission-impact'),
    compRatioText: container.querySelector('#comp-ratio-text'),
    compBarBaseline: container.querySelector('#comp-bar-baseline'),
    compBarEstateForce: container.querySelector('#comp-bar-estateforce'),
    btnRoiClaim: container.querySelector('#btn-roi-claim')
  };

  /**
   * Recalculates all values and updates DOM elements
   */
  function recalculate() {
    const benchmarks = config.benchmarks;

    // 1. Hours Reclaimed Calculation
    const annualHoursSaved = state.salesReps * benchmarks.weeklyHoursSavedPerRep * benchmarks.weeksPerYear;
    const fteEquivalent = (annualHoursSaved / (40 * benchmarks.weeksPerYear)).toFixed(1);

    // 2. Units & Bookings Calculation
    const annualLeads = state.monthlyLeads * 12;
    const baselineBookings = Math.round(annualLeads * (state.conversionRate / 100));
    const additionalBookings = Math.max(1, Math.round(baselineBookings * benchmarks.conversionUpliftPct));
    const totalBookings = baselineBookings + additionalBookings;

    // 3. Financial Impact Calculation
    const additionalRevenue = additionalBookings * state.propertyPrice;
    const commissionImpact = additionalRevenue * benchmarks.estimatedBrokerageCommissionPct;

    // 4. Software ROI Multiple
    const annualSoftwareCost = state.salesReps * benchmarks.costPerUserPerMonthInr * 12;
    const roiMultiple = (commissionImpact / annualSoftwareCost).toFixed(1);

    // 5. Update DOM Outputs
    elements.kpiExtraRevenue.textContent = formatCurrency(additionalRevenue, state.currency, state.exchangeRate);
    elements.kpiRoiMultiple.textContent = `${roiMultiple}x ROI`;
    elements.kpiAdditionalUnits.textContent = `+${additionalBookings}`;
    elements.kpiConversionBoost.textContent = `+${Math.round(benchmarks.conversionUpliftPct * 100)}%`;
    elements.kpiHoursSaved.textContent = `${formatNumber(annualHoursSaved)} hrs`;
    elements.kpiFteEquivalent.textContent = `Equivalent to +${fteEquivalent} full-time rep${fteEquivalent === '1.0' ? '' : 's'}`;
    elements.kpiCommissionImpact.textContent = formatCurrency(commissionImpact, state.currency, state.exchangeRate);

    // Update Comparison Progress Bar
    elements.compRatioText.textContent = `${formatNumber(baselineBookings)} vs ${formatNumber(totalBookings)} Units`;
    const baselinePct = Math.round((baselineBookings / totalBookings) * 100);
    const upliftPct = 100 - baselinePct;
    elements.compBarBaseline.style.width = `${baselinePct}%`;
    elements.compBarEstateForce.style.width = `${upliftPct}%`;

    // Update Currency Display on Property Price Slider
    elements.textPropertyPrice.textContent = formatCurrency(state.propertyPrice, state.currency, state.exchangeRate);
    elements.scaleMinPrice.textContent = formatCurrency(config.inputs.propertyPrice.min, state.currency, state.exchangeRate);
    elements.scaleMaxPrice.textContent = formatCurrency(config.inputs.propertyPrice.max, state.currency, state.exchangeRate);

    // Update Slider Active Fill Tracks
    updateSliderTrack(elements.sliderSalesReps);
    updateSliderTrack(elements.sliderMonthlyLeads);
    updateSliderTrack(elements.sliderPropertyPrice);
    updateSliderTrack(elements.sliderConversionRate);

    // Update Claim Button Link with URL Search Params for Pre-Filled Demo Form
    if (elements.btnRoiClaim) {
      elements.btnRoiClaim.href = `#request-demo?reps=${state.salesReps}&leads=${state.monthlyLeads}&rev=${additionalRevenue}&hours=${annualHoursSaved}`;
    }

    // Dispatch Telemetry Event
    window.dispatchEvent(new CustomEvent('estateforce:roi_calculated', {
      detail: {
        currency: state.currency,
        salesReps: state.salesReps,
        monthlyLeads: state.monthlyLeads,
        propertyPrice: state.propertyPrice,
        conversionRate: state.conversionRate,
        annualHoursSaved,
        additionalBookings,
        additionalRevenue,
        roiMultiple,
        timestamp: new Date().toISOString()
      }
    }));
  }

  /**
   * Updates CSS linear-gradient on slider thumb to visually fill track
   */
  function updateSliderTrack(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #2563EB 0%, #2563EB ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;
  }

  // --- Attach Input & Slider Listeners ---

  // 1. Sales Reps
  elements.sliderSalesReps.addEventListener('input', (e) => {
    state.salesReps = parseInt(e.target.value, 10);
    elements.inputSalesReps.value = state.salesReps;
    recalculate();
  });
  elements.inputSalesReps.addEventListener('change', (e) => {
    const val = Math.min(config.inputs.salesReps.max, Math.max(config.inputs.salesReps.min, parseInt(e.target.value, 10) || config.inputs.salesReps.min));
    state.salesReps = val;
    elements.sliderSalesReps.value = val;
    elements.inputSalesReps.value = val;
    recalculate();
  });

  // 2. Monthly Leads
  elements.sliderMonthlyLeads.addEventListener('input', (e) => {
    state.monthlyLeads = parseInt(e.target.value, 10);
    elements.inputMonthlyLeads.value = state.monthlyLeads;
    recalculate();
  });
  elements.inputMonthlyLeads.addEventListener('change', (e) => {
    const val = Math.min(config.inputs.monthlyLeads.max, Math.max(config.inputs.monthlyLeads.min, parseInt(e.target.value, 10) || config.inputs.monthlyLeads.min));
    state.monthlyLeads = val;
    elements.sliderMonthlyLeads.value = val;
    elements.inputMonthlyLeads.value = val;
    recalculate();
  });

  // 3. Property Price
  elements.sliderPropertyPrice.addEventListener('input', (e) => {
    state.propertyPrice = parseInt(e.target.value, 10);
    recalculate();
  });

  // 4. Conversion Rate
  elements.sliderConversionRate.addEventListener('input', (e) => {
    state.conversionRate = parseFloat(e.target.value);
    elements.inputConversionRate.value = state.conversionRate.toFixed(1);
    recalculate();
  });
  elements.inputConversionRate.addEventListener('change', (e) => {
    const val = Math.min(config.inputs.conversionRate.max, Math.max(config.inputs.conversionRate.min, parseFloat(e.target.value) || config.inputs.conversionRate.min));
    state.conversionRate = val;
    elements.sliderConversionRate.value = val;
    elements.inputConversionRate.value = val.toFixed(1);
    recalculate();
  });

  // Currency Toggle Listeners
  elements.currencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.currencyButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      state.currency = btn.dataset.currency;
      recalculate();
    });
  });

  // CTA Click Telemetry
  if (elements.btnRoiClaim) {
    elements.btnRoiClaim.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('estateforce:demo_click', {
        detail: {
          source: 'roi_calculator_cta',
          teamSize: state.salesReps,
          leads: state.monthlyLeads,
          price: state.propertyPrice,
          timestamp: new Date().toISOString()
        }
      }));
    });
  }

  // Initial Calculation Run
  recalculate();
}
