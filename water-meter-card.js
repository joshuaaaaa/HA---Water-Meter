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
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateDisplay();
  }

  getCardSize() {
    return 4;
  }

  render() {
    const title = this.config.title || 'Spotřeba vody';
    const k_factor = this.config.k_factor || '0.25';
    const serial = this.config.serial || 'ZC-122107';
    const meter_name = this.config.meter_name || '';
    const size = this.config.size || 'medium';
    const use_theme = this.config.use_theme !== false;

    // Calculate scale based on size
    let scale = 1;
    let cardSize = 280;

    if (typeof size === 'number') {
      cardSize = size;
      scale = size / 280;
    } else {
      switch(size) {
        case 'small':
          scale = 0.7;
          cardSize = 196;
          break;
        case 'medium':
          scale = 1;
          cardSize = 280;
          break;
        case 'large':
          scale = 1.3;
          cardSize = 364;
          break;
        case 'xlarge':
          scale = 1.6;
          cardSize = 448;
          break;
      }
    }

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
          border-radius: 16px;
          padding: 20px;
          box-shadow: ${use_theme ? 'var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1))' : '0 4px 6px rgba(0,0,0,0.1)'};
          transform: scale(${scale});
          transform-origin: top center;
        }

        .meter-title {
          font-size: 18px;
          font-weight: bold;
          color: var(--primary-text);
          margin-bottom: 16px;
        }

        .meter-face {
          position: relative;
          width: 280px;
          height: 280px;
          background: ${use_theme ? 'var(--card-background)' : 'linear-gradient(145deg, #e8e8e8, #ffffff)'};
          border-radius: 50%;
          border: 12px solid var(--primary-color);
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
          padding: 20px;
        }

        .meter-name {
          position: absolute;
          top: 35px;
          font-size: 13px;
          font-weight: bold;
          color: var(--primary-text);
          text-align: center;
        }

        .meter-top-info {
          position: absolute;
          top: 15px;
          display: flex;
          justify-content: space-between;
          width: 85%;
          font-size: 10px;
          color: var(--primary-text);
        }

        .k-factor {
          font-weight: bold;
        }

        .serial {
          font-size: 9px;
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
          border: 2px solid var(--divider-color);
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }

        .digit-container {
          display: flex;
          gap: 2px;
        }

        .digit {
          width: 24px;
          height: 32px;
          background: ${use_theme ? 'var(--card-background)' : 'white'};
          border: 1px solid var(--divider-color);
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          color: var(--primary-text);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .unit {
          margin-left: 8px;
          font-size: 16px;
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
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: ${use_theme ? 'var(--card-background)' : 'white'};
          border: 2px solid var(--secondary-text);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        .sub-dial:nth-child(1) {
          bottom: 50px;
          left: 35px;
        }

        .sub-dial:nth-child(2) {
          bottom: 38px;
          left: 85px;
        }

        .sub-dial:nth-child(3) {
          bottom: 38px;
          right: 85px;
        }

        .sub-dial:nth-child(4) {
          bottom: 50px;
          right: 35px;
        }

        .sub-dial-pointer {
          position: absolute;
          width: 2px;
          height: 18px;
          background: var(--accent-color);
          transform-origin: bottom center;
          bottom: 50%;
          left: 50%;
          margin-left: -1px;
          transition: transform 0.3s ease;
        }

        .sub-dial-value {
          font-size: 11px;
          font-weight: bold;
          color: var(--primary-text);
          z-index: 1;
        }

        .sub-dial-label {
          position: absolute;
          bottom: -16px;
          font-size: 8px;
          color: var(--accent-color);
          font-weight: bold;
          white-space: nowrap;
        }

        .sub-dial-center {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--accent-color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .specs {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 9px;
          color: var(--primary-text);
          line-height: 1.4;
        }

        .specs-right {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 9px;
          color: var(--primary-text);
          line-height: 1.4;
          text-align: right;
        }

        .iso-text {
          position: absolute;
          left: 15px;
          bottom: 70px;
          font-size: 8px;
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
                <div class="sub-dial-pointer" id="dial-0001"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.001</div>
              </div>
              <div class="sub-dial">
                <div class="sub-dial-pointer" id="dial-001"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.01</div>
              </div>
              <div class="sub-dial">
                <div class="sub-dial-pointer" id="dial-01"></div>
                <div class="sub-dial-center"></div>
                <div class="sub-dial-label">x0.1</div>
              </div>
              <div class="sub-dial">
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
    return document.createElement("water-meter-card-editor");
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
  '%c  WATER-METER-CARD  %c Version 1.0.0 ',
  'color: white; background: #4a90e2; font-weight: 700;',
  'color: #4a90e2; background: white; font-weight: 700;'
);
