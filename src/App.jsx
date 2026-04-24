import { useState, useEffect, useRef } from "react";

// ── STYLES ───────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0a0a0c;--bg2:#0f0f12;--bg3:#141418;--surface:#18181e;--surface2:#1e1e26;
  --border:#252530;--border2:#32323f;--text:#eeeef5;--text2:#7777a0;--text3:#3d3d55;
  --urgent:#e84040;--urgent-dim:#2a0e0e;--urgent-border:#e8404035;
  --high:#f09030;--high-dim:#2a1a06;--high-border:#f0903035;
  --normal:#3a9af0;--normal-dim:#061828;--normal-border:#3a9af035;
  --low:#44aa66;--low-dim:#061a0e;--low-border:#44aa6635;
  --str:#e85535;--cre:#f0a030;--int:#4a9af0;--per:#9a6af0;
  --gold:#f0c840;--gold-dim:#2a2008;
  --green:#2ecc71;--radius:12px;
}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
.app{max-width:480px;margin:0 auto;min-height:100vh;position:relative;}
button{font-family:'Inter',sans-serif;cursor:pointer;}

/* ── ONBOARDING ── */
.ob-wrap{min-height:100vh;display:flex;flex-direction:column;}
.ob-hero{padding:48px 24px 28px;text-align:center;}
.ob-icon{font-size:52px;margin-bottom:16px;animation:float 3s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.ob-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--text);letter-spacing:-0.5px;line-height:1.1;margin-bottom:8px;}
.ob-sub{font-size:13px;color:var(--text2);line-height:1.6;max-width:320px;margin:0 auto;}
.ob-progress{margin:0 24px 24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;}
.ob-progress-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.ob-progress-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.ob-progress-count{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--gold);}
.ob-track{height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;}
.ob-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--str),var(--cre),var(--int),var(--per));transition:width 0.4s ease;}
.ob-stat-section{margin-bottom:4px;}
.ob-stat-header{padding:10px 24px;display:flex;align-items:center;gap:10px;position:sticky;top:0;background:var(--bg);z-index:5;}
.ob-stat-icon{font-size:16px;}
.ob-stat-name{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.ob-stat-count{font-size:10px;color:var(--text3);margin-left:auto;}
.ob-quest-list{padding:0 24px;display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}
.ob-qcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 14px 14px 12px;display:flex;align-items:flex-start;gap:12px;transition:all 0.15s;cursor:pointer;position:relative;overflow:hidden;}
.ob-qcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px;}
.ob-qcard.urgent::before{background:var(--urgent);}
.ob-qcard.high::before{background:var(--high);}
.ob-qcard.normal::before{background:var(--normal);}
.ob-qcard.low::before{background:var(--low);}
.ob-qcard.selected{border-color:var(--border2);}
.ob-qcard.urgent.selected{background:var(--urgent-dim);border-color:var(--urgent-border);}
.ob-qcard.high.selected{background:var(--high-dim);border-color:var(--high-border);}
.ob-qcard.normal.selected{background:var(--normal-dim);border-color:var(--normal-border);}
.ob-qcard.low.selected{background:var(--low-dim);border-color:var(--low-border);}
.ob-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:11px;transition:all 0.15s;}
.ob-qcard.urgent.selected .ob-check{background:var(--urgent);border-color:var(--urgent);color:white;}
.ob-qcard.high.selected .ob-check{background:var(--high);border-color:var(--high);color:white;}
.ob-qcard.normal.selected .ob-check{background:var(--normal);border-color:var(--normal);color:white;}
.ob-qcard.low.selected .ob-check{background:var(--low);border-color:var(--low);color:white;}
.ob-qinfo{flex:1;min-width:0;}
.ob-qtags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px;}
.ob-qtag{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:4px;}
.ob-qtype-boss{background:#f0c84015;color:var(--gold);border:1px solid #f0c84030;}
.ob-qtype-main{border:1px solid currentColor;background:transparent;}
.ob-qtype-side{background:var(--bg3);color:var(--text3);border:1px solid var(--border);}
.ob-qprio{font-family:'Syne',sans-serif;font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:4px;}
.ob-qprio.urgent{background:var(--urgent-dim);color:var(--urgent);border:1px solid var(--urgent-border);}
.ob-qprio.high{background:var(--high-dim);color:var(--high);border:1px solid var(--high-border);}
.ob-qprio.normal{background:var(--normal-dim);color:var(--normal);border:1px solid var(--normal-border);}
.ob-qprio.low{background:var(--low-dim);color:var(--low);border:1px solid var(--low-border);}
.ob-qtitle{font-size:13px;font-weight:500;color:var(--text);line-height:1.4;margin-bottom:2px;}
.ob-qdesc{font-size:11px;color:var(--text2);line-height:1.4;}
.ob-qxp{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:var(--gold);flex-shrink:0;margin-top:1px;}
.ob-footer{position:sticky;bottom:0;background:var(--bg);border-top:1px solid var(--border);padding:16px 24px 28px;}
.ob-confirm-btn{width:100%;padding:15px;background:var(--gold);border:none;color:var(--bg);font-family:'Syne',sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;border-radius:10px;transition:opacity 0.2s;}
.ob-confirm-btn:hover{opacity:0.88;}
.ob-confirm-btn:disabled{opacity:0.3;cursor:not-allowed;}
.ob-confirm-hint{font-size:11px;color:var(--text3);text-align:center;margin-top:8px;}

/* ── MAIN APP ── */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--bg2);border-top:1px solid var(--border);display:flex;z-index:50;padding-bottom:env(safe-area-inset-bottom);}
.nav-btn{flex:1;padding:11px 4px 13px;background:none;border:none;font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);transition:color 0.2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
.nav-btn.active{color:var(--text);}
.nav-icon{font-size:16px;}
.page{padding-bottom:80px;min-height:100vh;}

/* PROFILE */
.profile-header{padding:40px 20px 16px;display:grid;grid-template-columns:60px minmax(0,1fr);align-items:center;column-gap:16px;}
.avatar{width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,var(--cre),var(--str));display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:white;flex-shrink:0;position:relative;}
.avatar-ring{position:absolute;inset:-2px;border-radius:16px;border:2px solid var(--cre);opacity:0.4;}
.profile-info{display:flex;flex-direction:column;justify-content:center;min-width:0;}
.profile-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;line-height:1;}
.profile-role{font-size:11px;color:var(--text2);margin-top:3px;letter-spacing:0.5px;}
.profile-streak{display:flex;align-items:center;gap:5px;margin-top:6px;justify-self:start;}
.streak-text{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--str);}

/* COMBINED XP */
.cxp-card{margin:0 20px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;}
.cxp-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
.cxp-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.cxp-pct{font-family:'Syne',sans-serif;font-size:12px;font-weight:800;color:var(--gold);}
.cxp-track{height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;margin-bottom:6px;position:relative;}
.cxp-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--str),var(--cre),var(--int),var(--per));transition:width 0.8s cubic-bezier(0.4,0,0.2,1);}
.cxp-bottom{display:flex;justify-content:space-between;}
.cxp-nums{font-size:10px;color:var(--text3);}
.cxp-quests{font-size:10px;color:var(--text3);}
.level-timer-card{margin:0 20px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px;}
.level-timer-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;}
.level-timer-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.level-timer-deadline{font-size:11px;color:var(--text2);margin-top:4px;line-height:1.4;}
.level-timer-clock{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--gold);text-align:right;line-height:1;}
.level-timer-meta{display:flex;justify-content:space-between;gap:12px;font-size:10px;color:var(--text3);}
.level-timer-status{color:var(--text2);}
.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 20px 16px;}
.quick-action-btn{padding:12px 10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:all 0.15s;}
.quick-action-btn:hover{border-color:var(--border2);}

/* STAT MINIS */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 20px 16px;}
.stat-mini{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 8px;text-align:center;cursor:pointer;transition:all 0.15s;}
.stat-mini:hover{border-color:var(--border2);}
.stat-mini-icon{font-size:16px;margin-bottom:3px;}
.stat-mini-lv{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;margin-bottom:4px;}
.stat-mini-bar{height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;}
.stat-mini-fill{height:100%;border-radius:2px;transition:width 0.6s ease;}

