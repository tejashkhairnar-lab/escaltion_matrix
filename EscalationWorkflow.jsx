import { useState } from "react";

const ROLE_OPTIONS = [
  "Relationship Manager",
  "Senior Relationship Manager",
  "Credit Risk Manager",
  "Branch Manager",
  "Regional Manager",
  "Compliance Officer",
  "Chief Risk Officer",
];

const UNIT_OPTIONS = ["Hours", "Days", "Weeks"];

const makeLevel = () => ({
  id: Date.now() + Math.random(),
  role: ROLE_OPTIONS[0],
  enabled: true,
  assign: { sla: 2, unit: "Days" },
  notify: { sla: 2, unit: "Days" },
});

const initialWorkflows = {
  "High Risk": [
    { id: 1, role: "Relationship Manager",        enabled: true,  assign: { sla: 2, unit: "Days" }, notify: { sla: 2, unit: "Days" } },
    { id: 2, role: "Senior Relationship Manager", enabled: true,  assign: { sla: 2, unit: "Days" }, notify: { sla: 3, unit: "Days" } },
    { id: 3, role: "Credit Risk Manager",         enabled: true,  assign: { sla: 3, unit: "Days" }, notify: { sla: 3, unit: "Days" } },
  ],
  "Medium Risk": [
    { id: 4, role: "Relationship Manager",        enabled: true,  assign: { sla: 3, unit: "Days" }, notify: { sla: 3, unit: "Days" } },
    { id: 5, role: "Senior Relationship Manager", enabled: false, assign: { sla: 5, unit: "Days" }, notify: { sla: 5, unit: "Days" } },
  ],
  "Low Risk": [
    { id: 6, role: "Relationship Manager", enabled: true, assign: { sla: 7, unit: "Days" }, notify: { sla: 7, unit: "Days" } },
  ],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f8;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .container {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 40px rgba(30,40,100,0.10);
    padding: 2.5rem 2.5rem 2rem;
    width: 100%;
    max-width: 800px;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.45rem;
    font-weight: 700;
    color: #1a1f5e;
    margin-bottom: 1.6rem;
    letter-spacing: -0.3px;
  }

  .tab-nav {
    display: flex;
    border-bottom: 2px solid #e8eaf6;
    margin-bottom: 1.8rem;
  }
  .tab-btn {
    background: none;
    border: none;
    padding: 0.55rem 1.2rem 0.7rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 500;
    color: #8991b0;
    cursor: pointer;
    position: relative;
    transition: color 0.18s;
  }
  .tab-btn.active { color: #2f3bb3; font-weight: 700; }
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px;
    background: #2f3bb3;
    border-radius: 2px 2px 0 0;
  }

  .section-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8991b0;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .level-card {
    border: 1.5px solid #e8eaf6;
    border-radius: 14px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .level-card:hover { box-shadow: 0 2px 18px rgba(47,59,179,0.07); }

  .level-header {
    display: flex;
    align-items: center;
    padding: 0.9rem 1.25rem;
    gap: 0.9rem;
    background: #fff;
    cursor: pointer;
    user-select: none;
  }

  .level-badge {
    background: #eef0fc;
    color: #2f3bb3;
    font-size: 0.71rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.22rem 0.75rem;
    border-radius: 20px;
    white-space: nowrap;
  }
  .level-badge.base {
    background: #fff4e6;
    color: #c87800;
  }

  .role-select {
    flex: 1;
    appearance: none;
    border: 1.5px solid #dde0f5;
    border-radius: 8px;
    padding: 0.35rem 2rem 0.35rem 0.75rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1f5e;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238991b0'/%3E%3C/svg%3E") no-repeat right 10px center;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .role-select:focus { border-color: #2f3bb3; }

  .enable-label {
    font-size: 0.78rem;
    color: #8991b0;
    font-weight: 500;
  }

  .toggle { position: relative; width: 38px; height: 22px; cursor: pointer; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-track {
    position: absolute; inset: 0;
    border-radius: 12px;
    background: #d1d5f0;
    transition: background 0.2s;
  }
  .toggle input:checked + .toggle-track { background: #f5a623; }
  .toggle-thumb {
    position: absolute;
    width: 16px; height: 16px;
    background: #fff;
    border-radius: 50%;
    top: 3px; left: 3px;
    transition: left 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    pointer-events: none;
  }
  .toggle input:checked ~ .toggle-thumb { left: 19px; }

  .chevron {
    font-size: 0.95rem;
    color: #b0b5d0;
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  .chevron.open { transform: rotate(180deg); }

  .btn-delete {
    background: none;
    border: none;
    cursor: pointer;
    color: #c5c9e8;
    font-size: 0.85rem;
    padding: 4px 6px;
    border-radius: 6px;
    line-height: 1;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }
  .btn-delete:hover { color: #e05a5a; background: #fff0f0; }

  .actions-area {
    border-top: 1.5px solid #e8eaf6;
    background: #f8f9fe;
    padding: 0.9rem 1.4rem 1rem;
  }

  .actions-col-header {
    display: grid;
    grid-template-columns: 150px 1fr 160px;
    gap: 0.75rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #8991b0;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
    padding: 0 0.1rem;
  }

  .action-row {
    display: grid;
    grid-template-columns: 150px 1fr 160px;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.55rem;
  }

  .action-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
    font-weight: 500;
    color: #1a1f5e;
  }
  .action-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-assign { background: #f5a623; }
  .dot-notify { background: #2f3bb3; }

  .sla-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .sla-input {
    width: 78px;
    border: 1.5px solid #dde0f5;
    border-radius: 7px;
    padding: 0.32rem 0.55rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: #1a1f5e;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
  }
  .sla-input:focus { border-color: #2f3bb3; }

  .unit-select {
    flex: 1;
    appearance: none;
    border: 1.5px solid #dde0f5;
    border-radius: 7px;
    padding: 0.32rem 1.8rem 0.32rem 0.55rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: #1a1f5e;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238991b0'/%3E%3C/svg%3E") no-repeat right 8px center;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .unit-select:focus { border-color: #2f3bb3; }

  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.4rem;
    padding-top: 1.2rem;
    border-top: 1.5px solid #e8eaf6;
  }
  .btn-add-level {
    background: none;
    border: 1.5px dashed #c5c9e8;
    border-radius: 9px;
    color: #8991b0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-add-level:hover { border-color: #2f3bb3; color: #2f3bb3; }

  .btn-save {
    background: #1a1f5e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    padding: 0.6rem 2.2rem;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s;
    box-shadow: 0 4px 16px rgba(26,31,94,0.18);
  }
  .btn-save:hover { background: #2f3bb3; transform: translateY(-1px); }
  .btn-save:active { transform: translateY(0); }

  .saved-toast {
    position: fixed;
    bottom: 2rem; right: 2rem;
    background: #1a1f5e;
    color: #fff;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 24px rgba(26,31,94,0.22);
    animation: fadeInUp 0.25s ease;
    z-index: 999;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}

function SLAField({ value, onChange }) {
  return (
    <div className="sla-row">
      <input
        className="sla-input"
        type="number"
        min={1}
        value={value.sla}
        onChange={e => onChange({ ...value, sla: Number(e.target.value) })}
      />
      <select
        className="unit-select"
        value={value.unit}
        onChange={e => onChange({ ...value, unit: e.target.value })}
      >
        {UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
      </select>
    </div>
  );
}

function LevelCard({ level, levelNum, isBase, takenRoles, onChange, onRemove }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="level-card">
      <div className="level-header" onClick={() => setOpen(o => !o)}>
        <span className={`level-badge${isBase ? " base" : ""}`}>
          {isBase ? "Base · Level 1" : `Level ${levelNum}`}
        </span>

        <select
          className="role-select"
          value={level.role}
          onClick={e => e.stopPropagation()}
          onChange={e => onChange({ ...level, role: e.target.value })}
        >
          {ROLE_OPTIONS.filter(r => r === level.role || !takenRoles.includes(r)).map(r => <option key={r}>{r}</option>)}
        </select>

        <span className="enable-label">Enable</span>
        <Toggle checked={level.enabled} onChange={v => onChange({ ...level, enabled: v })} />

        {!isBase && (
          <button
            className="btn-delete"
            onClick={e => { e.stopPropagation(); onRemove(); }}
            title="Remove level"
          >✕</button>
        )}

        <span className={`chevron${open ? " open" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="actions-area">
          <div className="actions-col-header">
            <span>Action</span>
            <span>SLA</span>
            <span></span>
          </div>

          <div className="action-row">
            <div className="action-label">
              <span className="action-dot dot-assign" />
              Assign
            </div>
            <SLAField value={level.assign} onChange={v => onChange({ ...level, assign: v })} />
            <span />
          </div>

          <div className="action-row">
            <div className="action-label">
              <span className="action-dot dot-notify" />
              Notify Only
            </div>
            <SLAField value={level.notify} onChange={v => onChange({ ...level, notify: v })} />
            <span />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EscalationWorkflow() {
  const [activeTab, setActiveTab] = useState("High Risk");
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [toast, setToast] = useState(false);

  const levels = workflows[activeTab] || [];

  const updateLevel = (idx, updated) =>
    setWorkflows(wf => ({ ...wf, [activeTab]: wf[activeTab].map((l, i) => i === idx ? updated : l) }));

  const removeLevel = (idx) =>
    setWorkflows(wf => ({ ...wf, [activeTab]: wf[activeTab].filter((_, i) => i !== idx) }));

  const addLevel = () =>
    setWorkflows(wf => ({ ...wf, [activeTab]: [...wf[activeTab], makeLevel()] }));

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="page-title">Configure Escalation Workflow</div>

        <div className="tab-nav">
          {Object.keys(workflows).map(tab => (
            <button
              key={tab}
              className={`tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="section-label">Actionable Workflow Type</div>

        {levels.map((level, idx) => {
          const takenRoles = levels
            .slice(0, idx)
            .filter(l => l.enabled)
            .map(l => l.role);
          return (
            <LevelCard
              key={level.id}
              level={level}
              levelNum={idx + 1}
              isBase={idx === 0}
              takenRoles={takenRoles}
              onChange={updated => updateLevel(idx, updated)}
              onRemove={() => removeLevel(idx)}
            />
          );
        })}

        <div className="bottom-bar">
          <button className="btn-add-level" onClick={addLevel}>+ Add Level</button>
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>

      {toast && <div className="saved-toast">✓ Workflow saved successfully</div>}
    </>
  );
}
