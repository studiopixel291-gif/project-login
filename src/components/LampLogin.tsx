import { useState, useRef, useEffect, FormEvent, KeyboardEvent, memo } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LampLoginProps {
  onLogin?: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export default function LampLogin({ onLogin, isLoading = false, error }: LampLoginProps) {
  const [isOn, setIsOn] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggle = () => {
    setIsOn((v) => !v);
    setSwinging(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSwinging(false), 900);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin?.({ email, password });
    }
  };

  return (
    <div style={styles.stage}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lamp-root {
          font-family: 'Inter', sans-serif;
        }

        .cord-wrap {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .cord-swing {
          transform-origin: top center;
          animation: swing 0.9s cubic-bezier(.36,.07,.19,.97);
        }

        @keyframes swing {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(9deg); }
          40%  { transform: rotate(-7deg); }
          60%  { transform: rotate(4deg); }
          80%  { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }

        .knob {
          transition: transform 0.15s ease;
        }
        .cord-wrap:active .knob {
          transform: translateY(6px);
        }

        .glow-core {
          transition: opacity 0.6s ease, filter 0.6s ease;
        }

        .cone {
          transition: opacity 0.8s ease, transform 1.1s cubic-bezier(.2,.8,.2,1);
          transform-origin: top center;
        }

        .panel {
          transition: opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(.2,.7,.2,1) 0.15s, filter 0.7s ease 0.15s;
        }

        .field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(232,163,61,0.18);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .field:focus-within {
          border-color: rgba(232,163,61,0.55);
          background: rgba(255,255,255,0.06);
        }
        .field.error {
          border-color: rgba(255,82,82,0.6);
        }
        .field input {
          background: transparent;
          border: none;
          outline: none;
          color: #f2ece1;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          width: 100%;
        }
        .field input::placeholder {
          color: #7d766c;
        }

        .signin-btn {
          background: linear-gradient(180deg, #f0b85c 0%, #d9871f 100%);
          box-shadow: 0 8px 20px -8px rgba(217,135,31,0.6);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.2s ease;
        }
        .signin-btn:hover:not(:disabled) {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }
        .signin-btn:active:not(:disabled) {
          transform: translateY(0px);
        }
        .signin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .google-btn {
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .google-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.18);
        }

        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.14em;
        }

        .hint {
          transition: opacity 0.4s ease;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .error-message {
          color: #ff5252;
          font-size: 11px;
          margin-top: 4px;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 768px) {
          .scene-row {
            flex-direction: column;
            align-items: center;
            gap: 20px !important;
          }
          .lamp-col {
            width: 100% !important;
            min-height: 300px !important;
          }
          .form-col {
            padding-top: 10px !important;
            width: 100% !important;
            max-width: 320px;
          }
        }
      `}</style>

      <div className="lamp-root" style={styles.room}>
        <div style={styles.vignette} />

        <p
          className="eyebrow hint"
          style={{
            ...styles.eyebrowText,
            opacity: isOn ? 0.35 : 0.75,
          }}
        >
          {isOn ? "PULL AGAIN TO GO DARK" : "PULL THE CORD TO SIGN IN"}
        </p>

        <div className="scene-row" style={styles.sceneRow}>
          {/* LAMP COLUMN */}
          <div className="lamp-col" style={styles.lampCol}>
            <div style={styles.fixtureWrap}>
              <div style={styles.ceilingCap} />
              <div style={styles.rod} />

              {/* SHADE */}
              <div style={styles.shadeWrap}>
                <div
                  className="glow-core"
                  style={{
                    ...styles.glowCore,
                    opacity: isOn ? 1 : 0,
                    filter: isOn ? "blur(6px)" : "blur(0px)",
                  }}
                />
                <svg width="150" height="70" viewBox="0 0 150 70" style={styles.shadeSvg}>
                  <polygon
                    points="55,0 95,0 148,66 2,66"
                    fill="#232227"
                    stroke="#3a3833"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="75" cy="66" rx="73" ry="4" fill="#141317" />
                  <ellipse
                    cx="75"
                    cy="66"
                    rx="66"
                    ry="3"
                    fill={isOn ? "#ffdf9e" : "#3a3833"}
                    style={{ transition: "fill 0.6s ease" }}
                  />
                </svg>
              </div>

              {/* PULL CORD */}
              <div
                className={"cord-wrap" + (swinging ? " cord-swing" : "")}
                onClick={toggle}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label="Toggle lamp"
                style={styles.cordWrap}
              >
                <div style={styles.cordString} />
                <div className="knob" style={styles.cordKnob} />
              </div>
            </div>

            {/* LIGHT CONE */}
            <div
              className="cone"
              style={{
                ...styles.cone,
                opacity: isOn ? 1 : 0,
                transform: isOn ? "scaleY(1)" : "scaleY(0.85)",
              }}
            />

            {/* FLOOR GLOW */}
            <div
              style={{
                ...styles.floorGlow,
                opacity: isOn ? 0.9 : 0,
                transition: "opacity 0.8s ease 0.1s",
              }}
            />
          </div>

          {/* FORM COLUMN */}
          <div className="form-col" style={styles.formCol}>
            <div
              className="panel"
              style={{
                ...styles.panel,
                opacity: isOn ? 1 : 0,
                transform: isOn ? "translateY(0px) scale(1)" : "translateY(14px) scale(0.97)",
                filter: isOn ? "blur(0px)" : "blur(2px)",
                pointerEvents: isOn ? "auto" : "none",
              }}
            >
              <h1 style={styles.heading}>Welcome back</h1>
              <p style={styles.subheading}>Sign in while the light's still on.</p>

              {error && (
                <div style={{
                  ...styles.errorBox,
                  marginBottom: 16
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={styles.fieldsWrap}>
                  <div>
                    <label className={`field${formErrors.email ? ' error' : ''}`} style={styles.field}>
                      <span className="sr-only">Email address</span>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-required="true"
                        disabled={isLoading}
                      />
                    </label>
                    {formErrors.email && (
                      <div className="error-message">{formErrors.email}</div>
                    )}
                  </div>

                  <div>
                    <label className={`field${formErrors.password ? ' error' : ''}`} style={styles.field}>
                      <span className="sr-only">Password</span>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-required="true"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        style={styles.eyeBtn}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        disabled={isLoading}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </label>
                    {formErrors.password && (
                      <div className="error-message">{formErrors.password}</div>
                    )}
                  </div>

                  <div style={styles.forgotRow}>
                    <a href="#" style={styles.forgotLink}>Forgot password?</a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="signin-btn"
                  style={styles.signinBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div style={styles.dividerRow}>
                <span style={styles.dividerLine} />
                <span style={styles.dividerText}>or</span>
                <span style={styles.dividerLine} />
              </div>

              <button className="google-btn" style={styles.googleBtn} disabled={isLoading}>
                <GoogleG />
                Continue with Google
              </button>

              <p style={styles.footerText}>
                New here? <a href="#" style={styles.footerLink}>Create an account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleG = memo(() => {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: 8, flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.9 6.1C12.3 13 17.6 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.6 7.2l7.4 5.7C43.9 37.6 46.5 31.6 46.5 24.5z"/>
      <path fill="#FBBC05" d="M10.4 19.3A14.5 14.5 0 0 0 9.6 24c0 1.6.3 3.2.8 4.7l-7.9 6.1A24 24 0 0 1 0 24c0-3.9.9-7.5 2.5-10.8l7.9 6.1z"/>
      <path fill="#34A853" d="M24 48c6.4 0 11.9-2.1 15.8-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.4 2.3-6.4 0-11.7-3.5-13.6-9.5l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
});

GoogleG.displayName = 'GoogleG';

const styles: Record<string, React.CSSProperties> = {
  stage: {
    minHeight: "100vh",
    width: "100%",
    background: "#0a0a0c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  room: {
    position: "relative",
    width: "100%",
    maxWidth: 900,
    minHeight: 560,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 20,
    background: "radial-gradient(ellipse at 30% 0%, #131114 0%, #0a0a0c 55%, #060607 100%)",
    padding: "40px 20px 30px",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
    pointerEvents: "none",
  },
  eyebrowText: {
    color: "#c9915b",
    fontSize: 11,
    marginBottom: 28,
    textAlign: "center",
  },
  sceneRow: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 48,
    width: "100%",
  },
  lampCol: {
    position: "relative",
    width: 260,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: 460,
  },
  fixtureWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 3,
  },
  ceilingCap: {
    width: 30,
    height: 8,
    background: "#232227",
    borderRadius: "3px 3px 0 0",
  },
  rod: {
    width: 3,
    height: 90,
    background: "linear-gradient(#3a3833, #232227)",
  },
  shadeWrap: {
    position: "relative",
    width: 150,
    height: 70,
  },
  glowCore: {
    position: "absolute",
    top: 20,
    left: "50%",
    width: 220,
    height: 220,
    marginLeft: -110,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,215,140,0.9) 0%, rgba(255,180,80,0.35) 35%, rgba(255,180,80,0) 70%)",
    pointerEvents: "none",
  },
  shadeSvg: {
    position: "relative",
    zIndex: 1,
  },
  cordWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: -2,
    paddingTop: 4,
    paddingBottom: 10,
  },
  cordString: {
    width: 2,
    height: 46,
    background: "#8d7a52",
  },
  cordKnob: {
    width: 10,
    height: 14,
    borderRadius: 3,
    background: "linear-gradient(#e8c98a, #b9924f)",
    marginTop: -1,
  },
  cone: {
    position: "absolute",
    top: 96,
    left: "50%",
    width: 0,
    height: 0,
    marginLeft: -140,
    borderLeft: "140px solid transparent",
    borderRight: "140px solid transparent",
    borderTop: "340px solid rgba(255, 200, 120, 0.07)",
    filter: "blur(2px)",
    zIndex: 1,
  },
  floorGlow: {
    position: "absolute",
    bottom: 30,
    left: "50%",
    width: 280,
    height: 60,
    marginLeft: -140,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse, rgba(255,190,110,0.35) 0%, rgba(255,190,110,0) 70%)",
    zIndex: 0,
  },
  formCol: {
    width: 320,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 40,
  },
  panel: {
    width: "100%",
    background: "rgba(19,18,20,0.86)",
    border: "1px solid rgba(232,163,61,0.14)",
    borderRadius: 16,
    padding: "26px 24px 22px",
    backdropFilter: "blur(6px)",
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 500,
    fontSize: 26,
    color: "#f5efe3",
    margin: 0,
  },
  subheading: {
    fontSize: 12.5,
    color: "#8b8479",
    margin: "6px 0 20px",
  },
  fieldsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  field: {
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    padding: "11px 12px",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    color: "#8b8479",
    cursor: "pointer",
    display: "flex",
    padding: 0,
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -2,
  },
  forgotLink: {
    fontSize: 11.5,
    color: "#e8a33d",
    textDecoration: "none",
  },
  signinBtn: {
    width: "100%",
    marginTop: 16,
    padding: "11px 0",
    border: "none",
    borderRadius: 10,
    color: "#1a1206",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "18px 0 14px",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    fontSize: 11,
    color: "#6b655c",
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.02)",
    color: "#e6e1d7",
    fontSize: 13.5,
    cursor: "pointer",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#8b8479",
    marginTop: 18,
    marginBottom: 0,
  },
  footerLink: {
    color: "#e8a33d",
    textDecoration: "none",
  },
  errorBox: {
    background: "rgba(255,82,82,0.1)",
    border: "1px solid rgba(255,82,82,0.3)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#ff5252",
    fontSize: 13,
  },
};