/* ORACLE */
.oracle-card{margin:0 20px 16px;background:var(--surface);border-left:3px solid var(--gold);border-radius:0 10px 10px 0;padding:12px 14px;}
.oracle-dot{display:flex;align-items:center;gap:6px;margin-bottom:5px;}
.oracle-pip{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
.oracle-lbl{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:0.7;}
.oracle-text{font-size:12px;color:var(--text2);line-height:1.5;font-style:italic;}

/* SECTION HEADER */
.sh{padding:0 20px 10px;display:flex;align-items:center;justify-content:space-between;}
.sh-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.sh-action{font-size:10px;color:var(--text3);font-family:'Syne',sans-serif;font-weight:700;background:none;border:none;letter-spacing:1px;text-transform:uppercase;transition:color 0.2s;padding:0;}
.sh-action:hover{color:var(--text2);}

/* QUEST LIST */
.ql{padding:0 20px;display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}

/* QUEST CARD */
.qcard{border-radius:var(--radius);padding:13px 14px;transition:all 0.15s;position:relative;overflow:hidden;}
.qcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;}
.qcard.urgent{background:var(--urgent-dim);border:1px solid var(--urgent-border);}
.qcard.urgent::before{background:var(--urgent);}
.qcard.high{background:var(--high-dim);border:1px solid var(--high-border);}
.qcard.high::before{background:var(--high);}
.qcard.normal{background:var(--normal-dim);border:1px solid var(--normal-border);}
.qcard.normal::before{background:var(--normal);}
.qcard.low{background:var(--low-dim);border:1px solid var(--low-border);}
.qcard.low::before{background:var(--low);}
.qcard.done{opacity:0.3;filter:grayscale(0.5);}
.qcard-top{display:flex;align-items:flex-start;gap:10px;}
.qcheck{width:20px;height:20px;border-radius:50%;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:10px;transition:all 0.2s;}
.qcheck:hover{border-color:var(--green);}
.qcheck.checked{background:var(--green);border-color:var(--green);color:white;}
.qbody{flex:1;min-width:0;}
.qtags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:5px;align-items:center;}
.qtag{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;}
.qtag-boss{background:#f0c84015;color:var(--gold);border:1px solid #f0c84030;}
.qtag-main{border:1px solid currentColor;background:transparent;}
.qtag-side{background:rgba(255,255,255,0.04);color:var(--text3);border:1px solid var(--border);}
.qstat-tag{font-family:'Syne',sans-serif;font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;border:1px solid transparent;}
.qprio-tag{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;}
.prio-urgent{background:var(--urgent-dim);color:var(--urgent);border:1px solid var(--urgent-border);}
.prio-high{background:var(--high-dim);color:var(--high);border:1px solid var(--high-border);}
.prio-normal{background:var(--normal-dim);color:var(--normal);border:1px solid var(--normal-border);}
.prio-low{background:var(--low-dim);color:var(--low);border:1px solid var(--low-border);}
.qtitle{font-size:13px;font-weight:500;color:var(--text);line-height:1.4;margin-bottom:2px;}
.qdesc{font-size:11px;color:var(--text2);line-height:1.4;}
.qcard.done .qtitle{text-decoration:line-through;}
.qmeta{display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.04);}
.qdeadline{font-size:10px;font-weight:500;}
.dl-ok{color:var(--text3);}
.dl-warn{color:var(--high);}
.dl-urgent{color:var(--urgent);}
.dl-over{color:var(--urgent);font-weight:700;}
.qright{display:flex;align-items:center;gap:8px;}
.qxp{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:var(--gold);}
.qedit-btn{background:none;border:none;color:var(--text3);font-size:13px;padding:2px 4px;border-radius:4px;transition:color 0.15s;line-height:1;}
.qedit-btn:hover{color:var(--text2);}
.qaction-col{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
.qmini-btn{background:none;border:1px solid var(--border);color:var(--text3);font-size:11px;padding:3px 6px;border-radius:6px;transition:all 0.15s;line-height:1;}
.qmini-btn:hover{color:var(--text);border-color:var(--border2);}
.qmini-btn.delete:hover{color:var(--urgent);border-color:var(--urgent-border);}
.qmini-btn.undo:hover{color:var(--gold);border-color:#f0c84035;}

/* EDIT PANEL */
.edit-panel{background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-top:10px;}
.ep-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;}
.ep-row{margin-bottom:8px;}
.ep-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:4px;}
.ep-input,.ep-select,.ep-textarea{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:8px 10px;font-family:'Inter',sans-serif;font-size:13px;border-radius:7px;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
.ep-input:focus,.ep-select:focus,.ep-textarea:focus{border-color:var(--border2);}
.ep-textarea{min-height:56px;resize:none;line-height:1.5;}
.ep-select option{background:var(--bg2);}
.ep-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.ep-actions{display:flex;gap:6px;margin-top:10px;}
.ep-save{flex:1;padding:9px;background:var(--text);border:none;color:var(--bg);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:7px;transition:opacity 0.2s;}
.ep-save:hover{opacity:0.85;}
.ep-save:disabled{opacity:0.35;cursor:not-allowed;}
.ep-cancel{padding:9px 14px;background:none;border:1px solid var(--border);color:var(--text3);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:7px;}
.ai-suggestion{background:var(--gold-dim);border:1px solid #f0c84025;border-radius:8px;padding:12px;margin-top:10px;}
.ai-sug-label{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:0.8;margin-bottom:6px;}
.ai-sug-title{font-size:12px;font-weight:600;color:var(--text);margin-bottom:3px;}
.ai-sug-desc{font-size:11px;color:var(--text2);line-height:1.4;margin-bottom:8px;}
.ai-sug-add{width:100%;padding:8px;background:none;border:1px dashed #f0c84040;color:var(--gold);font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:6px;transition:all 0.15s;}
.ai-sug-add:hover{background:#f0c84010;border-color:var(--gold);}

/* STAT GROUP (quest board) */
.stat-group{margin-bottom:8px;}
.stat-group-header{padding:8px 20px;display:flex;align-items:center;gap:8px;background:var(--bg);}
.stat-group-icon{font-size:14px;}
.stat-group-name{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.stat-group-count{font-size:10px;color:var(--text3);margin-left:auto;}
.stat-group-bar{margin:0 20px 10px;height:2px;background:var(--bg3);border-radius:1px;overflow:hidden;}
.stat-group-bar-fill{height:100%;border-radius:1px;transition:width 0.6s ease;}

/* STAT PAGE */
.sph{padding:40px 20px 16px;}
.sph-top{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.sph-icon-big{font-size:32px;}
.sph-name{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;}
.sph-lv{font-size:12px;color:var(--text2);margin-top:2px;}
.sph-xp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;margin-bottom:14px;}
.sph-xp-top{display:flex;justify-content:space-between;margin-bottom:8px;}
.sph-xp-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.sph-xp-val{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;}
.sph-track{height:7px;background:var(--bg3);border-radius:4px;overflow:hidden;}
.sph-fill{height:100%;border-radius:4px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);}
.sph-quest-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
.sph-qs-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;}
.sph-qs-num{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;line-height:1;margin-bottom:3px;}
.sph-qs-label{font-family:'Syne',sans-serif;font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--text3);}

/* AI GEN BTN */
.ai-gen-btn{display:block;width:calc(100% - 40px);margin:0 20px 14px;padding:13px;background:var(--surface2);border:1px solid var(--border2);color:var(--text2);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-radius:10px;transition:all 0.2s;}
.ai-gen-btn:hover{border-color:var(--gold);color:var(--gold);}
.ai-gen-btn:disabled{opacity:0.35;cursor:not-allowed;}

/* ADD FORM */
.add-form{margin:0 20px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;}
.add-form-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;}

/* TOAST */
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-120px);background:var(--surface2);border:1px solid var(--border2);padding:12px 20px;border-radius:12px;z-index:200;text-align:center;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275);max-width:90vw;box-shadow:0 8px 40px rgba(0,0,0,0.6);min-width:180px;}
.toast.show{transform:translateX(-50%) translateY(0);}
.toast-e{font-size:22px;margin-bottom:4px;}
.toast-m{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--text);}
.toast-xp{font-size:11px;color:var(--gold);margin-top:3px;}

