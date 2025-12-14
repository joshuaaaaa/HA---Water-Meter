class WaterMeterCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define a water sensor entity');
    }
    this.config = config;

    // Force re-render when config changes
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.updateDisplay();
  }

  getCardSize() {
    const size = this.config?.size || 'medium';

    // Return height in grid units (1 unit = 50px)
    if (typeof size === 'number') {
      // Custom pixel size - calculate grid units
      // Card height is approximately size + 100px for title and padding
      return Math.ceil((size + 100) / 50);
    }

    switch(size) {
      case 'small':
        return 5;   // ~250px (196 + 54)
      case 'medium':
        return 7;   // ~350px (280 + 70)
      case 'large':
        return 9;   // ~450px (364 + 86)
      case 'xlarge':
        return 11;  // ~550px (448 + 102)
      default:
        return 7;
    }
  }

  getGridOptions() {
    const size = this.config?.size || 'medium';

    // For sections view - each section has 12 columns
    let columns = 12;
    let rows = 2;

    switch(size) {
      case 'small':
        columns = 6;
        rows = 1;
        break;
      case 'medium':
        columns = 8;
        rows = 2;
        break;
      case 'large':
        columns = 10;
        rows = 2;
        break;
      case 'xlarge':
        columns = 12;
        rows = 3;
        break;
    }

    return {
      columns: columns,
      rows: rows,
      min_columns: Math.max(4, Math.floor(columns * 0.7)),
      max_columns: 12,
      min_rows: 1,
      max_rows: rows + 1
    };
  }

  render() {
    const title = this.config.title || 'Spotřeba vody';
    const k_factor = this.config.k_factor || '0.25';
    const serial = this.config.serial || 'ZC-122107';
    const meter_name = this.config.meter_name || '';
    const size = this.config.size || 'medium';
    const use_theme = this.config.use_theme !== false;

    // Calculate actual size in pixels
    let meterSize = 280;
    let scale = 1;

    if (typeof size === 'number') {
      meterSize = size;
      scale = size / 280;
    } else {
      switch(size) {
        case 'small':
          meterSize = 196;
          scale = 0.7;
          break;
        case 'medium':
          meterSize = 280;
          scale = 1;
          break;
        case 'large':
          meterSize = 364;
          scale = 1.3;
          break;
        case 'xlarge':
          meterSize = 448;
          scale = 1.6;
          break;
      }
    }

    // Calculate all scaled dimensions
    const borderWidth = Math.round(12 * scale);
    const fontSize = {
      title: Math.round(18 * scale),
      meterName: Math.round(13 * scale),
      topInfo: Math.round(10 * scale),
      serial: Math.round(9 * scale),
      digit: Math.round(24 * scale),
      unit: Math.round(16 * scale),
      specs: Math.round(9 * scale),
      iso: Math.round(8 * scale),
      subDialLabel: Math.round(8 * scale),
      subDialValue: Math.round(11 * scale)
    };

    const spacing = {
      containerPadding: Math.round(20 * scale),
      titleMargin: Math.round(16 * scale),
      meterPadding: Math.round(20 * scale),
      digitWidth: Math.round(24 * scale),
      digitHeight: Math.round(32 * scale),
      digitGap: Math.round(2 * scale),
      subDialSize: Math.round(45 * scale),
      pointerHeight: Math.round(18 * scale),
      centerDotSize: Math.round(6 * scale)
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          --card-background: ${use_theme ? 'var(--ha-card-background, var(--card-background-color, #ffffff))' : '#ffffff'};
          --primary-text: ${use_theme ? 'var(--primary-text-color, #333)' : '#333'};
          --secondary-text: ${use_theme ? 'var(--secondary-text-color, #666)' : '#666'};
          --primary-color: ${use_theme ? 'var(--primary-color, #4a90e2)' : '#4a90e2'};
          --accent-color: ${use_theme ? 'var(--accent-color, #e74c3c)' : '#e74c3c'};
          --divider-color: ${use_theme ? 'var(--divider-color, #ccc)' : '#ccc'};
        }

        .water-meter-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${use_theme ? 'var(--card-background)' : 'linear-gradient(145deg, #f0f0f0, #ffffff)'};
          border-radius: ${Math.round(16 * scale)}px;
          padding: ${spacing.containerPadding}px;
          box-shadow: ${use_theme ? 'var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1))' : '0 4px 6px rgba(0,0,0,0.1)'};
          width: fit-content;
          margin: 0 auto;
        }

        .meter-title {
          font-size: ${fontSize.title}px;
          font-weight: bold;
          color: var(--primary-text);
          margin-bottom: ${spacing.titleMargin}px;
        }

        .meter-face {
          position: relative;
          width: ${meterSize}px;
          height: ${meterSize}px;
          background: ${use_theme ? 'var(--card-background)' : 'linear-gradient(145deg, #e8e8e8, #ffffff)'};
          border-radius: 50%;
          border: ${borderWidth}px solid var(--primary-color);
          box-shadow:
            inset 0 2px 8px rgba(0,0,0,0.15),
            0 4px 12px ${use_theme ? 'rgba(var(--rgb-primary-color, 74, 144, 226), 0.3)' : 'rgba(74, 144, 226, 0.3)'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .meter-inner {
          width: 100%;
          height: 100%;
          background: ${use_theme ? 'var(--card-background)' : 'radial-gradient(circle, #ffffff, #f5f5f5)'};
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: ${spacing.meterPadding}px;
        }

        .meter-name {
          position: absolute;
          top: ${Math.round(35 * scale)}px;
          font-size: ${fontSize.meterName}px;
          font-weight: bold;
          color: var(--primary-text);
          text-align: center;
        }

        .meter-top-info {
          position: absolute;
          top: ${Math.round(20 * scale)}px;
          display: flex;
          justify-content: space-between;
          width: 80%;
          font-size: ${fontSize.topInfo}px;
          color: var(--primary-text);
        }

        .k-factor {
          font-weight: bold;
        }

        .serial {
          font-size: ${fontSize.serial}px;
          color: var(--secondary-text);
        }

        .main-display {
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${use_theme ? 'var(--card-background)' : 'white'};
          border: ${Math.max(1, Math.round(2 * scale))}px solid var(--divider-color);
          border-radius: ${Math.round(8 * scale)}px;
          padding: ${Math.round(8 * scale)}px ${Math.round(12 * scale)}px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }

        .digit-container {
          display: flex;
          gap: ${spacing.digitGap}px;
        }

        .digit {
          width: ${spacing.digitWidth}px;
          height: ${spacing.digitHeight}px;
          background: ${use_theme ? 'var(--card-background)' : 'white'};
          border: 1px solid var(--divider-color);
          border-radius: ${Math.round(3 * scale)}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${fontSize.digit}px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          color: var(--primary-text);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .unit {
          margin-left: ${Math.round(8 * scale)}px;
          font-size: ${fontSize.unit}px;
          color: var(--primary-text);
          font-weight: bold;
        }

        .sub-dials {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .sub-dial {
          position: absolute;
          width: ${spacing.subDialSize}px;
          height: ${spacing.subDialSize}px;
          border-radius: 50%;
          background: ${use_theme ? 'var(--card-background)' : 'white'};
          border: ${Math.max(1, Math.round(2 * scale))}px solid var(--secondary-text);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        .sub-dial:nth-child(1) {
          bottom: ${Math.round(60 * scale)}px;
          left: ${Math.round(40 * scale)}px;
        }

        .sub-dial:nth-child(2) {
          bottom: ${Math.round(48 * scale)}px;
          left: ${Math.round(90 * scale)}px;
        }

        .sub-dial:nth-child(3) {
          bottom: ${Math.round(48 * scale)}px;
          right: ${Math.round(90 * scale)}px;
        }

        .sub-dial:nth-child(4) {
          bottom: ${Math.round(60 * scale)}px;
          right: ${Math.round(40 * scale)}px;
        }

        .sub-dial-pointer {
          position: absolute;
          width: ${Math.max(1, Math.round(2 * scale))}px;
          height: ${spacing.pointerHeight}px;
          background: var(--accent-color);
          transform-origin: bottom center;
          bottom: 50%;
          left: 50%;
          margin-left: -${Math.max(1, Math.round(1 * scale))}px;
          transition: transform 0.3s ease;
        }

        .sub-dial-value {
          font-size: ${fontSize.subDialValue}px;
          font-weight: bold;
          color: var(--primary-text);
          z-index: 1;
        }

        .sub-dial-label {
          position: absolute;
          top: ${Math.round(50 * scale)}px;
          left: 50%;
          transform: translateX(-50%);
          font-size: ${fontSize.subDialLabel}px;
          color: var(--accent-color);
          font-weight: bold;
          white-space: nowrap;
        }

        .sub-dial-center {
          position: absolute;
          width: ${spacing.centerDotSize}px;
          height: ${spacing.centerDotSize}px;
          background: var(--accent-color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .sub-dial-markers {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .sub-dial-marker {
          position: absolute;
          font-size: ${Math.round(7 * scale)}px;
          color: var(--secondary-text);
          font-weight: bold;
          transform-origin: center;
        }

        .sub-dial-marker-0 { top: 8%; left: 50%; transform: translateX(-50%); }
        .sub-dial-marker-1 { top: 15%; right: 20%; }
        .sub-dial-marker-2 { top: 30%; right: 10%; }
        .sub-dial-marker-3 { top: 50%; right: 8%; transform: translateY(-50%); }
        .sub-dial-marker-4 { bottom: 30%; right: 10%; }
        .sub-dial-marker-5 { bottom: 15%; right: 20%; }
        .sub-dial-marker-6 { bottom: 8%; left: 50%; transform: translateX(-50%); }
        .sub-dial-marker-7 { bottom: 15%; left: 20%; }
        .sub-dial-marker-8 { bottom: 30%; left: 10%; }
        .sub-dial-marker-9 { top: 50%; left: 8%; transform: translateY(-50%); }

        .specs {
          position: absolute;
          left: ${Math.round(20 * scale)}px;
          top: 50%;
          transform: translateY(-50%);
          font-size: ${fontSize.specs}px;
          color: var(--primary-text);
          line-height: 1.4;
        }

        .specs-right {
          position: absolute;
          right: ${Math.round(20 * scale)}px;
          top: 50%;
          transform: translateY(-50%);
          font-size: ${fontSize.specs}px;
          color: var(--primary-text);
          line-height: 1.4;
          text-align: right;
        }

        .iso-text {
          position: absolute;
          left: ${Math.round(20 * scale)}px;
          bottom: ${Math.round(80 * scale)}px;
          font-size: ${fontSize.iso}px;
          color: var(--secondary-text);
        }
      </style>

      <div class="water-meter-container">
        <div class="meter-title">${title}</div>
        <div class="meter-face">
          <div class="meter-inner">
            <div class="meter-top-info">
              <span class="k-factor">K=${k_factor}</span>
              <span class="serial">${serial}</span>
            </div>

            ${meter_name ? `<div class="meter-name">${meter_name}</div>` : ''}

            <div class="specs">
              <div>Q₃ 2,5</div>
              <div>R80</div>
            </div>

            <div class="specs-right">
              <div>1.6MPa</div>
            </div>

            <div class="iso-text">ISO4064</div>

            <div class="main-display">
              <div class="digit-container" id="digits"></div>
              <span class="unit">m³</span>
            </div>

            <div class="sub-dials">
              <div class="sub-dial">
                <div class="sub-dial-markers">
                  <span class="sub-dial-marker sub-dial-marker-0">0</span>
                  <span class="sub-dial-marker sub-dial-marker-5">5</span>
                </div>
                <div class="sub-dial-pointer" id="dial-0001"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.001</div>
              </div>
              <div class="sub-dial">
                <div class="sub-dial-markers">
                  <span class="sub-dial-marker sub-dial-marker-0">0</span>
                  <span class="sub-dial-marker sub-dial-marker-5">5</span>
                </div>
                <div class="sub-dial-pointer" id="dial-001"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.01</div>
              </div>
              <div class="sub-dial">
                <div class="sub-dial-markers">
                  <span class="sub-dial-marker sub-dial-marker-0">0</span>
                  <span class="sub-dial-marker sub-dial-marker-5">5</span>
                </div>
                <div class="sub-dial-pointer" id="dial-01"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.1</div>
              </div>
              <div class="sub-dial">
                <div class="sub-dial-markers">
                  <span class="sub-dial-marker sub-dial-marker-0">0</span>
                  <span class="sub-dial-marker sub-dial-marker-5">5</span>
                </div>
                <div class="sub-dial-pointer" id="dial-1"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateDisplay() {
    if (!this._hass || !this.config) return;

    const entity = this._hass.states[this.config.entity];
    if (!entity) return;

    let value = parseFloat(entity.state);
    if (isNaN(value)) value = 0;

    // Update main display digits
    const digitsContainer = this.shadowRoot.getElementById('digits');
    if (digitsContainer) {
      const valueStr = value.toFixed(3);
      const parts = valueStr.split('.');
      const integerPart = parts[0].padStart(5, '0');

      digitsContainer.innerHTML = '';
      for (let i = 0; i < integerPart.length; i++) {
        const digitDiv = document.createElement('div');
        digitDiv.className = 'digit';
        digitDiv.textContent = integerPart[i];
        digitsContainer.appendChild(digitDiv);
      }
    }

    // Update sub-dials (rotating pointers)
    const decimals = value - Math.floor(value);

    // x0.001 dial (rotates 0-9)
    const dial0001 = this.shadowRoot.getElementById('dial-0001');
    if (dial0001) {
      const value0001 = (decimals * 1000) % 10;
      dial0001.style.transform = `rotate(${value0001 * 36}deg)`;
    }

    // x0.01 dial
    const dial001 = this.shadowRoot.getElementById('dial-001');
    if (dial001) {
      const value001 = (decimals * 100) % 10;
      dial001.style.transform = `rotate(${value001 * 36}deg)`;
    }

    // x0.1 dial
    const dial01 = this.shadowRoot.getElementById('dial-01');
    if (dial01) {
      const value01 = (decimals * 10) % 10;
      dial01.style.transform = `rotate(${value01 * 36}deg)`;
    }

    // x1 dial (ones position)
    const dial1 = this.shadowRoot.getElementById('dial-1');
    if (dial1) {
      const value1 = Math.floor(value) % 10;
      dial1.style.transform = `rotate(${value1 * 36}deg)`;
    }
  }

  static getConfigElement() {
    // Visual editor not implemented yet - use YAML editor
    return undefined;
  }

  static getStubConfig() {
    return {
      entity: "sensor.water_meter",
      title: "Spotřeba vody",
      meter_name: "",
      k_factor: "0.25",
      serial: "ZC-122107",
      size: "medium",
      use_theme: true
    };
  }
}

customElements.define('water-meter-card', WaterMeterCard);

// Register the card
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'water-meter-card',
  name: 'Water Meter Card',
  description: 'Custom card that displays water consumption like a real water meter',
  preview: true,
});

// Announce the card to Home Assistant
console.info(
  '%c  WATER-METER-CARD  %c Version 1.1.0 ',
  'color: white; background: #4a90e2; font-weight: 700;',
  'color: #4a90e2; background: white; font-weight: 700;'
);