/* PENALTY */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;}
.penalty-box{background:var(--bg2);border:1px solid var(--urgent-border);border-radius:16px;padding:28px;width:100%;max-width:360px;text-align:center;}
.penalty-icon{font-size:44px;margin-bottom:12px;}
.penalty-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--urgent);margin-bottom:8px;}
.penalty-desc{font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:6px;}
.penalty-quest{font-size:13px;font-weight:600;color:var(--text);margin-bottom:16px;}
.penalty-xp{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--urgent);margin-bottom:16px;}
.penalty-why-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;text-align:left;}
.penalty-input{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:10px 12px;font-family:'Inter',sans-serif;font-size:13px;border-radius:8px;outline:none;margin-bottom:14px;}
.penalty-textarea{width:100%;min-height:86px;resize:none;line-height:1.5;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:10px 12px;font-family:'Inter',sans-serif;font-size:13px;border-radius:8px;outline:none;margin-bottom:14px;}
.penalty-btn{width:100%;padding:13px;background:var(--urgent);border:none;color:white;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-radius:8px;transition:opacity 0.2s;}
.penalty-btn:disabled{opacity:0.4;cursor:not-allowed;}
.penalty-sub{font-size:11px;color:var(--text3);line-height:1.6;margin:-8px 0 14px;text-align:left;}
.confirm-box{background:var(--bg2);border:1px solid var(--border2);border-radius:16px;padding:28px;width:100%;max-width:360px;text-align:center;}
.confirm-icon{font-size:40px;margin-bottom:12px;}
.confirm-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text);margin-bottom:8px;}
.confirm-desc{font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:8px;}
.confirm-quest{font-size:13px;font-weight:600;color:var(--text);margin-bottom:18px;}
.confirm-actions{display:flex;gap:8px;}
.confirm-cancel,.confirm-accept{flex:1;padding:13px;border-radius:8px;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
.confirm-cancel{background:none;border:1px solid var(--border);color:var(--text3);}
.confirm-accept{background:var(--green);border:none;color:white;}

/* LEVEL UP */
.levelup{position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:300;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;}
.lu-icon{font-size:60px;animation:scaleIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275);}
.lu-title{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:var(--gold);animation:scaleIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275);}
.lu-sub{font-size:14px;color:var(--text2);font-family:'Syne',sans-serif;letter-spacing:1px;}
.lu-btn{margin-top:24px;padding:14px 36px;background:var(--gold);border:none;color:var(--bg);font-family:'Syne',sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;border-radius:8px;}
@keyframes scaleIn{from{transform:scale(0.4);opacity:0;}to{transform:scale(1);opacity:1;}}

/* DOTS */
.dots{display:flex;gap:4px;align-items:center;justify-content:center;padding:4px 0;}
.dot{width:4px;height:4px;border-radius:50%;background:var(--text3);animation:bounce 1.2s infinite;}
.dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.3;}30%{transform:translateY(-5px);opacity:1;}}

.empty{text-align:center;padding:24px 20px;color:var(--text3);font-size:12px;font-style:italic;}
.divider{height:1px;background:var(--border);margin:4px 20px 12px;}
`;

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const STAT_CFG = {
  strength: { label: "Strength", icon: "⚔️", color: "var(--str)", lv_titles: ["Rookie", "Trainee", "Athlete", "Warrior", "Champion", "Beast"] },
  creativity: { label: "Creativity", icon: "🎨", color: "var(--cre)", lv_titles: ["Sketcher", "Maker", "Craftsman", "Artist", "Visionary", "Auteur"] },
  intelligence: { label: "Intelligence", icon: "🧠", color: "var(--int)", lv_titles: ["Curious", "Student", "Scholar", "Thinker", "Sage", "Oracle"] },
  persona: { label: "Persona", icon: "🪞", color: "var(--per)", lv_titles: ["Shy", "Aware", "Confident", "Magnetic", "Commanding", "Legend"] },
};
const STATS = ["strength", "creativity", "intelligence", "persona"];
const XP_PER_LEVEL = 300;
const TOTAL_LV1_XP = XP_PER_LEVEL * 4;
const DAY_MS = 1000 * 60 * 60 * 24;
const APP_TODAY = "2026-04-24";
const LEVEL_1_DEFAULT_DEADLINE = "2026-04-29T23:59:59";
const PRIO_ORDER = { urgent: 0, high: 1, normal: 2, low: 3 };
const PRIO_COLOR = { urgent: "var(--urgent)", high: "var(--high)", normal: "var(--normal)", low: "var(--low)" };
const REWARDS = [
  { e: "🔥", m: "On fire." }, { e: "⚡", m: "Crushed." }, { e: "💎", m: "Rare discipline." },
  { e: "🏆", m: "Victory." }, { e: "👑", m: "King behavior." }, { e: "🎯", m: "Locked in." },
  { e: "🚀", m: "Momentum." }, { e: "⚡", m: "Level up energy." },
];
const ORACLES = [
  "Every frame of Sukoon is built today, not on shoot day.",
  "5 assignments. The clock doesn't care how you feel.",
  "Made by Gods. Act like it.",
  "The version of you 6 months from now is built right now.",
  "Discipline is doing the thing when you don't feel like it.",
  "Your streak is a promise to yourself. Keep it.",
  "One quest at a time. Highest priority first. Always.",
];
const LEVEL_PUNISHMENTS = {
  strength: { title: "Punishment Trial — 100 Push-ups", desc: "Break it into sets if needed, but finish all 100 with strict form before the day ends." },
  creativity: { title: "Punishment Trial — 12 Shot Frames", desc: "Storyboard 12 clean frames for Sukoon or Rosaye. No vague ideas, only executable shots." },
  intelligence: { title: "Punishment Trial — 90 Minute Deep Work Lock", desc: "Phone away. Finish one hard academic block in a single uninterrupted sitting and write the result." },
  persona: { title: "Punishment Trial — 25 Minutes Voice Practice", desc: "Do one English voice session plus 10 minutes of shadowing. Record it and listen back once." },
};

const DAY_WORKOUTS = { 0: "Rest Day", 1: "Chest & Bicep (Push)", 2: "Legs & Shoulders", 3: "Back & Tricep (Pull)", 4: "Chest & Bicep (Push)", 5: "Legs & Shoulders", 6: "Back & Tricep (Pull)" };
const todayWorkout = DAY_WORKOUTS[new Date().getDay()];

// ── ALL LEVEL 1 QUESTS POOL ──────────────────────────────────────────────────
const QUEST_POOL = [
  // STRENGTH
  { id: "s1", stat: "strength", type: "boss", priority: "urgent", title: `Complete ${todayWorkout} session`, desc: "Full session. Track every set and rep. No skipping, no shortcuts.", xp: 80, deadline: "" },
  { id: "s2", stat: "strength", type: "main", priority: "high", title: "Progressive overload — Bench Press", desc: "Last session: 67.5kg × 8. Target today: 70kg × 6 reps.", xp: 50, deadline: "" },
  { id: "s3", stat: "strength", type: "main", priority: "normal", title: "Track full workout in detail", desc: "Log every exercise: sets, reps, weight. Build the data for next session.", xp: 35, deadline: "" },
  { id: "s4", stat: "strength", type: "side", priority: "normal", title: "Morning mobility — 10 minutes", desc: "Hip flexors, thoracic spine, shoulders. Before the session, not after.", xp: 15, deadline: "" },
  { id: "s5", stat: "strength", type: "side", priority: "low", title: "Plan next week's split", desc: "Write out Monday–Saturday workout plan so there's no guessing.", xp: 15, deadline: "" },
  // CREATIVITY
  { id: "c1", stat: "creativity", type: "boss", priority: "urgent", title: "Complete the Sukoon shoot", desc: "April 25. Every shot on the list. Don't leave the location without all footage.", xp: 120, deadline: "2026-04-25" },
  { id: "c2", stat: "creativity", type: "main", priority: "urgent", title: "Finalize Sukoon shot list", desc: "Every scene, lens choice, camera movement. Done before the shoot day.", xp: 60, deadline: "2026-04-24" },
  { id: "c3", stat: "creativity", type: "main", priority: "high", title: "Gear check for Sukoon shoot", desc: "Camera, lenses, audio, batteries, cards. All ready the night before.", xp: 40, deadline: "2026-04-24" },
  { id: "c4", stat: "creativity", type: "main", priority: "high", title: "Post-production plan for Sukoon", desc: "Map the edit timeline: rough cut, color, sound, delivery date.", xp: 45, deadline: "2026-04-30" },
  { id: "c5", stat: "creativity", type: "main", priority: "normal", title: "Begin Sukoon rough cut", desc: "Import footage, organize bins, lay the first assembly edit.", xp: 55, deadline: "2026-05-02" },
  { id: "c6", stat: "creativity", type: "side", priority: "normal", title: "Rosaye — one content idea", desc: "One reel concept or visual direction for the agency's Instagram.", xp: 20, deadline: "" },
  // INTELLIGENCE
  { id: "i1", stat: "intelligence", type: "boss", priority: "urgent", title: "Submit all 5 assignments by April 27", desc: "OOP, OS, ADA, COA and the 5th subject. All submitted before deadline.", xp: 120, deadline: "2026-04-27" },
  { id: "i2", stat: "intelligence", type: "main", priority: "urgent", title: "Complete OOP assignment", desc: "Start and finish in one session. Submit today.", xp: 55, deadline: "2026-04-26" },
  { id: "i3", stat: "intelligence", type: "main", priority: "urgent", title: "Complete OS assignment", desc: "One session. No multitasking. Submit.", xp: 50, deadline: "2026-04-26" },
  { id: "i4", stat: "intelligence", type: "main", priority: "urgent", title: "Complete ADA assignment", desc: "Algorithm Design & Analysis. Focus, finish, submit.", xp: 50, deadline: "2026-04-27" },
  { id: "i5", stat: "intelligence", type: "main", priority: "urgent", title: "Complete COA assignment", desc: "Computer Organization & Architecture. Done before the exam.", xp: 50, deadline: "2026-04-27" },
  { id: "i6", stat: "intelligence", type: "boss", priority: "urgent", title: "COA exam preparation", desc: "Revise all units. Focus on weak areas. Exam April 29.", xp: 90, deadline: "2026-04-28" },
  { id: "i7", stat: "intelligence", type: "side", priority: "normal", title: "OS chapter summary", desc: "Summarize one chapter in 5 bullet points. 30 minutes, no phone.", xp: 20, deadline: "2026-04-27" },
  // PERSONA
  { id: "p1", stat: "persona", type: "boss", priority: "high", title: "7-day English Discord streak", desc: "Talk to real people in English every single day for 7 days. Initiate at least one conversation each day.", xp: 100, deadline: "" },
  { id: "p2", stat: "persona", type: "main", priority: "high", title: "Discord English session — today", desc: "20 minutes minimum. Join a voice channel or send 10+ messages. You initiate.", xp: 40, deadline: "" },
  { id: "p3", stat: "persona", type: "main", priority: "normal", title: "Practice 70/30 listening rule", desc: "In any real conversation today — listen more than you speak. Notice the difference.", xp: 35, deadline: "" },
  { id: "p4", stat: "persona", type: "main", priority: "normal", title: "Initiate a conversation with a stranger", desc: "Could be anyone. You start it. Make it natural, not forced.", xp: 40, deadline: "" },
  { id: "p5", stat: "persona", type: "side", priority: "normal", title: "Steve Jobs speech shadowing — 10 min", desc: "Focus on pace, deliberate pausing, and presence. Record yourself and listen back.", xp: 20, deadline: "" },
  { id: "p6", stat: "persona", type: "side", priority: "low", title: "Morning mirror drill — 5 minutes", desc: "Speak confidently to yourself. Posture, eye contact, tone. Uncomfortable on purpose.", xp: 15, deadline: "" },
];

function getLvInfo(xp) {
  const level = Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, 10);
  const progress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  return { level, progress, current: xp % XP_PER_LEVEL, needed: XP_PER_LEVEL };
}
function getLvTitle(stat, level) {
  const t = STAT_CFG[stat].lv_titles;
  return t[Math.min(level - 1, t.length - 1)];
}
function sortQ(quests) {
  const to = { boss: 0, main: 1, side: 2 };
  return [...quests].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const tp = to[a.type] - to[b.type];
    if (tp !== 0) return tp;
    return PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority];
  });
}
function normalizeDateInput(dateStr) {
  if (!dateStr) return null;
  return dateStr.startsWith("2025-") ? dateStr.replace("2025-", "2026-") : dateStr;
}
function dateOnly(dateLike) {
  const d = new Date(dateLike);
  d.setHours(0, 0, 0, 0);
  return d;
}
function formatDate(dateLike) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateLike));
}
function toDateInput(dateLike) {
  return new Date(dateLike).toISOString().slice(0, 10);
}
function addDays(dateLike, days) {
  const d = new Date(dateLike);
  d.setDate(d.getDate() + days);
  return d;
}
function daysUntil(dateStr, base = new Date()) {
  if (!dateStr) return null;
  const target = dateOnly(`${normalizeDateInput(dateStr)}T00:00:00`);
  const today = dateOnly(base);
  return Math.round((target - today) / DAY_MS);
}
function formatCountdown(deadline, nowMs) {
  const diff = new Date(deadline).getTime() - nowMs;
  if (diff <= 0) return { expired: true, clock: "00:00:00", status: "Time expired" };
  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return {
    expired: false,
    clock: `${days > 0 ? `${days}d ` : ""}${hh}:${mm}:${ss}`,
    status: days > 0 ? `${days} day${days !== 1 ? "s" : ""} left` : "Final day",
  };
}
function getLevelPunishment(statXP, deadline) {
  const weakest = STATS.reduce((lowest, stat) => statXP[stat] < statXP[lowest] ? stat : lowest, STATS[0]);
  const cfg = LEVEL_PUNISHMENTS[weakest];
  return {
    id: `punishment_${Date.now()}`,
    stat: weakest,
    type: "boss",
    priority: "urgent",
    xp: 0,
    done: false,
    deadline: toDateInput(addDays(deadline, 1)),
    title: cfg.title,
    desc: cfg.desc,
    isPenalty: true,
  };
}
function sanitizeState(raw) {
  if (!raw) return null;
  const hadLegacyDates = Array.isArray(raw.quests) && raw.quests.some(q => typeof q.deadline === "string" && q.deadline.startsWith("2025-"));
  const quests = Array.isArray(raw.quests) ? raw.quests.map(q => ({
    ...q,
    deadline: normalizeDateInput(q.deadline || ""),
  })) : [];
  const statXP = {
    strength: Number(raw.statXP?.strength) || 0,
    creativity: Number(raw.statXP?.creativity) || 0,
    intelligence: Number(raw.statXP?.intelligence) || 0,
    persona: Number(raw.statXP?.persona) || 0,
  };
  const totalDone = quests.filter(q => q.done).length;
  const totalXP = Object.values(statXP).reduce((sum, xp) => sum + xp, 0);
  return {
    quests,
    statXP,
    streak: hadLegacyDates || totalDone === 0 || totalXP === 0 ? 0 : Math.min(Number(raw.streak) || 0, totalDone),
    levelDeadline: raw.levelDeadline?.startsWith?.("2025-") ? LEVEL_1_DEFAULT_DEADLINE : (raw.levelDeadline || LEVEL_1_DEFAULT_DEADLINE),
  };
}
function dlLabel(q) {
  const d = daysUntil(q.deadline);
  if (d === null) return null;
  if (d < 0) return { text: `${Math.abs(d)}d overdue`, cls: "dl-over" };
  if (d === 0) return { text: "Due today", cls: "dl-urgent" };
  if (d === 1) return { text: "Due tomorrow", cls: "dl-urgent" };
  if (d <= 3) return { text: `${d}d left`, cls: "dl-warn" };
  return { text: `${d}d left`, cls: "dl-ok" };
}

// ── STORAGE HELPERS ──────────────────────────────────────────────────────────
const LS_KEY = "liferpg_v4_reset_1";
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return sanitizeState(JSON.parse(raw));
  } catch (e) { }
  return null;
}
function saveState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { }
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function LifeRPG() {
  const saved = useRef(loadState());
  const isNew = !saved.current;
  const seededNow = useRef(Date.now()).current;

  // ONBOARDING STATE
  const [onboarding, setOnboarding] = useState(isNew);
  const [selectedIds, setSelectedIds] = useState(() =>
    isNew ? new Set(QUEST_POOL.map(q => q.id)) : new Set()
  );

  // MAIN APP STATE — restored from localStorage or zero
  const [quests, setQuests] = useState(() => saved.current?.quests || []);
  const [statXP, setStatXP] = useState(() => saved.current?.statXP || { strength: 0, creativity: 0, intelligence: 0, persona: 0 });
  const [streak, setStreak] = useState(() => saved.current?.streak || 0);
  const [levelDeadline, setLevelDeadline] = useState(() => saved.current?.levelDeadline || LEVEL_1_DEFAULT_DEADLINE);
  const [page, setPage] = useState("home");
  const [activeStat, setActiveStat] = useState(null);
  const [toast, setToast] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const [penaltyWhy, setPenaltyWhy] = useState("");
  const [levelPenalty, setLevelPenalty] = useState(null);
  const [levelPenaltyWhy, setLevelPenaltyWhy] = useState("");
  const [pendingComplete, setPendingComplete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState({ title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "" });
  const [showBoardAdd, setShowBoardAdd] = useState(false);
  const [boardQ, setBoardQ] = useState({ stat: "strength", title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "" });
  const [nowMs, setNowMs] = useState(seededNow);
  const oracle = useRef(ORACLES[Math.floor(Math.random() * ORACLES.length)]).current;

  // PERSIST on every change
  useEffect(() => {
    if (!onboarding) saveState({ quests, statXP, streak, levelDeadline });
  }, [quests, statXP, streak, onboarding, levelDeadline]);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // OVERDUE check on mount
  useEffect(() => {
    if (onboarding || penalty || levelPenalty) return;
    const overdue = quests.find(q => !q.done && q.deadline && daysUntil(q.deadline) < 0);
    if (overdue) setPenalty(overdue);
  }, [onboarding, quests, penalty, levelPenalty]);

  // ── ONBOARDING ────────────────────────────────────────────────────────────
  function toggleSelect(id) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function confirmQuests() {
    const chosen = QUEST_POOL.filter(q => selectedIds.has(q.id));
    setQuests(chosen);
    setStatXP({ strength: 0, creativity: 0, intelligence: 0, persona: 0 });
    setStreak(0);
    setLevelDeadline(LEVEL_1_DEFAULT_DEADLINE);
    setOnboarding(false);
  }

  // ── QUEST ACTIONS ────────────────────────────────────────────────────────
  function requestCompleteQuest(q) {
    if (q.done) return;
    setPendingComplete(q);
  }

  function completeQuest(q) {
    if (q.done) return;
    const prevXP = statXP[q.stat];
    const prevLv = getLvInfo(prevXP).level;
    const newXP = prevXP + q.xp;
    const newLv = getLvInfo(newXP).level;
    const newStreak = streak + 1;

    setQuests(qs => qs.map(x => x.id === q.id ? { ...x, done: true } : x));
    setStatXP(p => ({ ...p, [q.stat]: p[q.stat] + q.xp }));
    setStreak(newStreak);

    const r = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    setToast({ ...r, xp: q.xp });
    setTimeout(() => setToast(null), 2800);

    if (newLv > prevLv) setTimeout(() => setLevelUp({ stat: q.stat, level: newLv }), 900);
  }

  function confirmCompleteQuest() {
    if (!pendingComplete) return;
    completeQuest(pendingComplete);
    setPendingComplete(null);
  }

  function undoQuest(q) {
    if (!q.done) return;
    setQuests(qs => qs.map(x => x.id === q.id ? { ...x, done: false } : x));
    setStatXP(p => ({ ...p, [q.stat]: Math.max(0, p[q.stat] - q.xp) }));
    setStreak(s => Math.max(0, s - 1));
    setLevelUp(null);
    setToast({ e: "↩", m: "Quest reopened.", xp: q.xp });
    setTimeout(() => setToast(null), 2200);
  }

  function openEdit(q) {
    if (editingId === q.id) { setEditingId(null); setAiSuggestion(null); return; }
    setEditingId(q.id);
    setEditForm({ title: q.title, desc: q.desc || "", type: q.type, priority: q.priority, xp: q.xp, deadline: q.deadline || "" });
    setAiSuggestion(null);
  }

  async function saveEdit(q) {
    const updated = { ...q, ...editForm, xp: parseInt(editForm.xp) || q.xp };
    setQuests(qs => qs.map(x => x.id === q.id ? updated : x));
    setEditingId(null);
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 600,
          system: "You are a Life RPG quest advisor. When a user edits a quest it signals progression. Generate the ONE most logical next quest. Be specific. Return ONLY valid JSON, no markdown.",
          messages: [{ role: "user", content: `Stat: ${STAT_CFG[q.stat].label}\nOriginal: "${q.title}"\nUpdated to: "${updated.title}" — ${updated.desc}\nGenerate next logical quest.\nReturn: {"title":"...","desc":"...","type":"side|main|boss","priority":"urgent|high|normal|low","xp":30}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setAiSuggestion({ ...parsed, stat: q.stat });
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  function addSuggestion() {
    if (!aiSuggestion) return;
    setQuests(qs => [...qs, { ...aiSuggestion, id: `ai_${Date.now()}`, done: false, xp: parseInt(aiSuggestion.xp) || 30, deadline: null }]);
    setAiSuggestion(null);
  }

  async function genAIQuests(stat) {
    setAiLoading(true);
    const existing = quests.filter(q => q.stat === stat && !q.done).map(q => q.title).join(", ") || "none";
    const ctx = {
      strength: `PPL gym split. Today: ${todayWorkout}. Last bench press: 67.5kg × 8 reps.`,
      creativity: "Filmmaking, Rosaye creative agency, Sukoon spec ad perfume brand. Shoot April 25. Post-production after.",
      intelligence: "4th semester college. Assignments due April 27: OOP, OS, ADA, COA. COA exam April 29.",
      persona: "Confidence, communication, English fluency. Discord practice, 70/30 listening, Steve Jobs shadowing.",
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: "You are a Life RPG quest advisor. Generate 3 specific actionable quests. Direct, no fluff. Return ONLY valid JSON array.",
          messages: [{ role: "user", content: `Stat: ${STAT_CFG[stat].label}\nContext: ${ctx[stat]}\nDon't duplicate: ${existing}\nGenerate 3 quests. Each: title (action verb start), desc (1 specific sentence), type, priority, xp (15-120).\nReturn: [{"title":"...","desc":"...","type":"main","priority":"normal","xp":40}]` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "[]";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setQuests(qs => [...qs, ...parsed.map(q => ({ ...q, id: `ai_${Date.now()}_${Math.random()}`, stat, done: false, xp: parseInt(q.xp) || 30, deadline: null }))]);
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  function addManualQuest(stat) {
    if (!newQ.title.trim()) return;
    setQuests(qs => [...qs, { ...newQ, id: `m_${Date.now()}`, stat, done: false, xp: parseInt(newQ.xp) || 30, deadline: newQ.deadline || null }]);
    setNewQ({ title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "" });
    setShowAdd(false);
  }

  function addBoardQuest() {
    if (!boardQ.title.trim()) return;
    setQuests(qs => [...qs, { ...boardQ, id: `b_${Date.now()}`, done: false, xp: parseInt(boardQ.xp) || 30, deadline: boardQ.deadline || null }]);
    setBoardQ({ stat: "strength", title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "" });
    setShowBoardAdd(false);
  }

  function removeQuest(q) {
    setQuests(qs => qs.filter(x => x.id !== q.id));
    if (editingId === q.id) {
      setEditingId(null);
      setAiSuggestion(null);
    }
    setToast({ e: "✕", m: "Quest removed.", xp: 0 });
    setTimeout(() => setToast(null), 2200);
  }

  function acceptPenalty() {
    if (!penalty || !penaltyWhy.trim()) return;
    setStatXP(p => ({ ...p, [penalty.stat]: Math.max(0, p[penalty.stat] - 30) }));
    setQuests(qs => qs.map(q => q.id === penalty.id ? { ...q, deadline: null } : q));
    setPenalty(null); setPenaltyWhy("");
  }

  function acceptLevelPenalty() {
    if (!levelPenalty || !levelPenaltyWhy.trim()) return;
    const extendedDeadline = addDays(levelDeadline, 1).toISOString();
    setQuests(qs => qs.some(q => q.id === levelPenalty.id) ? qs : [levelPenalty, ...qs]);
    setLevelDeadline(extendedDeadline);
    setLevelPenalty(null);
    setLevelPenaltyWhy("");
    setToast({ e: "⏳", m: "Level 1 extended. Punishment quest added.", xp: 0 });
    setTimeout(() => setToast(null), 2800);
  }

  function navTo(pg, stat = null) {
    setPage(pg); if (stat) setActiveStat(stat);
    setShowAdd(false); setShowBoardAdd(false); setEditingId(null); setAiSuggestion(null);
  }

  function openQuestBoardAdd(prefillStat = "strength") {
    setBoardQ(q => ({ ...q, stat: prefillStat }));
    setPage("quests");
    setActiveStat(null);
    setShowAdd(false);
    setEditingId(null);
    setAiSuggestion(null);
    setShowBoardAdd(true);
  }

  // ── DERIVED ──────────────────────────────────────────────────────────────
  const totalXP = Object.values(statXP).reduce((a, b) => a + b, 0);
  const totalProgress = Math.min((totalXP / TOTAL_LV1_XP) * 100, 100);
  const totalDone = quests.filter(q => q.done).length;
  const todayQ = sortQ(quests.filter(q => !q.done)).slice(0, 5);
  const levelClock = formatCountdown(levelDeadline, nowMs);

  useEffect(() => {
    if (onboarding || totalProgress >= 100 || levelPenalty) return;
    if (new Date(levelDeadline).getTime() <= nowMs) {
      setLevelPenalty(getLevelPunishment(statXP, levelDeadline));
    }
  }, [onboarding, totalProgress, levelDeadline, nowMs, levelPenalty, statXP]);

  // ── ONBOARDING SCREEN ─────────────────────────────────────────────────────
  if (onboarding) {
    const selectedCount = selectedIds.size;
    return (
      <>
        <style>{S}</style>
        <div className="app">
          <div className="ob-wrap">
            <div className="ob-hero">
              <div className="ob-icon">⚔️</div>
              <div className="ob-title">Your Level 1 Quest Pack</div>
              <div className="ob-sub">These are all the quests available for Level 1. Select the ones you want to track. You can always add more later.</div>
            </div>

            <div className="ob-progress">
              <div className="ob-progress-top">
                <div className="ob-progress-label">Selected Quests</div>
                <div className="ob-progress-count">{selectedCount} / {QUEST_POOL.length}</div>
              </div>
              <div className="ob-track">
                <div className="ob-fill" style={{ width: `${(selectedCount / QUEST_POOL.length) * 100}%` }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
              {STATS.map(stat => {
                const cfg = STAT_CFG[stat];
                const pool = QUEST_POOL.filter(q => q.stat === stat);
                const selCount = pool.filter(q => selectedIds.has(q.id)).length;
                return (
                  <div className="ob-stat-section" key={stat}>
                    <div className="ob-stat-header">
                      <div className="ob-stat-icon">{cfg.icon}</div>
                      <div className="ob-stat-name" style={{ color: cfg.color }}>{cfg.label}</div>
                      <div className="ob-stat-count">{selCount}/{pool.length} selected</div>
                    </div>
                    <div className="ob-quest-list">
                      {pool.map(q => {
                        const sel = selectedIds.has(q.id);
                        const dl = dlLabel(q);
                        return (
                          <div key={q.id} className={`ob-qcard ${q.priority} ${sel ? "selected" : ""}`} onClick={() => toggleSelect(q.id)}>
                            <div className={`ob-check`}>{sel ? "✓" : ""}</div>
                            <div className="ob-qinfo">
                              <div className="ob-qtags">
                                <span className={`ob-qtag ${q.type === "boss" ? "ob-qtype-boss" : q.type === "main" ? "ob-qtype-main" : "ob-qtype-side"}`}
                                  style={q.type === "main" ? { color: cfg.color, borderColor: cfg.color } : {}}>
                                  {q.type === "boss" ? "⚡ Boss" : q.type === "main" ? "Main" : "Side"}
                                </span>
                                <span className={`ob-qprio ${q.priority}`}>{q.priority}</span>
                                {dl && <span className={`ob-qprio ${q.priority}`}>📅 {dl.text}</span>}
                              </div>
                              <div className="ob-qtitle">{q.title}</div>
                              <div className="ob-qdesc">{q.desc}</div>
                            </div>
                            <div className="ob-qxp">+{q.xp}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ob-footer">
              <button className="ob-confirm-btn" onClick={confirmQuests} disabled={selectedCount === 0}>
                Start with {selectedCount} Quest{selectedCount !== 1 ? "s" : ""}  →
              </button>
              <div className="ob-confirm-hint">You can add, edit, or remove quests anytime</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>
      <div className="app">

        {/* TOAST */}
        <div className={`toast ${toast ? "show" : ""}`}>
          {toast && <><div className="toast-e">{toast.e}</div><div className="toast-m">{toast.m}</div><div className="toast-xp">+{toast.xp} XP</div></>}
        </div>

        {/* LEVEL UP */}
        {levelUp && (
          <div className="levelup">
            <div className="lu-icon">{STAT_CFG[levelUp.stat].icon}</div>
            <div className="lu-title">LEVEL {levelUp.level}</div>
            <div className="lu-sub">{STAT_CFG[levelUp.stat].label} — {getLvTitle(levelUp.stat, levelUp.level)}</div>
            <button className="lu-btn" onClick={() => setLevelUp(null)}>Continue</button>
          </div>
        )}

        {/* COMPLETE CONFIRM */}
        {pendingComplete && (
          <div className="overlay">
            <div className="confirm-box">
              <div className="confirm-icon">✅</div>
              <div className="confirm-title">Mark Quest Complete?</div>
              <div className="confirm-desc">This will add XP and move the quest into completed.</div>
              <div className="confirm-quest">"{pendingComplete.title}"</div>
              <div className="confirm-actions">
                <button className="confirm-cancel" onClick={() => setPendingComplete(null)}>Cancel</button>
                <button className="confirm-accept" onClick={confirmCompleteQuest}>Yes, Completed</button>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL TIMER PENALTY */}
        {levelPenalty && (
          <div className="overlay">
            <div className="penalty-box">
              <div className="penalty-icon">⏳</div>
              <div className="penalty-title">Level 1 Deadline Missed</div>
              <div className="penalty-desc">You ran out of time before clearing Level 1.</div>
              <div className="penalty-quest">"{levelPenalty.title}"</div>
              <div className="penalty-desc">Accept this hard task to continue Level 1 from where you left off.</div>
              <div className="penalty-sub">New level deadline after accepting: {formatDate(addDays(levelDeadline, 1))}</div>
              <div className="penalty-why-label">Why did Level 1 slip?</div>
              <textarea className="penalty-textarea" placeholder="Name the real reason so the next push is tighter..." value={levelPenaltyWhy} onChange={e => setLevelPenaltyWhy(e.target.value)} />
              <button className="penalty-btn" onClick={acceptLevelPenalty} disabled={!levelPenaltyWhy.trim()}>Accept Punishment & Continue</button>
            </div>
          </div>
        )}

        {/* PENALTY */}
        {penalty && (
          <div className="overlay">
            <div className="penalty-box">
              <div className="penalty-icon">💀</div>
              <div className="penalty-title">Quest Failed</div>
              <div className="penalty-desc">You missed the deadline for:</div>
              <div className="penalty-quest">"{penalty.title}"</div>
              <div className="penalty-xp">−30 XP</div>
              <div className="penalty-why-label">Why did you miss it?</div>
              <input className="penalty-input" placeholder="Be honest with yourself..." value={penaltyWhy} onChange={e => setPenaltyWhy(e.target.value)} />
              <button className="penalty-btn" onClick={acceptPenalty} disabled={!penaltyWhy.trim()}>Accept & Continue</button>
            </div>
          </div>
        )}

        {/* ── HOME ── */}
        {page === "home" && (
          <div className="page">
            <div className="profile-header">
              <div className="avatar">N<div className="avatar-ring" /></div>
              <div className="profile-info">
                <div className="profile-name">Nikul</div>
                <div className="profile-role">Creative Director</div>
                <div className="profile-streak"><span>🔥</span><span className="streak-text">{streak} day streak</span></div>
              </div>
            </div>

            <div className="cxp-card">
              <div className="cxp-top">
                <div className="cxp-label">Level 1 Progress</div>
                <div className="cxp-pct">{Math.round(totalProgress)}%</div>
              </div>
              <div className="cxp-track"><div className="cxp-fill" style={{ width: `${totalProgress}%` }} /></div>
              <div className="cxp-bottom">
                <div className="cxp-nums">{totalXP} / {TOTAL_LV1_XP} XP</div>
                <div className="cxp-quests">{totalDone} / {quests.length} quests done</div>
              </div>
            </div>

            <div className="level-timer-card">
              <div className="level-timer-top">
                <div>
                  <div className="level-timer-label">Level 1 Deadline</div>
                  <div className="level-timer-deadline">Ends on {formatDate(levelDeadline)} · started from {formatDate(`${APP_TODAY}T00:00:00`)}</div>
                </div>
                <div className="level-timer-clock">{totalProgress >= 100 ? "CLEARED" : levelClock.clock}</div>
              </div>
              <div className="level-timer-meta">
                <div className="level-timer-status">{totalProgress >= 100 ? "Level 1 complete." : levelClock.status}</div>
                <div>{totalXP < TOTAL_LV1_XP ? `${TOTAL_LV1_XP - totalXP} XP remaining` : "Ready for Level 2"}</div>
              </div>
            </div>

            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => openQuestBoardAdd("strength")}>+ Add Quest</button>
              <button className="quick-action-btn" onClick={() => navTo("quests")}>Manage Quest List</button>
            </div>

            <div className="oracle-card">
              <div className="oracle-dot"><div className="oracle-pip" /><div className="oracle-lbl">Oracle</div></div>
              <div className="oracle-text">"{oracle}"</div>
            </div>

            <div className="sh"><div className="sh-title">Stats</div></div>
            <div className="stats-row">
              {STATS.map(key => {
                const cfg = STAT_CFG[key];
                const info = getLvInfo(statXP[key]);
                return (
                  <div className="stat-mini" key={key} onClick={() => navTo("stat", key)}>
                    <div className="stat-mini-icon">{cfg.icon}</div>
                    <div className="stat-mini-lv" style={{ color: cfg.color }}>Lv {info.level}</div>
                    <div className="stat-mini-bar"><div className="stat-mini-fill" style={{ width: `${info.progress}%`, background: cfg.color }} /></div>
                  </div>
                );
              })}
            </div>

            <div className="sh">
              <div className="sh-title">Today's Priority</div>
              <button className="sh-action" onClick={() => navTo("quests")}>All →</button>
            </div>
            <div className="ql">
              {todayQ.length === 0 && <div className="empty">All quests complete. Absolute monster. 🏆</div>}
              {todayQ.map(q => (
                <QCard key={q.id} q={q} onComplete={requestCompleteQuest} onEdit={openEdit} onDelete={removeQuest}
                  editingId={editingId} editForm={editForm} setEditForm={setEditForm}
                  onSaveEdit={saveEdit} aiSuggestion={editingId === q.id ? aiSuggestion : null}
                  aiLoading={editingId === q.id ? aiLoading : false} onAddSuggestion={addSuggestion}
                  onCancelEdit={() => { setEditingId(null); setAiSuggestion(null); }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── QUEST BOARD ── */}
        {page === "quests" && (
          <div className="page">
            <div style={{ padding: "40px 20px 16px" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Level 1</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Quest Board</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{totalDone}/{quests.length} complete · {Math.round(totalProgress)}% to Level 2</div>
            </div>

            <div className="sh">
              <div className="sh-title">Manage Quests</div>
              <button className="sh-action" onClick={() => setShowBoardAdd(v => !v)}>{showBoardAdd ? "Cancel" : "+ Add Quest"}</button>
            </div>

            {showBoardAdd && (
              <div className="add-form">
                <div className="add-form-title">Add Quest To Board</div>
                <div className="ep-2">
                  <div className="ep-row" style={{ marginBottom: 0 }}>
                    <label className="ep-label">Stat</label>
                    <select className="ep-select" value={boardQ.stat} onChange={e => setBoardQ(p => ({ ...p, stat: e.target.value }))}>
                      {STATS.map(stat => <option key={stat} value={stat}>{STAT_CFG[stat].label}</option>)}
                    </select>
                  </div>
                  <div className="ep-row" style={{ marginBottom: 0 }}>
                    <label className="ep-label">Type</label>
                    <select className="ep-select" value={boardQ.type} onChange={e => setBoardQ(p => ({ ...p, type: e.target.value }))}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select>
                  </div>
                </div>
                <div className="ep-row"><label className="ep-label">Title</label><input className="ep-input" value={boardQ.title} onChange={e => setBoardQ(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" /></div>
                <div className="ep-row"><label className="ep-label">Description</label><textarea className="ep-textarea" value={boardQ.desc} onChange={e => setBoardQ(p => ({ ...p, desc: e.target.value }))} placeholder="Details..." /></div>
                <div className="ep-2">
                  <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Priority</label><select className="ep-select" value={boardQ.priority} onChange={e => setBoardQ(p => ({ ...p, priority: e.target.value }))}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
                  <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">XP</label><input className="ep-input" type="number" value={boardQ.xp} onChange={e => setBoardQ(p => ({ ...p, xp: e.target.value }))} /></div>
                </div>
                <div className="ep-row" style={{ marginTop: 8, marginBottom: 0 }}><label className="ep-label">Deadline</label><input className="ep-input" type="date" value={boardQ.deadline} onChange={e => setBoardQ(p => ({ ...p, deadline: e.target.value }))} /></div>
                <div className="ep-actions">
                  <button className="ep-cancel" onClick={() => setShowBoardAdd(false)}>Cancel</button>
                  <button className="ep-save" onClick={addBoardQuest} disabled={!boardQ.title.trim()}>Add To Quest Board</button>
                </div>
              </div>
            )}

            {STATS.map(stat => {
              const cfg = STAT_CFG[stat];
              const statQ = sortQ(quests.filter(q => q.stat === stat));
              const active = statQ.filter(q => !q.done);
              const done = statQ.filter(q => q.done);
              const pct = statQ.length ? (done.length / statQ.length) * 100 : 0;
              return (
                <div className="stat-group" key={stat}>
                  <div className="stat-group-header">
                    <div className="stat-group-icon">{cfg.icon}</div>
                    <div className="stat-group-name" style={{ color: cfg.color }}>{cfg.label}</div>
                    <div className="stat-group-count">{done.length}/{statQ.length} done</div>
                  </div>
                  <div className="stat-group-bar">
                    <div className="stat-group-bar-fill" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                  <div className="ql" style={{ marginBottom: 0 }}>
                    {active.length === 0 && <div className="empty" style={{ padding: "10px 0" }}>All {cfg.label} quests complete ✓</div>}
                    {active.map(q => (
                      <QCard key={q.id} q={q} onComplete={requestCompleteQuest} onEdit={openEdit} onDelete={removeQuest}
                        editingId={editingId} editForm={editForm} setEditForm={setEditForm}
                        onSaveEdit={saveEdit} aiSuggestion={editingId === q.id ? aiSuggestion : null}
                        aiLoading={editingId === q.id ? aiLoading : false} onAddSuggestion={addSuggestion}
                        onCancelEdit={() => { setEditingId(null); setAiSuggestion(null); }}
                      />
                    ))}
                    {done.map(q => <QCard key={q.id} q={q} onComplete={() => { }} onEdit={() => { }} onUndo={undoQuest} editingId={null} onCancelEdit={() => { }} />)}
                  </div>
                  <div className="divider" />
                </div>
              );
            })}
          </div>
        )}

        {/* ── STAT PAGE ── */}
        {page === "stat" && activeStat && (() => {
          const cfg = STAT_CFG[activeStat];
          const info = getLvInfo(statXP[activeStat]);
          const sq = sortQ(quests.filter(q => q.stat === activeStat));
          const active = sq.filter(q => !q.done);
          const done = sq.filter(q => q.done);
          return (
            <div className="page">
              <div className="sph">
                <div className="sph-top">
                  <div className="sph-icon-big">{cfg.icon}</div>
                  <div><div className="sph-name" style={{ color: cfg.color }}>{cfg.label}</div><div className="sph-lv">Level {info.level} — {getLvTitle(activeStat, info.level)}</div></div>
                </div>
                <div className="sph-xp-card">
                  <div className="sph-xp-top">
                    <div className="sph-xp-label">XP Progress</div>
                    <div className="sph-xp-val" style={{ color: cfg.color }}>{info.current} / {XP_PER_LEVEL}</div>
                  </div>
                  <div className="sph-track"><div className="sph-fill" style={{ width: `${info.progress}%`, background: cfg.color }} /></div>
                </div>
                <div className="sph-quest-stats">
                  <div className="sph-qs-card"><div className="sph-qs-num" style={{ color: cfg.color }}>{sq.length}</div><div className="sph-qs-label">Total</div></div>
                  <div className="sph-qs-card"><div className="sph-qs-num" style={{ color: "var(--urgent)" }}>{active.filter(q => q.type === "boss").length}</div><div className="sph-qs-label">Boss</div></div>
                  <div className="sph-qs-card"><div className="sph-qs-num" style={{ color: "var(--green)" }}>{done.length}</div><div className="sph-qs-label">Done</div></div>
                </div>
              </div>

              <button className="ai-gen-btn" onClick={() => genAIQuests(activeStat)} disabled={aiLoading}>
                {aiLoading ? <span className="dots"><span className="dot" /><span className="dot" /><span className="dot" /></span> : `✦ Generate ${cfg.label} Quests`}
              </button>

              <div className="sh">
                <div className="sh-title">Active Quests</div>
                <button className="sh-action" onClick={() => setShowAdd(f => !f)}>{showAdd ? "Cancel" : "+ Add"}</button>
              </div>

              {showAdd && (
                <div className="add-form">
                  <div className="add-form-title">New Quest</div>
                  <div className="ep-row"><label className="ep-label">Title</label><input className="ep-input" value={newQ.title} onChange={e => setNewQ(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" /></div>
                  <div className="ep-row"><label className="ep-label">Description</label><textarea className="ep-textarea" value={newQ.desc} onChange={e => setNewQ(p => ({ ...p, desc: e.target.value }))} placeholder="Details..." /></div>
                  <div className="ep-2">
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Type</label><select className="ep-select" value={newQ.type} onChange={e => setNewQ(p => ({ ...p, type: e.target.value }))}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select></div>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Priority</label><select className="ep-select" value={newQ.priority} onChange={e => setNewQ(p => ({ ...p, priority: e.target.value }))}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
                  </div>
                  <div className="ep-2" style={{ marginTop: 8 }}>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">XP</label><input className="ep-input" type="number" value={newQ.xp} onChange={e => setNewQ(p => ({ ...p, xp: e.target.value }))} /></div>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Deadline</label><input className="ep-input" type="date" value={newQ.deadline} onChange={e => setNewQ(p => ({ ...p, deadline: e.target.value }))} /></div>
                  </div>
                  <div className="ep-actions">
                    <button className="ep-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                    <button className="ep-save" onClick={() => addManualQuest(activeStat)} disabled={!newQ.title.trim()}>Add Quest</button>
                  </div>
                </div>
              )}

              <div className="ql">
                {active.length === 0 && !showAdd && <div className="empty">No active quests. Generate with AI or add manually.</div>}
                {active.map(q => (
                  <QCard key={q.id} q={q} onComplete={requestCompleteQuest} onEdit={openEdit} onDelete={removeQuest}
                    editingId={editingId} editForm={editForm} setEditForm={setEditForm}
                    onSaveEdit={saveEdit} aiSuggestion={editingId === q.id ? aiSuggestion : null}
                    aiLoading={editingId === q.id ? aiLoading : false} onAddSuggestion={addSuggestion}
                    onCancelEdit={() => { setEditingId(null); setAiSuggestion(null); }}
                  />
                ))}
              </div>
              {done.length > 0 && <><div className="sh"><div className="sh-title">Completed</div></div><div className="ql">{done.map(q => <QCard key={q.id} q={q} onComplete={() => { }} onEdit={() => { }} onUndo={undoQuest} editingId={null} onCancelEdit={() => { }} />)}</div></>}
            </div>
          );
        })()}

        {/* NAV */}
        <div className="nav">
          {[
            { id: "home", icon: "⌂", label: "Home" },
            { id: "quests", icon: "📋", label: "Quests" },
            { id: "str", icon: "⚔️", label: "Strength", stat: "strength" },
            { id: "cre", icon: "🎨", label: "Create", stat: "creativity" },
            { id: "int", icon: "🧠", label: "Intel", stat: "intelligence" },
            { id: "per", icon: "🪞", label: "Persona", stat: "persona" },
          ].map(n => (
            <button key={n.id}
              className={`nav-btn ${page === (n.stat ? "stat" : n.id) && (n.stat ? activeStat === n.stat : true) ? "active" : ""}`}
              onClick={() => n.stat ? navTo("stat", n.stat) : navTo(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── QUEST CARD COMPONENT ────────────────────────────────────────────────────
function QCard({ q, onComplete, onEdit, onDelete, onUndo, editingId, editForm, setEditForm, onSaveEdit, aiSuggestion, aiLoading, onAddSuggestion, onCancelEdit }) {
  const cfg = STAT_CFG[q.stat];
  const isEditing = editingId === q.id;
  const dl = dlLabel(q);
  const typeColor = { boss: { background: "#f0c84015", color: "var(--gold)", border: "1px solid #f0c84030" }, main: { background: `${cfg?.color}12`, color: cfg?.color, border: `1px solid ${cfg?.color}25` }, side: {} };

  return (
    <div className={`qcard ${q.priority} ${q.done ? "done" : ""}`}>
      <div className="qcard-top">
        <div className={`qcheck ${q.done ? "checked" : ""}`} onClick={() => !q.done && onComplete(q)}>{q.done ? "✓" : ""}</div>
        <div className="qbody">
          <div className="qtags">
            <span className={`qtag ${q.type === "boss" ? "qtag-boss" : q.type === "main" ? "qtag-main" : "qtag-side"}`} style={typeColor[q.type] || {}}>
              {q.type === "boss" ? "⚡ Boss" : q.type === "main" ? "Main" : "Side"}
            </span>
            <span className={`qprio-tag prio-${q.priority}`}>{q.priority}</span>
            <span className="qstat-tag" style={{ background: `${cfg?.color}15`, color: cfg?.color, borderColor: `${cfg?.color}25` }}>{cfg?.icon} {cfg?.label}</span>
          </div>
          <div className="qtitle">{q.title}</div>
          {q.desc && <div className="qdesc">{q.desc}</div>}
        </div>
        <div className="qaction-col">
          <div className="qxp">+{q.xp}</div>
          {!q.done && onEdit && <button className="qedit-btn" onClick={() => onEdit(q)}>✎</button>}
          {!q.done && onDelete && <button className="qmini-btn delete" onClick={() => onDelete(q)}>Remove</button>}
          {q.done && onUndo && <button className="qmini-btn undo" onClick={() => onUndo(q)}>Undo</button>}
        </div>
      </div>

      {dl && (
        <div className="qmeta">
          <span className={`qdeadline ${dl.cls}`}>📅 {dl.text}</span>
        </div>
      )}

      {isEditing && (
        <div className="edit-panel">
          <div className="ep-title">Edit Quest</div>
          <div className="ep-row"><label className="ep-label">Title</label><input className="ep-input" value={editForm.title || ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="ep-row"><label className="ep-label">Description</label><textarea className="ep-textarea" value={editForm.desc || ""} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} /></div>
          <div className="ep-2">
            <div><label className="ep-label">Type</label><select className="ep-select" value={editForm.type || "main"} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select></div>
            <div><label className="ep-label">Priority</label><select className="ep-select" value={editForm.priority || "normal"} onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
          </div>
          <div className="ep-2" style={{ marginTop: 8 }}>
            <div><label className="ep-label">XP</label><input className="ep-input" type="number" value={editForm.xp || 30} onChange={e => setEditForm(f => ({ ...f, xp: e.target.value }))} /></div>
            <div><label className="ep-label">Deadline</label><input className="ep-input" type="date" value={editForm.deadline || ""} onChange={e => setEditForm(f => ({ ...f, deadline: e.target.value }))} /></div>
          </div>
          <div className="ep-actions">
            <button className="ep-cancel" onClick={onCancelEdit}>Cancel</button>
            <button className="ep-save" onClick={() => onSaveEdit(q)} disabled={!editForm.title?.trim()}>Save & Get Next Quest</button>
          </div>
          {aiLoading && <div className="ai-suggestion"><div className="ai-sug-label">Oracle thinking...</div><div className="dots" style={{ justifyContent: "flex-start", marginTop: 4 }}><span className="dot" /><span className="dot" /><span className="dot" /></div></div>}
          {aiSuggestion && (
            <div className="ai-suggestion">
              <div className="ai-sug-label">Next Quest Suggested</div>
              <div className="ai-sug-title">{aiSuggestion.title}</div>
              <div className="ai-sug-desc">{aiSuggestion.desc}</div>
              <button className="ai-sug-add" onClick={onAddSuggestion}>+ Add this quest →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
