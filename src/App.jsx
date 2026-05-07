import { useState, useEffect, useRef, useMemo } from "react";

// ── STYLES ───────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0a0906;--bg2:#13110f;--bg3:#1c1a18;--surface:#16110f;--surface2:#1c1816;
  --border:#332821;--border2:#4f3a2d;--text:#f3f0e8;--text2:#b9ac9e;--text3:#7f756b;
  --urgent:#ff3a3a;--urgent-dim:#2d0d0d;--urgent-border:#ff3a3a35;
  --high:#ff8c28;--high-dim:#2b1808;--high-border:#ff8c2835;
  --normal:#4a88f0;--normal-dim:#0d1b36;--normal-border:#4a88f035;
  --low:#38c870;--low-dim:#0b2114;--low-border:#38c87035;
  --str:#e65032;--cre:#f0a030;--int:#4888f0;--per:#9860f0;
  --gold:#f5c842;--gold-mid:#c99a18;--gold-dim:#2a2008;
  --green:#38c870;--radius:14px;
}
body{background:linear-gradient(180deg,#171313 0%, #120d10 100%);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
.app{max-width:480px;margin:0 auto;min-height:100vh;position:relative;background:
radial-gradient(circle at 85% 8%, rgba(99,39,150,.32), transparent 34%),
radial-gradient(circle at 12% 42%, rgba(120,39,26,.18), transparent 26%),
linear-gradient(180deg,#0c0b0f 0%, #0a0906 100%);}
button{font-family:'Inter',sans-serif;cursor:pointer;touch-action:manipulation;}

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
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--bg2);border-top:1px solid var(--border2);display:flex;z-index:50;padding-bottom:env(safe-area-inset-bottom);}
.nav-btn{flex:1;min-height:58px;padding:10px 4px 12px;background:none;border:none;font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);transition:color 0.2s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;}
.nav-btn.active{color:var(--text);}
.nav-icon{font-size:17px;line-height:1;}
.page{padding-bottom:94px;min-height:100vh;}

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
.cxp-card{margin:0 20px 16px;background:linear-gradient(180deg,rgba(35,28,43,.92),rgba(24,18,22,.96));border:1px solid rgba(120,91,138,.28);border-radius:18px;padding:18px 20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.03);}
.cxp-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
.cxp-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.cxp-pct{font-family:'Syne',sans-serif;font-size:12px;font-weight:800;color:var(--gold);}
.cxp-track{height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;margin-bottom:6px;position:relative;}
.cxp-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#ef7a52 0%, #cb5be7 48%, #4d87f4 100%);transition:width 0.8s cubic-bezier(0.4,0,0.2,1);}
.cxp-bottom{display:flex;justify-content:space-between;}
.cxp-nums{font-size:10px;color:var(--text3);}
.cxp-quests{font-size:10px;color:var(--text3);}
.cxp-coins{font-size:11px;color:var(--gold);margin-top:8px;font-family:'Syne',sans-serif;font-weight:700;}
.level-timer-card{margin:0 20px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px;}
.level-timer-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;}
.level-timer-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.level-timer-deadline{font-size:11px;color:var(--text2);margin-top:4px;line-height:1.4;}
.level-timer-clock{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--gold);text-align:right;line-height:1;}
.level-timer-meta{display:flex;justify-content:space-between;gap:12px;font-size:10px;color:var(--text3);}
.level-timer-status{color:var(--text2);}
.quick-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0 20px 16px;}
.quick-action-btn{min-height:44px;padding:12px 10px;background:transparent;border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;transition:all 0.15s;}
.quick-action-btn:hover{border-color:var(--border2);}
.home-duo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0 20px 16px;}
.reward-home-card{margin:0 20px 16px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:14px 16px;}
.home-duo .reward-home-card{margin:0;padding:14px 14px;min-height:168px;display:flex;flex-direction:column;justify-content:space-between;}
.reward-home-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.reward-home-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.reward-home-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;line-height:1;}
.reward-home-copy{font-size:11px;color:var(--text2);line-height:1.5;margin-top:6px;}
.reward-home-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}
.reward-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;border:1px solid var(--border2);background:var(--bg3);font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);}
.reward-pill.gold{color:var(--gold);border-color:#f0c84025;background:#20190b;}
.reward-open-btn{margin-top:12px;width:100%;padding:12px;background:transparent;border:1px solid var(--gold);color:var(--gold);font-family:'Syne',sans-serif;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;border-radius:10px;}

/* STAT MINIS */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 20px 16px;}
.stat-mini{background:linear-gradient(180deg,rgba(26,20,18,.95),rgba(18,16,14,.98));border:1px solid var(--border2);border-radius:16px;padding:14px 10px;text-align:center;cursor:pointer;transition:all 0.15s;box-shadow:inset 0 1px 0 rgba(255,255,255,.02);}
.stat-mini:hover{border-color:#6b4f3a;transform:translateY(-1px);}
.stat-mini-icon{font-size:16px;margin-bottom:3px;}
.stat-mini-lv{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;margin-bottom:4px;}
.stat-mini-bar{height:4px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden;margin-top:8px;}
.stat-mini-fill{height:100%;border-radius:2px;transition:width 0.6s ease;}

/* ORACLE */
.oracle-card{margin:0 20px 16px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:12px 14px;}
.oracle-dot{display:flex;align-items:center;gap:6px;margin-bottom:5px;}
.oracle-pip{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
.oracle-lbl{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:0.7;}
.oracle-text{font-size:12px;color:var(--text2);line-height:1.5;font-style:italic;}

/* SECTION HEADER */
.sh{padding:0 20px 10px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.sh-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}
.sh-action{min-height:36px;padding:8px 10px;border-radius:10px;font-size:10px;color:var(--text2);font-family:'Syne',sans-serif;font-weight:700;background:transparent;border:1px solid var(--border2);letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;white-space:nowrap;}
.sh-action:hover{color:var(--text);border-color:var(--border2);}

/* QUEST LIST */
.ql{padding:0 20px;display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}

/* QUEST CARD */
.qcard{border-radius:18px;padding:18px 18px;transition:all 0.15s;position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.02);}
.qcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;}
.qcard.boss{background:linear-gradient(180deg,rgba(49,18,18,.96),rgba(33,12,13,.98));border:1px solid rgba(230,80,50,.32);}
.qcard.boss::before{background:var(--str);}
.qcard.main{background:linear-gradient(180deg,rgba(15,21,45,.96),rgba(11,15,31,.98));border:1px solid rgba(72,136,240,.30);}
.qcard.main::before{background:var(--int);}
.qcard.side{background:linear-gradient(180deg,rgba(9,29,21,.96),rgba(8,22,17,.98));border:1px solid rgba(56,200,112,.28);}
.qcard.side::before{background:var(--low);}
.qcard.done{opacity:0.3;filter:grayscale(0.5);}
.qcard-top{display:flex;align-items:flex-start;gap:10px;}
.qcheck{width:30px;height:30px;border-radius:50%;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:12px;transition:all 0.2s;}
.qcheck:hover{border-color:var(--green);}
.qcheck.checked{background:var(--green);border-color:var(--green);color:white;}
.qbody{flex:1;min-width:0;}
.qtags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:5px;align-items:center;}
.qtag{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;}
.qtag-boss{background:#3a1a12;color:var(--gold);border:1px solid rgba(245,200,66,.24);}
.qtag-main{background:#172750;color:#7da8ff;border:1px solid rgba(72,136,240,.25);}
.qtag-side{background:#102518;color:#63d58e;border:1px solid rgba(56,200,112,.22);}
.qstat-tag{font-family:'Syne',sans-serif;font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;border:1px solid transparent;}
.qprio-tag{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border-radius:4px;}
.prio-urgent{background:var(--urgent-dim);color:var(--urgent);border:1px solid var(--urgent-border);}
.prio-high{background:var(--high-dim);color:var(--high);border:1px solid var(--high-border);}
.prio-normal{background:var(--normal-dim);color:var(--normal);border:1px solid var(--normal-border);}
.prio-low{background:var(--low-dim);color:var(--low);border:1px solid var(--low-border);}
.qtitle{font-size:15px;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:4px;}
.qdesc{font-size:12px;color:var(--text2);line-height:1.55;}
.qcard.done .qtitle{text-decoration:line-through;}
.qmeta{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);}
.qdeadline{font-size:10px;font-weight:500;}
.dl-ok{color:var(--text3);}
.dl-warn{color:var(--high);}
.dl-urgent{color:var(--urgent);}
.dl-over{color:var(--urgent);font-weight:700;}
.qright{display:flex;align-items:center;gap:8px;}
.qxp{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--gold);}
.qedit-btn{background:none;border:none;color:var(--text3);font-size:13px;padding:2px 4px;border-radius:4px;transition:color 0.15s;line-height:1;}
.qedit-btn:hover{color:var(--text2);}
.qaction-col{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;}
.qmini-btn{min-height:30px;background:transparent;border:1px solid var(--border2);color:var(--text2);font-size:11px;padding:6px 10px;border-radius:8px;transition:all 0.15s;line-height:1;display:inline-flex;align-items:center;justify-content:center;}
.qmini-btn:hover{color:var(--text);border-color:var(--border2);}
.qmini-btn.delete:hover{color:var(--urgent);border-color:var(--urgent-border);}
.qmini-btn.undo:hover{color:var(--gold);border-color:#f0c84035;}
.qmini-btn.complete{color:#8ef0af;border-color:#2f6d45;background:#122118;}
.qmini-btn.complete:hover{color:#c1f6d3;border-color:#3e9a62;background:#173021;}

/* EDIT PANEL */
.edit-panel{background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:14px;margin-top:10px;}
.ep-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;}
.ep-row{margin-bottom:8px;}
.ep-label{font-family:'Syne',sans-serif;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:4px;}
.ep-input,.ep-select,.ep-textarea{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:11px 12px;font-family:'Inter',sans-serif;font-size:14px;border-radius:10px;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
.ep-input:focus,.ep-select:focus,.ep-textarea:focus{border-color:var(--border2);}
.ep-textarea{min-height:56px;resize:none;line-height:1.5;}
.ep-select option{background:var(--bg2);}
.ep-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.ep-actions{display:flex;gap:6px;margin-top:10px;}
.ep-save{flex:1;min-height:42px;padding:11px;background:transparent;border:1px solid var(--normal);color:var(--normal);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:9px;transition:opacity 0.2s;}
.ep-save:hover{opacity:0.85;}
.ep-save:disabled{opacity:0.35;cursor:not-allowed;}
.ep-cancel{min-height:42px;padding:11px 14px;background:none;border:1px solid var(--border);color:var(--text3);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:9px;}
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
.add-form{margin:0 20px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:16px;}
.add-form-title{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;}

/* TOAST */
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-120px);background:var(--surface2);border:1px solid var(--border2);padding:12px 20px;border-radius:10px;z-index:200;text-align:center;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275);max-width:90vw;box-shadow:none;min-width:180px;}
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

/* REWARDS */
.rw-page{padding:40px 20px 88px;}
.rw-stack{display:flex;flex-direction:column;gap:12px;}
.rw-panel,.rw-card,.rw-result,.rw-toast{background:var(--surface);border:1px solid var(--border2);border-radius:10px;}
.rw-panel,.rw-card,.rw-result{padding:14px;}
.rw-topline{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.rw-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;line-height:1;margin-bottom:4px;}
.rw-sub{font-size:12px;color:var(--text2);line-height:1.6;}
.rw-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.rw-tab{padding:10px 8px;border-radius:10px;border:1px solid var(--border);background:var(--bg2);color:var(--text3);font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.rw-tab.active{background:transparent;color:var(--gold);border-color:var(--gold);}
.rw-metrics{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.rw-metric{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.rw-metric-value{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;line-height:1;}
.rw-metric-note{font-size:11px;color:var(--text2);line-height:1.5;margin-top:6px;}
.rw-row{display:flex;gap:10px;}
.rw-row > *{flex:1;}
.rw-btn,.rw-btn-ghost,.rw-btn-danger{min-height:44px;padding:12px 14px;border-radius:12px;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.rw-btn{background:transparent;border:1px solid var(--gold);color:var(--gold);}
.rw-btn-ghost{background:transparent;border:1px solid var(--border2);color:var(--text);}
.rw-btn-danger{background:var(--urgent);border:none;color:#fff;}
.rw-btn:disabled,.rw-btn-ghost:disabled,.rw-btn-danger:disabled{opacity:.35;cursor:not-allowed;}
.rw-list{display:flex;flex-direction:column;gap:10px;}
.rw-card-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;}
.rw-card-title{font-size:14px;font-weight:600;line-height:1.4;}
.rw-card-sub{font-size:11px;line-height:1.5;color:var(--text2);margin-top:6px;}
.rw-chip-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.rw-chip{display:inline-flex;align-items:center;border:1px solid var(--border);padding:4px 8px;border-radius:999px;font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);}
.rw-chip.gold{color:var(--gold);border-color:#f0c84030;background:#20190b;}
.rw-chip.green{color:var(--green);border-color:#214b35;background:#0e1b15;}
.rw-chip.blue{color:var(--normal);border-color:#234166;background:#0d1724;}
.rw-chip.red{color:var(--urgent);border-color:#4c2424;background:#201010;}
.rw-chip.purple{color:var(--per);border-color:#43305f;background:#171221;}
.rw-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.rw-label{display:block;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.rw-input,.rw-select{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:11px 12px;color:var(--text);font-family:'Inter',sans-serif;font-size:13px;outline:none;}
.rw-checks{display:flex;flex-wrap:wrap;gap:8px;}
.rw-check{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid var(--border);border-radius:12px;background:var(--bg2);font-size:12px;color:var(--text2);}
.rw-empty{padding:20px 10px;text-align:center;color:var(--text3);font-size:12px;line-height:1.6;}
.rw-info-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.rw-info-title{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.rw-info-copy{font-size:12px;color:var(--text2);line-height:1.6;}
.rw-wheel-stage{display:flex;flex-direction:column;align-items:center;gap:16px;}
.rw-wheel-shell{position:relative;width:320px;height:320px;display:flex;align-items:center;justify-content:center}
.rw-wheel-pointer{position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:28px solid var(--gold);z-index:4;filter:drop-shadow(0 0 18px rgba(240,200,64,.45))}
.rw-wheel-disc{position:relative;width:100%;height:100%;border-radius:50%;border:10px solid #20202b;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45),0 0 0 2px #2e2e3d inset;transition:transform 2.8s cubic-bezier(.12,.82,.2,1)}
.rw-wheel-label-layer{position:absolute;inset:0;z-index:2;pointer-events:none;transition:transform 2.8s cubic-bezier(.12,.82,.2,1)}
.rw-wheel-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,var(--surface));border:4px solid #343444;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;z-index:3;box-shadow:0 0 35px rgba(255,255,255,.12)}
.rw-wheel-center-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:800;line-height:1.15;color:#15151b}
.rw-wheel-label{position:absolute;left:50%;top:50%;width:74px;margin-left:-37px;text-align:center;font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:.35px;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.45);pointer-events:none;line-height:1.1;word-break:break-word;transition:transform .45s ease}
.rw-tier-switch{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%}
.rw-tier-btn{padding:12px 10px;border-radius:14px;border:1px solid var(--border);background:var(--bg2);color:var(--text3);font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
.rw-tier-btn.active{background:linear-gradient(135deg,var(--gold),#ffb82e);color:#111;border-color:#73581d}
.rw-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-120px);min-width:220px;max-width:88vw;padding:14px 16px;z-index:220;box-shadow:0 20px 45px rgba(0,0,0,.5);transition:transform .35s ease;border-color:#57461d}
.rw-toast.show{transform:translateX(-50%) translateY(0)}
.rw-toast-top{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.rw-toast-title{font-size:13px;font-weight:700;color:var(--text);line-height:1.4}
.rw-toast-body{font-size:11px;color:var(--text2);line-height:1.5;margin-top:5px}
.rw-result-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--gold)}
.rw-result-body{font-size:12px;color:var(--text2);line-height:1.6;margin-top:8px}
.ra-page{padding:0 20px 110px;}
.ra-hero{padding:40px 0 16px;}
.ra-topline{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.ra-title{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;line-height:1.02;letter-spacing:-0.5px;}
.ra-sub{font-size:13px;color:var(--text2);line-height:1.7;margin-top:10px;}
.ra-stack{display:flex;flex-direction:column;gap:12px;}
.ra-panel{background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:16px;}
.ra-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.ra-label{display:block;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.ra-input,.ra-select,.ra-textarea{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:11px 12px;color:var(--text);font-family:'Inter',sans-serif;font-size:13px;outline:none;}
.ra-textarea{min-height:88px;resize:vertical;line-height:1.6;}
.ra-row{display:flex;gap:8px;flex-wrap:wrap;}
.ra-btn,.ra-btn-ghost{min-height:42px;padding:11px 14px;border-radius:12px;font-family:'Syne',sans-serif;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;transition:opacity .18s,border-color .18s,color .18s,background .18s;}
.ra-btn{background:linear-gradient(135deg,var(--gold),#ffb82e);color:#111;border:1px solid #73581d;}
.ra-btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2);}
.ra-btn:disabled,.ra-btn-ghost:disabled{opacity:.35;cursor:not-allowed;}
.ra-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.ra-metric{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.ra-metric-value{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;line-height:1;margin:6px 0;color:var(--text);}
.ra-metric-note{font-size:11px;color:var(--text3);line-height:1.5;}
.ra-memory-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.ra-memory-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.ra-memory-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}
.ra-memory-name{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.ra-memory-body{font-size:12px;color:var(--text2);line-height:1.55;white-space:pre-wrap;}
.ra-chat{display:flex;flex-direction:column;gap:10px;}
.ra-messages{display:flex;flex-direction:column;gap:10px;max-height:320px;overflow:auto;padding-right:2px;}
.ra-msg{border-radius:14px;padding:12px 13px;max-width:92%;}
.ra-msg.user{align-self:flex-end;background:#1a2332;border:1px solid #314766;}
.ra-msg.ai{align-self:flex-start;background:var(--bg2);border:1px solid var(--border);}
.ra-msg-role{font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
.ra-msg-body{font-size:12px;color:var(--text2);line-height:1.65;white-space:pre-wrap;}
.ra-chip-row{display:flex;flex-wrap:wrap;gap:6px;}
.ra-chip{display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;border:1px solid var(--border);background:var(--bg2);font-family:'Syne',sans-serif;font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text2);}
.ra-chip.fit{color:var(--str);border-color:#5a2f24;background:#19110d;}
.ra-chip.work{color:var(--cre);border-color:#5d4017;background:#1e160b;}
.ra-chip.learn{color:var(--int);border-color:#21486e;background:#0e1824;}
.ra-chip.good{color:var(--green);border-color:#214b35;background:#0e1b15;}
.ra-suggestion-list{display:flex;flex-direction:column;gap:10px;}
.ra-suggestion-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;}
.ra-suggestion-title{font-size:13px;font-weight:700;color:var(--text);}
.ra-suggestion-desc{font-size:12px;color:var(--text2);line-height:1.6;margin-top:6px;}
.ra-empty{padding:16px 10px;text-align:center;color:var(--text3);font-size:12px;line-height:1.6;}
@media (max-width:360px){
  .rw-wheel-shell{width:280px;height:280px}
  .rw-wheel-center{width:84px;height:84px}
  .rw-wheel-center-title{font-size:10px}
  .rw-wheel-label{width:62px;margin-left:-31px;font-size:7px}
  .rw-tabs{grid-template-columns:repeat(2,1fr)}
  .ra-metrics,.ra-grid2,.ra-memory-grid{grid-template-columns:1fr;}
}
@media (max-width:420px){
  .quick-actions{grid-template-columns:1fr;}
  .home-duo{grid-template-columns:1fr 1fr;}
  .profile-header{padding-top:32px;}
  .sh{align-items:flex-start;flex-direction:column;}
  .sh > div[style*="display: flex"]{width:100%;display:grid !important;grid-template-columns:1fr 1fr;gap:8px !important;}
  .qcard-top{gap:12px;}
  .ra-title{font-size:26px;}
  .ra-msg{max-width:100%;}
}
@media (max-width:360px){
  .home-duo{grid-template-columns:1fr;}
}
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
const MIN_LEVEL_QUEST_TARGET = 25;
const BASE_TARGET_XP_PER_QUEST = 30;
const DAY_MS = 1000 * 60 * 60 * 24;
const APP_TODAY = "2026-04-24";
const LEVEL_1_DEFAULT_DEADLINE = "2026-04-29T23:59:59";
const MISSED_DEADLINE_COIN_PENALTY = 30;
const COINS_BY_TYPE = { side: 5, main: 20, boss: 50 };
const ROSAYE_DEFAULT_CONFIG = {
  provider: "groq",
  apiKey: "server-proxy",
  model: "llama-3.3-70b-versatile",
};
const RW_SHOP_REFRESH_COST = 25;
const RW_WHEEL_REFRESH_COST = 40;
const RW_FULL_REFRESH_COST = 60;
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
const RW_WHEEL_CONFIG = {
  basic: {
    label: "Basic Wheel",
    cost: 10,
    poolSize: 3,
    staticSlots: [
      { id: "nothing", label: "Nothing", kind: "nothing", weight: 30 },
      { id: "bonus_5", label: "5 Bonus Coins", kind: "coins", coins: 5, weight: 25 },
    ],
  },
  silver: {
    label: "Silver Wheel",
    cost: 30,
    poolSize: 4,
    staticSlots: [
      { id: "nothing", label: "Nothing", kind: "nothing", weight: 25 },
      { id: "bonus_10", label: "10 Bonus Coins", kind: "coins", coins: 10, weight: 15 },
      { id: "mystery", label: "Mystery Bonus", kind: "mystery", weight: 10 },
    ],
  },
  gold: {
    label: "Gold Wheel",
    cost: 75,
    poolSize: 4,
    staticSlots: [
      { id: "bonus_50", label: "50 Bonus Coins", kind: "coins", coins: 50, weight: 10 },
      { id: "double_next", label: "Double Coins Next Quest", kind: "boost", token: "double_next_quest", weight: 10 },
      { id: "jackpot", label: "Jackpot Re-spin", kind: "jackpot", weight: 10 },
    ],
  },
};
const RW_DEFAULT_LIBRARY = [
  { id: "r1", name: "15 min Instagram Scroll", cost: 10, category: "entertainment", emoji: "IG", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["basic"] },
  { id: "r2", name: "15 min YouTube", cost: 10, category: "entertainment", emoji: "YT", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["basic"] },
  { id: "r3", name: "30 min Manhwa Reading", cost: 20, category: "entertainment", emoji: "MH", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["basic", "silver"] },
  { id: "r4", name: "1 Episode of a Show", cost: 35, category: "entertainment", emoji: "TV", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["silver"] },
  { id: "r5", name: "Small Junk Food Snack", cost: 40, category: "food", emoji: "SN", rewardType: "item", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["silver"] },
  { id: "r6", name: "1 Movie", cost: 60, category: "entertainment", emoji: "MV", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["gold"] },
  { id: "r7", name: "Full Cheat Meal", cost: 80, category: "food", emoji: "CM", rewardType: "item", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["gold"] },
  { id: "r8", name: "2hr Gaming Session", cost: 100, category: "time", emoji: "GM", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["silver", "gold"] },
  { id: "r9", name: "Rest Day - No Workout Guilt", cost: 120, category: "rest", emoji: "RD", rewardType: "item", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["gold"] },
  { id: "r10", name: "Wildcard - You Choose", cost: 150, category: "any", emoji: "WC", rewardType: "item", enabled: true, shopEligible: true, wheelEligible: false, tiers: [] },
];
function rwBlankReward() {
  return { name: "", cost: 25, category: "entertainment", emoji: "RW", rewardType: "token", enabled: true, shopEligible: true, wheelEligible: true, tiers: ["basic"] };
}
function rosayeDefaultMemory() {
  return {
    fitness: { current: "", progress: "", next: "", updatedAt: "" },
    work: { current: "", project: "", progress: "", next: "", updatedAt: "" },
    learning: { current: "", progress: "", next: "", updatedAt: "" },
    general: { goal: "", note: "", updatedAt: "" },
  };
}
function rosayeDefaultSuggestions() {
  return [
    { id: "ra_seed_1", stat: "strength", title: "Track today's run distance", desc: "Log the exact distance and how it felt so Rosaye can scale the next fitness quest." },
    { id: "ra_seed_2", stat: "creativity", title: "Continue current edit block", desc: "Do one focused editing sprint on your active project and note what still needs work." },
  ];
}
function rosayeProviderModel(provider) {
  if (provider === "gemini") return "gemini-1.5-flash";
  if (provider === "openrouter") return "google/gemini-2.0-flash-lite";
  return "llama-3.3-70b-versatile";
}
function rosayeMergeMemory(current, updates) {
  const base = rosayeDefaultMemory();
  const source = current || base;
  const next = { ...base, ...source };
  Object.keys(base).forEach(key => {
    next[key] = { ...base[key], ...(source[key] || {}), ...((updates && updates[key]) || {}) };
  });
  return next;
}
function rosayeInferMemory(text, current) {
  const msg = (text || "").trim();
  const lower = msg.toLowerCase();
  const now = new Date().toLocaleString();
  const updates = {};
  const projectMatch = msg.match(/project name is\s+([a-z0-9 _-]+)/i);
  if (projectMatch) {
    updates.work = { project: projectMatch[1].trim(), current: `${projectMatch[1].trim()} editing`, updatedAt: now };
  }
  const workMatch = msg.match(/working on\s+([a-z0-9 _-]+)/i);
  if (workMatch) {
    updates.work = { ...(updates.work || {}), current: workMatch[1].trim(), updatedAt: now };
  }
  const runMatch = msg.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (runMatch && (lower.includes("run") || lower.includes("running"))) {
    const km = Number(runMatch[1]);
    updates.fitness = {
      current: `${km} km running`,
      progress: `Completed ${km} km`,
      next: `Run ${(km + 0.5).toFixed(1).replace(".0", "")} km tomorrow and add 10 min stretching`,
      updatedAt: now,
    };
  }
  if (lower.includes("edit")) {
    const knownProject = updates.work?.project || current?.work?.project || "";
    updates.work = {
      ...(updates.work || {}),
      progress: knownProject ? `Editing progress on ${knownProject}` : "Editing progress logged",
      next: knownProject ? `Continue ${knownProject} edit and finish one concrete sequence` : "Continue editing and finish one concrete sequence",
      updatedAt: now,
    };
  }
  if (lower.includes("assignment") || lower.includes("study") || lower.includes("exam")) {
    updates.learning = {
      current: msg,
      progress: "Learning session logged",
      next: "Turn the next study block into one focused submission or revision sprint",
      updatedAt: now,
    };
  }
  if (!Object.keys(updates).length) {
    updates.general = { note: msg, updatedAt: now };
  }
  return updates;
}
function rosayeHeuristicResponse(message, memory) {
  const text = (message || "").trim();
  const lower = text.toLowerCase();
  if (!text) {
    return {
      reply: "Give me one real update and I will turn it into progress, memory, and the next logical quest.",
      suggestions: rosayeDefaultSuggestions(),
    };
  }
  if ((lower.includes("run") || lower.includes("running")) && memory.fitness?.next) {
    const target = memory.fitness.next;
    return {
      reply: `Logged. You're not repeating the same effort tomorrow. ${target}.`,
      suggestions: [
        { id: `ra_${Date.now()}_1`, stat: "strength", title: target.split(" and ")[0], desc: "Push the distance slightly while keeping the form and pace controlled." },
        { id: `ra_${Date.now()}_2`, stat: "strength", title: "Add 10 min post-run stretching", desc: "Open hips, calves, and hamstrings so the next running session feels lighter." },
      ],
    };
  }
  const activeProject = memory.work?.project || "";
  if (lower.includes("edit") || lower.includes("project")) {
    return {
      reply: activeProject
        ? `Memory updated. I’ll use ${activeProject} as the active project from now on and keep suggestions tied to its next deliverable.`
        : "Memory updated. I’ll keep your current editing project active and suggest the next concrete deliverable instead of generic work.",
      suggestions: [
        { id: `ra_${Date.now()}_3`, stat: "creativity", title: activeProject ? `Continue ${activeProject} edit` : "Continue the current edit", desc: "Finish one clearly defined sequence instead of jumping across the whole timeline." },
        { id: `ra_${Date.now()}_4`, stat: "creativity", title: activeProject ? `Review ${activeProject} rough cut` : "Review rough cut with notes", desc: "Watch once without editing, note weak transitions, then fix only the highest-impact issue." },
      ],
    };
  }
  if (lower.includes("study") || lower.includes("assignment") || lower.includes("exam")) {
    return {
      reply: "Good. I’m treating this as learning progress, not vague effort. The next quest should create visible output, not just more sitting.",
      suggestions: [
        { id: `ra_${Date.now()}_5`, stat: "intelligence", title: "Finish one hard submission block", desc: "Work only on the assignment or exam topic that is currently most likely to slip." },
        { id: `ra_${Date.now()}_6`, stat: "intelligence", title: "Write a 5-point revision sheet", desc: "Compress today’s learning into five bullets so Rosaye can scale tomorrow intelligently." },
      ],
    };
  }
  return {
    reply: "Logged. I’ve updated memory and turned this into the next actionable step instead of leaving it as a vague note.",
    suggestions: [
      { id: `ra_${Date.now()}_7`, stat: "persona", title: "Turn this update into one visible action", desc: "Complete one next step today so the progress chain stays real." },
    ],
  };
}
function rosayeJsonFromText(raw) {
  const text = (raw || "").replace(/```json|```/g, "").trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  return text;
}
function rosayeBuildApiRequest(config, message, memory, recentMessages) {
  const system = "You are Rosaye, an adaptive quest brain inside Life RPG. Update memory carefully, preserve existing context, replace stale entities when the user clarifies them, and suggest only the next logical quests. Return ONLY valid JSON with keys: reply, memory_updates, suggestions. suggestions must be an array of up to 3 objects with stat, title, desc.";
  const userPayload = JSON.stringify({
    user_update: message,
    memory,
    recent_messages: recentMessages.slice(-6),
  });
  return {
    url: "/api/rosaye",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model || rosayeProviderModel("groq"),
        temperature: 0.5,
        messages: [{ role: "system", content: system }, { role: "user", content: userPayload }],
      }),
    },
    parse: async res => {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    },
  };
}
function rosayeQuestFallback(stat, mode, payload) {
  const label = STAT_CFG[stat]?.label || "Quest";
  if (mode === "next") {
    if (stat === "strength") return { title: "Scale the next session slightly", desc: "Add one small overload step or recovery block so the last effort turns into progression.", type: "main", priority: "high", xp: 35 };
    if (stat === "creativity") return { title: "Finish the next visible creative block", desc: "Push the project forward by finishing one sequence, deliverable, or review pass instead of reopening everything.", type: "main", priority: "high", xp: 40 };
    if (stat === "intelligence") return { title: "Turn the study block into output", desc: "Convert the latest learning session into one completed submission, summary, or revision sheet.", type: "main", priority: "urgent", xp: 35 };
    return { title: "Repeat the confidence action with more difficulty", desc: "Take the same social skill one step further so the gain compounds instead of resetting tomorrow.", type: "main", priority: "normal", xp: 30 };
  }
  const base = {
    strength: [
      { title: "Track today's full workout", desc: "Log sets, reps, weight, and one improvement target for the next session.", type: "main", priority: "normal", xp: 30 },
      { title: "Add 10 minutes of mobility", desc: "Stretch hips, shoulders, and calves so training quality stays high tomorrow.", type: "side", priority: "normal", xp: 20 },
      { title: "Push one main lift", desc: "Try one controlled overload on the key movement instead of repeating last time blindly.", type: "main", priority: "high", xp: 40 },
    ],
    creativity: [
      { title: "Finish one edit block", desc: "Complete one real section of the timeline instead of touching ten areas lightly.", type: "main", priority: "high", xp: 40 },
      { title: "Review the cut with notes", desc: "Watch once without editing and write the three biggest fixes before touching the timeline again.", type: "side", priority: "normal", xp: 20 },
      { title: "Prepare the next delivery step", desc: "Export, organize, or package the creative work so it is closer to publishable or client-ready.", type: "main", priority: "normal", xp: 35 },
    ],
    intelligence: [
      { title: "Finish one hard academic block", desc: "Choose the assignment or topic most likely to slip and finish one visible chunk of it.", type: "main", priority: "urgent", xp: 35 },
      { title: "Write a 5-point summary", desc: "Compress today's learning into five bullets so tomorrow starts faster and sharper.", type: "side", priority: "normal", xp: 20 },
      { title: "Do one exam-style revision sprint", desc: "Practice recall under time pressure instead of only re-reading notes.", type: "main", priority: "high", xp: 35 },
    ],
    persona: [
      { title: "Do today's English interaction", desc: "Initiate one real conversation or voice session and track how long you held it.", type: "main", priority: "high", xp: 35 },
      { title: "Shadow for 10 focused minutes", desc: "Copy rhythm, pause control, and confidence from a strong speaker.", type: "side", priority: "normal", xp: 20 },
      { title: "Push one social action further", desc: "Repeat the same confidence task with slightly more exposure than last time.", type: "main", priority: "normal", xp: 30 },
    ],
  };
  return base[stat] || [
    { title: `${label} next step`, desc: "Take the latest progress and turn it into one visible next action.", type: "main", priority: "normal", xp: 30 },
  ];
}
function rosayeNormalizedQuestShape(stat, quest) {
  const type = ["side", "main", "boss"].includes(quest?.type) ? quest.type : "main";
  const priority = ["urgent", "high", "normal", "low"].includes(quest?.priority) ? quest.priority : "normal";
  const xpByType = { side: 20, main: 35, boss: 60 };
  return {
    stat,
    title: quest?.title || "Next quest",
    desc: quest?.desc || "Turn the current context into one concrete next step.",
    type,
    priority,
    xp: xpByType[type],
  };
}
function rosayeGuessStatFromText(text) {
  const lower = (text || "").toLowerCase();
  if (/(run|running|workout|gym|stretch|mobility|pushup|bench|lift)/.test(lower)) return "strength";
  if (/(edit|video|shot|storyboard|draw|design|creative|film|motion|template|virtuolab|sukoon)/.test(lower)) return "creativity";
  if (/(study|assignment|exam|learn|revise|revision|chapter|code|oop|os|coa|ada)/.test(lower)) return "intelligence";
  if (/(english|discord|conversation|speak|shadow|mirror|confidence|persona|social)/.test(lower)) return "persona";
  return "creativity";
}
function rosayeParseDeployQuests(message) {
  const text = (message || "").trim();
  if (!/^deploy\b/i.test(text)) return [];
  const body = text.replace(/^deploy\b[:\- ]*/i, "").trim();
  if (!body) return [];
  const split = body
    .split(/\n+/)
    .flatMap(line => line.split(/(?=\d+\.)/g))
    .map(part => part.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
  const items = split.length ? split : [body];
  return items.map((item, index) => {
    const stat = rosayeGuessStatFromText(item);
    const lower = item.toLowerCase();
    const isDaily = /\bdaily\b|\beach day\b|\bevery day\b/.test(lower);
    const type = isDaily ? "side" : "main";
    return {
      id: `ra_deploy_${Date.now()}_${index}`,
      ...rosayeNormalizedQuestShape(stat, {
        title: item.replace(/\bdaily\b/ig, "").replace(/\beach day\b/ig, "").replace(/\bevery day\b/ig, "").trim().replace(/\s+/g, " "),
        desc: isDaily ? "Directly deployed by Rosaye as a repeating quest from your instruction." : "Directly deployed by Rosaye from your instruction.",
        type,
        priority: "normal",
      }),
      isDaily,
    };
  });
}
async function rosayeQuestAssist(config, memory, recentMessages, prompt, mode, stat, payload = {}) {
  if (config.apiKey.trim()) {
    try {
      const system = mode === "next"
        ? "You are Rosaye, the adaptive quest brain for Life RPG. Generate the ONE most logical next quest after the user's update. Return ONLY valid JSON object with keys title, desc, type, priority, xp."
        : "You are Rosaye, the adaptive quest brain for Life RPG. Generate exactly 3 specific quests. Return ONLY valid JSON array. Each object must have title, desc, type, priority, xp.";
      let request;
      const userPayload = JSON.stringify({ prompt, memory, recent_messages: recentMessages.slice(-6), payload });
      request = {
        url: "/api/rosaye",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: config.model || rosayeProviderModel("groq"),
            temperature: 0.45,
            messages: [{ role: "system", content: system }, { role: "user", content: userPayload }],
          }),
        },
        parse: async res => {
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        },
      };
      const res = await fetch(request.url, request.options);
      const raw = await request.parse(res);
      const clean = rosayeJsonFromText(raw);
      return JSON.parse(clean);
    } catch (e) {
      console.error(e);
    }
  }
  return rosayeQuestFallback(stat, mode, payload);
}

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
function localDateKey(dateLike = new Date()) {
  const d = new Date(dateLike);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function addDays(dateLike, days) {
  const d = new Date(dateLike);
  d.setDate(d.getDate() + days);
  return d;
}
function getDeadlineWindowDays(deadline, base = new Date()) {
  if (!deadline) return null;
  return Math.max(1, daysUntil(deadline, base) || 0);
}
function attachDeadlineWindow(q, base = new Date()) {
  const deadline = normalizeDateInput(q.deadline || "");
  const deadlineWindowDays = deadline
    ? Number(q.deadlineWindowDays) || getDeadlineWindowDays(deadline, base)
    : null;
  return {
    ...q,
    deadline,
    deadlineWindowDays,
  };
}
function rwPool(list, count) {
  const copy = [...list];
  const out = [];
  while (copy.length && out.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(index, 1)[0]);
  }
  return out;
}
function rwShopCandidates(library) {
  return library.filter(item => item.enabled && item.shopEligible);
}
function rwWheelCandidates(library, tier) {
  return library.filter(item => item.enabled && item.wheelEligible && item.tiers.includes(tier));
}
function rwBuildPools(library) {
  return {
    shop: rwPool(rwShopCandidates(library).map(item => item.id), 6),
    wheel: {
      basic: rwPool(rwWheelCandidates(library, "basic").map(item => item.id), RW_WHEEL_CONFIG.basic.poolSize),
      silver: rwPool(rwWheelCandidates(library, "silver").map(item => item.id), RW_WHEEL_CONFIG.silver.poolSize),
      gold: rwPool(rwWheelCandidates(library, "gold").map(item => item.id), RW_WHEEL_CONFIG.gold.poolSize),
    },
  };
}
function rwRewardTokenKey(id) {
  return `reward_${id}`;
}
function rwInventoryCount(inventory, key) {
  return inventory[key] || 0;
}
function rwWeightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}
function rwWheelColors() {
  return ["#f4c74f", "#ef8f38", "#4d9bf3", "#9b6df4", "#43c27a", "#e45555", "#3cc1bf", "#f06f9b"];
}
function rwBuildWheelSlices(tier, rewardPool) {
  const cfg = RW_WHEEL_CONFIG[tier];
  const rewardWeight = tier === "basic" ? 45 : tier === "silver" ? 50 : 70;
  const colors = rwWheelColors();
  const staticSlices = cfg.staticSlots.map((slot, index) => ({ ...slot, color: colors[index % colors.length] }));
  const rewardSlices = rewardPool.map((item, index) => ({
    id: `reward_${item.id}`,
    label: item.name,
    kind: "reward",
    rewardId: item.id,
    weight: rewardPool.length ? rewardWeight / rewardPool.length : 0,
    color: colors[(index + staticSlices.length) % colors.length],
  }));
  return [...staticSlices, ...rewardSlices].filter(item => item.weight > 0);
}
function rwAddHistory(history, title, meta) {
  return [{ id: Date.now() + Math.random(), title, meta, at: new Date().toLocaleString() }, ...history].slice(0, 30);
}
function deriveStreakFromQuests(quests, base = new Date()) {
  const doneDays = new Set(
    quests
      .filter(q => q.completedAt)
      .map(q => localDateKey(q.completedAt))
  );
  let streak = 0;
  let cursor = dateOnly(base);
  while (doneDays.has(localDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
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
  const quests = Array.isArray(raw.quests)
    ? raw.quests.map(q => ({
      ...attachDeadlineWindow(q, `${APP_TODAY}T00:00:00`),
      completedAt: q.completedAt || null,
      coinReward: Number(q.coinReward) || 0,
      isDaily: !!q.isDaily,
      isFinalBoss: !!q.isFinalBoss,
    }))
    : [];
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
    coins: Number(raw.coins) || 0,
    rosayeConfig: { ...ROSAYE_DEFAULT_CONFIG, ...(raw.rosayeConfig || {}) },
    rosayeMemory: rosayeMergeMemory(rosayeDefaultMemory(), raw.rosayeMemory || {}),
    rosayeMessages: Array.isArray(raw.rosayeMessages) ? raw.rosayeMessages : [],
    rosayeSuggestions: Array.isArray(raw.rosayeSuggestions) && raw.rosayeSuggestions.length ? raw.rosayeSuggestions : rosayeDefaultSuggestions(),
    rewardInventory: raw.rewardInventory && typeof raw.rewardInventory === "object" ? raw.rewardInventory : {},
    rewardLibrary: Array.isArray(raw.rewardLibrary) && raw.rewardLibrary.length ? raw.rewardLibrary : RW_DEFAULT_LIBRARY,
    rewardLocked: !!raw.rewardLocked,
    rewardPools: raw.rewardPools || rwBuildPools(Array.isArray(raw.rewardLibrary) && raw.rewardLibrary.length ? raw.rewardLibrary : RW_DEFAULT_LIBRARY),
    rewardHistory: Array.isArray(raw.rewardHistory) ? raw.rewardHistory : [],
    rewardResult: raw.rewardResult || null,
    questBoostReady: !!raw.questBoostReady,
    streak: hadLegacyDates || totalDone === 0 || totalXP === 0 ? 0 : deriveStreakFromQuests(quests),
    levelDeadline: raw.levelDeadline?.startsWith?.("2025-") ? LEVEL_1_DEFAULT_DEADLINE : (raw.levelDeadline || LEVEL_1_DEFAULT_DEADLINE),
  };
}
function calcLevelTargetXP(quests) {
  const levelQuests = quests.filter(q => !q.isDaily && !q.isFinalBoss);
  const questCountTarget = Math.max(MIN_LEVEL_QUEST_TARGET, levelQuests.length);
  const baseXP = levelQuests.reduce((sum, q) => sum + (Number(q.xp) || 0), 0);
  const missing = Math.max(0, questCountTarget - levelQuests.length);
  return {
    questCountTarget,
    baseXP,
    totalTargetXP: baseXP + missing * BASE_TARGET_XP_PER_QUEST,
  };
}

// ── LEVEL 1 COMPLETION SYSTEM ────────────────────────────────────────────────
const LEVEL1_XP_RATIO = 0.80;
const LEVEL1_STREAK_DAYS = 7;
// Kept for legacy references; no longer used for unlock prereqs.
const LEVEL1_BOSS_STATS = ["strength", "creativity", "intelligence", "persona"];
function checkLevel1Complete(quests, streak = 0) {
  const scoringQuests = quests.filter(q => !q.isDaily);
  const totalPossibleXP = scoringQuests.reduce((s, q) => s + (Number(q.xp) || 0), 0);
  const earnedXP = scoringQuests
    .filter(q => q.done)
    .reduce((s, q) => s + (Number(q.xp) || 0), 0);
  const level1Target = totalPossibleXP * LEVEL1_XP_RATIO;
  const xpMet = totalPossibleXP > 0 && earnedXP >= level1Target;
  const streakMet = (Number(streak) || 0) >= LEVEL1_STREAK_DAYS;
  const finalBossQuest = quests.find(q => q.isFinalBoss || q.type === "finalBoss");
  const finalBossMet = !!finalBossQuest?.done;
  // Final Boss unlocks when EITHER 7-day streak OR 80% XP completed.
  const prereqsMet = xpMet || streakMet;
  return {
    complete: prereqsMet && finalBossMet,
    xpMet,
    streakMet,
    streak: Number(streak) || 0,
    streakTarget: LEVEL1_STREAK_DAYS,
    finalBossMet,
    prereqsMet,
    finalBossQuest,
    progress: totalPossibleXP > 0 ? Math.min((earnedXP / Math.max(1, level1Target)) * 100, 100) : 0,
    earnedXP,
    totalPossibleXP,
    level1Target: Math.round(level1Target),
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
  const rewardSeedLibrary = useRef(saved.current?.rewardLibrary || RW_DEFAULT_LIBRARY).current;
  const rewardSeedPools = useRef(saved.current?.rewardPools || rwBuildPools(rewardSeedLibrary)).current;

  // ONBOARDING STATE
  const [onboarding, setOnboarding] = useState(isNew);
  const [selectedIds, setSelectedIds] = useState(() =>
    isNew ? new Set(QUEST_POOL.map(q => q.id)) : new Set()
  );

  // MAIN APP STATE — restored from localStorage or zero
  const [quests, setQuests] = useState(() => saved.current?.quests || []);
  const [statXP, setStatXP] = useState(() => saved.current?.statXP || { strength: 0, creativity: 0, intelligence: 0, persona: 0 });
  const [coins, setCoins] = useState(() => saved.current?.coins || 0);
  const [rosayeConfig, setRosayeConfig] = useState(() => saved.current?.rosayeConfig || ROSAYE_DEFAULT_CONFIG);
  const [rosayeMemory, setRosayeMemory] = useState(() => saved.current?.rosayeMemory || rosayeDefaultMemory());
  const [rosayeMessages, setRosayeMessages] = useState(() => saved.current?.rosayeMessages || []);
  const [rosayeSuggestions, setRosayeSuggestions] = useState(() => saved.current?.rosayeSuggestions || rosayeDefaultSuggestions());
  const [rosayeInput, setRosayeInput] = useState("");
  const [rosayeLoading, setRosayeLoading] = useState(false);
  const [rosayeCyclingId, setRosayeCyclingId] = useState(null);
  const [rewardInventory, setRewardInventory] = useState(() => saved.current?.rewardInventory || {});
  const [rewardLibrary, setRewardLibrary] = useState(() => rewardSeedLibrary);
  const [rewardLocked, setRewardLocked] = useState(() => saved.current?.rewardLocked || false);
  const [rewardActiveShopIds, setRewardActiveShopIds] = useState(() => rewardSeedPools.shop);
  const [rewardWheelPools, setRewardWheelPools] = useState(() => rewardSeedPools.wheel);
  const [rewardHistory, setRewardHistory] = useState(() => saved.current?.rewardHistory || []);
  const [rewardResult, setRewardResult] = useState(() => saved.current?.rewardResult || null);
  const [rewardTab, setRewardTab] = useState("wheel");
  const [rewardSpinTier, setRewardSpinTier] = useState("basic");
  const [rewardWheelRotation, setRewardWheelRotation] = useState(0);
  const [rewardSpinning, setRewardSpinning] = useState(false);
  const [rewardToast, setRewardToast] = useState(null);
  const [newReward, setNewReward] = useState(rwBlankReward);
  const [questBoostReady, setQuestBoostReady] = useState(() => saved.current?.questBoostReady || false);
  const [cheatRewardId, setCheatRewardId] = useState(() => rewardSeedLibrary[0]?.id || "");
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
  const [newQ, setNewQ] = useState({ title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "", isDaily: false });
  const [showBoardAdd, setShowBoardAdd] = useState(false);
  const [boardQ, setBoardQ] = useState({ stat: "strength", title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "", isDaily: false });
  const [nowMs, setNowMs] = useState(seededNow);
  const oracle = useRef(ORACLES[Math.floor(Math.random() * ORACLES.length)]).current;
  const [carryReview, setCarryReview] = useState(false);
  const [carryDecisions, setCarryDecisions] = useState({});
  const [archivedQuests, setArchivedQuests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("liferpg_archived_quests") || "[]"); } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("liferpg_archived_quests", JSON.stringify(archivedQuests)); } catch {}
  }, [archivedQuests]);
  function applyCarryReview() {
    const incomplete = quests.filter(q => !q.done && !q.isFinalBoss);
    const toArchive = [];
    const toDrop = new Set();
    const toCarry = new Set();
    incomplete.forEach(q => {
      const d = carryDecisions[q.id] || "carry";
      if (d === "archive") { toArchive.push({ ...q, archivedAt: new Date().toISOString(), fromLevel: 1 }); toDrop.add(q.id); }
      else if (d === "drop") { toDrop.add(q.id); }
      else { toCarry.add(q.id); }
    });
    setArchivedQuests(a => [...a, ...toArchive]);
    setQuests(qs => qs
      .filter(q => !toDrop.has(q.id))
      .map(q => toCarry.has(q.id) ? { ...q, carriedFromLevel: 1 } : q)
    );
    setCarryReview(false);
    setCarryDecisions({});
    setToast({ e: "🎯", m: "Level 2 unlocked. Quests reviewed.", xp: 0 });
    setTimeout(() => setToast(null), 2800);
  }

  // PERSIST on every change
  useEffect(() => {
    if (!onboarding) saveState({
      quests,
      statXP,
      coins,
      rosayeConfig,
      rosayeMemory,
      rosayeMessages,
      rosayeSuggestions,
      rewardInventory,
      rewardLibrary,
      rewardLocked,
      rewardPools: { shop: rewardActiveShopIds, wheel: rewardWheelPools },
      rewardHistory,
      rewardResult,
      questBoostReady,
      streak,
      levelDeadline,
    });
  }, [quests, statXP, coins, rosayeConfig, rosayeMemory, rosayeMessages, rosayeSuggestions, rewardInventory, rewardLibrary, rewardLocked, rewardActiveShopIds, rewardWheelPools, rewardHistory, rewardResult, questBoostReady, streak, onboarding, levelDeadline]);

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

  useEffect(() => {
    const computed = deriveStreakFromQuests(quests);
    if (computed !== streak) setStreak(computed);
  }, [quests, streak, nowMs]);

  useEffect(() => {
    const todayKey = localDateKey();
    setQuests(current => {
      let changed = false;
      const next = current.map(q => {
        if (!q.isDaily || !q.done || !q.completedAt) return q;
        if (localDateKey(q.completedAt) === todayKey) return q;
        changed = true;
        return { ...q, done: false, coinReward: 0 };
      });
      return changed ? next : current;
    });
  }, [nowMs]);

  const rewardLibraryMap = useMemo(() => Object.fromEntries(rewardLibrary.map(item => [item.id, item])), [rewardLibrary]);
  const rewardActiveShop = useMemo(() => rewardActiveShopIds.map(id => rewardLibraryMap[id]).filter(Boolean), [rewardActiveShopIds, rewardLibraryMap]);
  const rewardActiveShopTokens = useMemo(() => rewardActiveShop.filter(item => item.rewardType === "token"), [rewardActiveShop]);
  const rewardActiveShopItems = useMemo(() => rewardActiveShop.filter(item => item.rewardType === "item"), [rewardActiveShop]);
  const rewardActiveWheel = useMemo(() => ({
    basic: (rewardWheelPools.basic || []).map(id => rewardLibraryMap[id]).filter(Boolean),
    silver: (rewardWheelPools.silver || []).map(id => rewardLibraryMap[id]).filter(Boolean),
    gold: (rewardWheelPools.gold || []).map(id => rewardLibraryMap[id]).filter(Boolean),
  }), [rewardWheelPools, rewardLibraryMap]);
  const rewardWheelSlices = useMemo(() => ({
    basic: rwBuildWheelSlices("basic", rewardActiveWheel.basic || []),
    silver: rwBuildWheelSlices("silver", rewardActiveWheel.silver || []),
    gold: rwBuildWheelSlices("gold", rewardActiveWheel.gold || []),
  }), [rewardActiveWheel]);
  const rewardInventoryTotal = useMemo(() => Object.values(rewardInventory).reduce((sum, count) => sum + count, 0), [rewardInventory]);

  useEffect(() => {
    if (!cheatRewardId && rewardLibrary[0]?.id) setCheatRewardId(rewardLibrary[0].id);
    if (cheatRewardId && !rewardLibraryMap[cheatRewardId] && rewardLibrary[0]?.id) setCheatRewardId(rewardLibrary[0].id);
  }, [cheatRewardId, rewardLibrary, rewardLibraryMap]);

  function rewardShowToast(title, body) {
    setRewardToast({ title, body });
    setTimeout(() => setRewardToast(null), 2600);
  }

  function rewardAddInventory(key, amount = 1) {
    setRewardInventory(current => ({ ...current, [key]: (current[key] || 0) + amount }));
  }

  function rewardSpendCoins(cost) {
    if (coins < cost) return false;
    setCoins(current => Math.round(current - cost));
    return true;
  }

  function rewardRebuildPools(nextLibrary, mode = "all") {
    const pools = rwBuildPools(nextLibrary);
    if (mode === "all" || mode === "shop") setRewardActiveShopIds(pools.shop);
    if (mode === "all" || mode === "wheel") setRewardWheelPools(pools.wheel);
  }

  function rewardInjectItemIntoLivePools(item) {
    if (item.shopEligible) {
      setRewardActiveShopIds(current => current.includes(item.id) ? current : [item.id, ...current].slice(0, 6));
    }
    if (item.wheelEligible) {
      setRewardWheelPools(current => {
        const next = { ...current };
        item.tiers.forEach(tier => {
          const limit = RW_WHEEL_CONFIG[tier]?.poolSize || 0;
          const existing = next[tier] || [];
          next[tier] = existing.includes(item.id) ? existing : [item.id, ...existing].slice(0, limit);
        });
        return next;
      });
    }
  }

  function rewardLockEconomy() {
    setRewardLocked(true);
    rewardShowToast("Economy Locked", "Rewards are now frozen. Use refresh costs to rotate live pools.");
    setRewardHistory(current => rwAddHistory(current, "Reward economy locked", "Library edits are now frozen until reset."));
  }

  function rewardRefreshShop(free = !rewardLocked) {
    if (!free && !rewardSpendCoins(RW_SHOP_REFRESH_COST)) return;
    setRewardActiveShopIds(rwPool(rwShopCandidates(rewardLibrary).map(item => item.id), 6));
    setRewardHistory(current => rwAddHistory(current, free ? "Shop regenerated" : "Shop refreshed", free ? "Free refresh before lock." : `-${RW_SHOP_REFRESH_COST} coins to rotate active shop rewards.`));
  }

  function rewardRefreshWheel(free = !rewardLocked) {
    if (!free && !rewardSpendCoins(RW_WHEEL_REFRESH_COST)) return;
    setRewardWheelPools({
      basic: rwPool(rwWheelCandidates(rewardLibrary, "basic").map(item => item.id), RW_WHEEL_CONFIG.basic.poolSize),
      silver: rwPool(rwWheelCandidates(rewardLibrary, "silver").map(item => item.id), RW_WHEEL_CONFIG.silver.poolSize),
      gold: rwPool(rwWheelCandidates(rewardLibrary, "gold").map(item => item.id), RW_WHEEL_CONFIG.gold.poolSize),
    });
    setRewardHistory(current => rwAddHistory(current, free ? "Wheel pools regenerated" : "Wheel pools refreshed", free ? "Free refresh before lock." : `-${RW_WHEEL_REFRESH_COST} coins to rotate wheel rewards.`));
  }

  function rewardRefreshAll() {
    if (rewardLocked && !rewardSpendCoins(RW_FULL_REFRESH_COST)) return;
    rewardRebuildPools(rewardLibrary, "all");
    setRewardHistory(current => rwAddHistory(current, rewardLocked ? "Full reward refresh" : "Free reward regeneration", rewardLocked ? `-${RW_FULL_REFRESH_COST} coins to reroll shop and wheel pools.` : "Free refresh before lock."));
  }

  function rewardAddReward() {
    if (rewardLocked || !newReward.name.trim()) return;
    const item = {
      ...newReward,
      id: `rw_${Date.now()}`,
      cost: parseInt(newReward.cost, 10) || 0,
      emoji: (newReward.emoji || "RW").slice(0, 3),
      tiers: newReward.wheelEligible ? newReward.tiers : [],
    };
    const nextLibrary = [...rewardLibrary, item];
    setRewardLibrary(nextLibrary);
    rewardInjectItemIntoLivePools(item);
    setNewReward(rwBlankReward());
    rewardShowToast("Reward Added", `${item.name} is now in your live reward library.`);
    setRewardHistory(current => rwAddHistory(current, `Added reward: ${item.name}`, `${item.rewardType === "item" ? "Item" : "Token"} added to reward library.`));
  }

  function rewardUpdateItem(id, key, value) {
    if (rewardLocked) return;
    const nextLibrary = rewardLibrary.map(item => {
      if (item.id !== id) return item;
      const nextItem = { ...item, [key]: value };
      if (key === "wheelEligible" && !value) nextItem.tiers = [];
      return nextItem;
    });
    setRewardLibrary(nextLibrary);
    if (["enabled", "shopEligible", "wheelEligible"].includes(key)) rewardRebuildPools(nextLibrary, "all");
  }

  function rewardToggleTier(id, tier) {
    if (rewardLocked) return;
    const nextLibrary = rewardLibrary.map(item => item.id === id ? {
      ...item,
      tiers: item.tiers.includes(tier) ? item.tiers.filter(value => value !== tier) : [...item.tiers, tier],
    } : item);
    setRewardLibrary(nextLibrary);
    rewardRebuildPools(nextLibrary, "all");
  }

  function rewardRemoveItem(id) {
    if (rewardLocked) return;
    const nextLibrary = rewardLibrary.filter(item => item.id !== id);
    setRewardLibrary(nextLibrary);
    rewardRebuildPools(nextLibrary, "all");
    setRewardInventory(current => {
      const next = { ...current };
      delete next[rwRewardTokenKey(id)];
      return next;
    });
  }

  function rewardBuy(item) {
    if (!rewardSpendCoins(item.cost)) return;
    rewardAddInventory(rwRewardTokenKey(item.id));
    rewardShowToast("Reward Purchased", `${item.name} was added to your inventory.`);
    setRewardResult({ title: "Reward token purchased", body: `${item.name} is now stored in inventory. Use it later when you actually want it.` });
    setRewardHistory(current => rwAddHistory(current, `Bought ${item.name}`, `-${item.cost} coins. Token added to inventory.`));
  }

  function rewardUse(item) {
    const key = rwRewardTokenKey(item.id);
    if (!rwInventoryCount(rewardInventory, key)) return;
    setRewardInventory(current => {
      const next = { ...current, [key]: current[key] - 1 };
      if (next[key] <= 0) delete next[key];
      return next;
    });
    rewardShowToast(item.rewardType === "item" ? "Item Claimed" : "Token Used", `${item.name} is cleared for guilt-free use.`);
    setRewardResult({ title: "Reward used cleanly", body: `${item.name} was consumed from inventory. The boundary stays honest because access follows the token, not impulse.` });
    setRewardHistory(current => rwAddHistory(current, `Used ${item.name}`, "Token consumed. Access granted guilt-free."));
  }

  function rewardUseBoostToken() {
    const key = "boost_double_next_quest";
    if (!rwInventoryCount(rewardInventory, key) || questBoostReady) return;
    setRewardInventory(current => {
      const next = { ...current, [key]: current[key] - 1 };
      if (next[key] <= 0) delete next[key];
      return next;
    });
    setQuestBoostReady(true);
    rewardShowToast("Boost Armed", "Your next completed quest will give double coins.");
    setRewardHistory(current => rwAddHistory(current, "Quest boost armed", "Your next quest payout will be doubled."));
  }

  function rewardLogCheat() {
    const item = rewardLibraryMap[cheatRewardId];
    if (!item) return;
    setCoins(current => Math.round(current - item.cost));
    rewardShowToast("Debt Applied", `${item.name} was logged without payment. Your balance just took the hit.`);
    setRewardResult({ title: "Cheat logged", body: `${item.name} was accessed without a token. The debt is now real, so the economy stays honest.` });
    setRewardHistory(current => rwAddHistory(current, `Cheat logged: ${item.name}`, `-${item.cost} coins charged as debt.`));
  }

  function rewardApplyWheelResult(picked, tier, freeSpin = false) {
    const cfg = RW_WHEEL_CONFIG[tier];
    if (picked.kind === "reward") {
      const reward = rewardLibraryMap[picked.rewardId];
      if (!reward) return;
      rewardAddInventory(rwRewardTokenKey(reward.id));
      rewardShowToast("Congratulations", `You got ${reward.name}`);
      setRewardResult({ title: `${cfg.label} reward`, body: `${reward.name} was added to inventory as a token. You do not have to use it immediately.` });
      setRewardHistory(current => rwAddHistory(current, `${cfg.label} spun`, `Won token: ${reward.name}${freeSpin ? " on free spin." : "."}`));
      return;
    }
    if (picked.kind === "coins") {
      setCoins(current => Math.round(current + picked.coins));
      rewardShowToast("Coin Win", `You got ${picked.coins} bonus coins`);
      setRewardResult({ title: `${cfg.label} bonus`, body: `You landed on ${picked.label} and immediately gained ${picked.coins} coins.` });
      setRewardHistory(current => rwAddHistory(current, `${cfg.label} spun`, `Won ${picked.coins} bonus coins${freeSpin ? " on free spin." : "."}`));
      return;
    }
    if (picked.kind === "boost") {
      rewardAddInventory("boost_double_next_quest");
      rewardShowToast("Congratulations", "You got a Double Coins Next Quest token");
      setRewardResult({ title: `${cfg.label} boost`, body: `You won a Double Coins Next Quest token. Arm it from inventory whenever you want.` });
      setRewardHistory(current => rwAddHistory(current, `${cfg.label} spun`, "Won a Double Coins Next Quest token."));
      return;
    }
    if (picked.kind === "mystery") {
      const mysteryCoins = [12, 15, 18][Math.floor(Math.random() * 3)];
      setCoins(current => Math.round(current + mysteryCoins));
      rewardShowToast("Mystery Bonus", `You got ${mysteryCoins} coins`);
      setRewardResult({ title: "Mystery Bonus", body: `Silver wheel mystery landed. You picked up ${mysteryCoins} bonus coins.` });
      setRewardHistory(current => rwAddHistory(current, "Silver wheel mystery", `Mystery bonus paid ${mysteryCoins} coins.`));
      return;
    }
    if (picked.kind === "jackpot") {
      rewardShowToast("Jackpot", "Free Gold re-spin unlocked");
      setRewardResult({ title: "Jackpot Re-spin", body: "Gold wheel hit the jackpot slot. The wheel spins again for free right now." });
      setRewardHistory(current => rwAddHistory(current, "Gold wheel jackpot", "Free re-spin triggered."));
      setTimeout(() => rewardSpinWheel("gold", true), 500);
      return;
    }
    setRewardResult({ title: `${cfg.label} miss`, body: "Nothing this time. That empty slot is intentional so the wins keep their tension." });
    setRewardHistory(current => rwAddHistory(current, `${cfg.label} spun`, `Landed on nothing${freeSpin ? " on free spin." : "."}`));
  }

  function rewardSpinWheel(tier, freeSpin = false) {
    const cfg = RW_WHEEL_CONFIG[tier];
    const slices = rewardWheelSlices[tier] || [];
    if (rewardSpinning || !slices.length) return;
    if (!freeSpin && coins < cfg.cost) return;
    if (!freeSpin) setCoins(current => Math.round(current - cfg.cost));
    const picked = rwWeightedPick(slices);
    const targetIndex = Math.max(0, slices.findIndex(slice =>
      slice.kind === picked.kind &&
      ((slice.rewardId && slice.rewardId === picked.rewardId) || (!slice.rewardId && slice.id === picked.id))
    ));
    const sliceAngle = 360 / slices.length;
    const targetCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const landingAngle = 360 - targetCenter;
    const currentMod = ((rewardWheelRotation % 360) + 360) % 360;
    const delta = ((landingAngle - currentMod) + 360) % 360;
    const nextRotation = rewardWheelRotation + 360 * 5 + delta;
    setRewardSpinning(true);
    setRewardSpinTier(tier);
    setRewardWheelRotation(nextRotation);
    setTimeout(() => {
      setRewardSpinning(false);
      rewardApplyWheelResult(picked, tier, freeSpin);
    }, 2800);
  }

  // ── ONBOARDING ────────────────────────────────────────────────────────────
  async function rosayeSubmit() {
    const message = rosayeInput.trim();
    if (!message || rosayeLoading) return;
    const deployQuests = rosayeParseDeployQuests(message);
    const userMessage = { id: `user_${Date.now()}`, role: "user", text: message, at: new Date().toLocaleTimeString() };
    const inferredUpdates = rosayeInferMemory(message, rosayeMemory);
    const mergedMemory = rosayeMergeMemory(rosayeMemory, inferredUpdates);
    setRosayeMessages(current => [...current, userMessage]);
    setRosayeMemory(mergedMemory);
    setRosayeInput("");
    if (deployQuests.length) {
      setQuests(current => [
        ...current,
        ...deployQuests.map(q => attachDeadlineWindow({
          ...q,
          deadline: null,
          done: false,
          isFinalBoss: false,
          coinReward: 0,
          completedAt: null,
        })),
      ]);
      setRosayeMessages(current => [...current, {
        id: `ai_${Date.now()}`,
        role: "ai",
        text: `Deployed ${deployQuests.length} quest${deployQuests.length > 1 ? "s" : ""} directly into your board.`,
        at: new Date().toLocaleTimeString(),
      }]);
      setToast({ e: "🧠", m: `Deployed ${deployQuests.length} quest${deployQuests.length > 1 ? "s" : ""}.`, xp: 0 });
      setTimeout(() => setToast(null), 2200);
      return;
    }
    setRosayeLoading(true);

    let replyPayload = null;
    if (rosayeConfig.apiKey.trim()) {
      try {
        const request = rosayeBuildApiRequest(rosayeConfig, message, mergedMemory, rosayeMessages);
        const res = await fetch(request.url, request.options);
        const raw = await request.parse(res);
        const parsed = JSON.parse(rosayeJsonFromText(raw));
        replyPayload = {
          reply: parsed.reply,
          memory_updates: parsed.memory_updates || {},
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        };
      } catch (e) {
        console.error(e);
      }
    }
    if (!replyPayload) {
      const fallback = rosayeHeuristicResponse(message, mergedMemory);
      replyPayload = {
        reply: fallback.reply,
        memory_updates: inferredUpdates,
        suggestions: fallback.suggestions,
      };
    }

    const finalMemory = rosayeMergeMemory(mergedMemory, replyPayload.memory_updates || {});
    const aiMessage = {
      id: `ai_${Date.now()}`,
      role: "ai",
      text: replyPayload.reply || "Logged. Progress stored and next steps prepared.",
      at: new Date().toLocaleTimeString(),
    };
    setRosayeMemory(finalMemory);
    setRosayeSuggestions(
      (replyPayload.suggestions || []).map((item, index) => ({
        id: item.id || `ra_s_${Date.now()}_${index}`,
        ...rosayeNormalizedQuestShape(STATS.includes(item.stat) ? item.stat : "creativity", item),
      }))
    );
    setRosayeMessages(current => [...current, aiMessage]);
    setRosayeLoading(false);
  }

  async function rosayeAddSuggestion(suggestion) {
    setQuests(current => [...current, attachDeadlineWindow({
      id: `ra_q_${Date.now()}_${Math.random()}`,
      ...rosayeNormalizedQuestShape(suggestion.stat, suggestion),
      deadline: null,
      done: false,
      isDaily: false,
      isFinalBoss: false,
      coinReward: 0,
      completedAt: null,
    })]);
    await rosayeCycleSuggestion(suggestion, true);
    setToast({ e: "🧠", m: "Rosaye quest added.", xp: 0 });
    setTimeout(() => setToast(null), 2000);
  }

  async function rosayeCycleSuggestion(suggestion, silent = false) {
    if (rosayeCyclingId && !silent) return;
    setRosayeCyclingId(suggestion.id);
    try {
      const prompt = `Current stat: ${STAT_CFG[suggestion.stat]?.label}\nCurrent suggestion: ${suggestion.title}\nDescription: ${suggestion.desc}\nGenerate a different next quest for the same context. Do not repeat the same idea.`;
      const parsed = await rosayeQuestAssist(
        rosayeConfig,
        rosayeMemory,
        rosayeMessages,
        prompt,
        "next",
        suggestion.stat,
        { avoid: [suggestion.title], currentSuggestion: suggestion }
      );
      const replacement = {
        id: `ra_s_${Date.now()}_${Math.random()}`,
        ...rosayeNormalizedQuestShape(suggestion.stat, parsed),
      };
      setRosayeSuggestions(current => current.map(item => item.id === suggestion.id ? replacement : item));
    } catch (e) {
      console.error(e);
    }
    setRosayeCyclingId(null);
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function confirmQuests() {
    const chosen = QUEST_POOL
      .filter(q => selectedIds.has(q.id))
      .map(q => attachDeadlineWindow({ ...q, isDaily: false, isFinalBoss: false }, `${APP_TODAY}T00:00:00`));
    setQuests(chosen);
    setStatXP({ strength: 0, creativity: 0, intelligence: 0, persona: 0 });
    setCoins(0);
    setStreak(0);
    setLevelDeadline(LEVEL_1_DEFAULT_DEADLINE);
    setOnboarding(false);
  }

  // ── QUEST ACTIONS ────────────────────────────────────────────────────────
  function requestCompleteQuest(q) {
    if (q.done) return;
    if (q.isFinalBoss || q.type === "finalBoss") {
      const status = checkLevel1Complete(quests, streak);
      if (!status.prereqsMet) {
        setToast({
          e: "🔒",
          m: `Final Boss locked. Reach ${LEVEL1_STREAK_DAYS}-day streak (${status.streak}/${LEVEL1_STREAK_DAYS}) or 80% XP (${status.earnedXP}/${status.level1Target}).`,
          xp: 0,
        });
        setTimeout(() => setToast(null), 3600);
        return;
      }
    }
    setPendingComplete(q);
  }

  function completeQuest(q) {
    if (q.done) return;
    const prevXP = statXP[q.stat];
    const prevLv = getLvInfo(prevXP).level;
    const newXP = prevXP + q.xp;
    const newLv = getLvInfo(newXP).level;
    const earnedCoins = (COINS_BY_TYPE[q.type] || 0) * (questBoostReady ? 2 : 1);
    const completedAt = new Date().toISOString();

    setQuests(qs => qs.map(x => x.id === q.id ? { ...x, done: true, coinReward: earnedCoins, completedAt } : x));
    setStatXP(p => ({ ...p, [q.stat]: p[q.stat] + q.xp }));
    setCoins(c => c + earnedCoins);
    if (questBoostReady) {
      setQuestBoostReady(false);
      setRewardHistory(current => rwAddHistory(current, "Quest boost consumed", `Double coin token used on "${q.title}".`));
    }

    const r = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    setToast({ ...r, xp: q.xp, coins: earnedCoins });
    setTimeout(() => setToast(null), 2800);

    if (newLv > prevLv) setTimeout(() => setLevelUp({ stat: q.stat, level: newLv }), 900);
    if (q.isFinalBoss) {
      setToast({ e: "👑", m: "Final Boss cleared. Level gate unlocked.", xp: q.xp, coins: earnedCoins });
      setTimeout(() => setToast(null), 3000);
    }
  }

  function confirmCompleteQuest() {
    if (!pendingComplete) return;
    completeQuest(pendingComplete);
    setPendingComplete(null);
  }

  function undoQuest(q) {
    if (!q.done) return;
    const earnedCoins = q.coinReward ?? (COINS_BY_TYPE[q.type] || 0);
    setQuests(qs => qs.map(x => x.id === q.id ? { ...x, done: false, coinReward: 0, completedAt: null } : x));
    setStatXP(p => ({ ...p, [q.stat]: Math.max(0, p[q.stat] - q.xp) }));
    setCoins(c => Math.max(0, c - earnedCoins));
    setLevelUp(null);
    setToast({ e: "↩", m: "Quest reopened.", xp: -q.xp, coins: -earnedCoins });
    setTimeout(() => setToast(null), 2200);
  }

  function openEdit(q) {
    if (editingId === q.id) { setEditingId(null); setAiSuggestion(null); return; }
    setEditingId(q.id);
    setEditForm({ title: q.title, desc: q.desc || "", type: q.type, priority: q.priority, xp: q.xp, deadline: q.deadline || "" });
    setAiSuggestion(null);
  }

  async function saveEdit(q) {
    const updated = attachDeadlineWindow({ ...q, ...editForm, xp: parseInt(editForm.xp) || q.xp });
    setQuests(qs => qs.map(x => x.id === q.id ? updated : x));
    setEditingId(null);
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const prompt = `Stat: ${STAT_CFG[q.stat].label}\nOriginal quest: ${q.title}\nUpdated quest: ${updated.title}\nUpdated description: ${updated.desc || "none"}\nGenerate the next logical quest after this progression.`;
      const parsed = await rosayeQuestAssist(rosayeConfig, rosayeMemory, rosayeMessages, prompt, "next", q.stat, { original: q, updated });
      setAiSuggestion(rosayeNormalizedQuestShape(q.stat, parsed));
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  function addSuggestion() {
    if (!aiSuggestion) return;
    setQuests(qs => [...qs, attachDeadlineWindow({ ...aiSuggestion, id: `ai_${Date.now()}`, done: false, xp: parseInt(aiSuggestion.xp) || 30, deadline: null, isDaily: false, isFinalBoss: false })]);
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
      const prompt = `Stat: ${STAT_CFG[stat].label}\nContext: ${ctx[stat]}\nExisting active quests: ${existing}\nGenerate 3 specific next quests that progress this stat without duplicating current quests.`;
      const parsed = await rosayeQuestAssist(rosayeConfig, rosayeMemory, rosayeMessages, prompt, "list", stat, { context: ctx[stat], existing });
      const list = Array.isArray(parsed) ? parsed : rosayeQuestFallback(stat, "list", { context: ctx[stat], existing });
      setQuests(qs => [...qs, ...list.map(q => attachDeadlineWindow({ ...rosayeNormalizedQuestShape(stat, q), id: `ai_${Date.now()}_${Math.random()}`, done: false, deadline: null, isDaily: false, isFinalBoss: false }))]);
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  function addManualQuest(stat) {
    if (!newQ.title.trim()) return;
    setQuests(qs => [...qs, attachDeadlineWindow({ ...newQ, id: `m_${Date.now()}`, stat, done: false, xp: parseInt(newQ.xp) || 30, deadline: newQ.deadline || null, isFinalBoss: false })]);
    setNewQ({ title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "", isDaily: false });
    setShowAdd(false);
  }

  function addBoardQuest() {
    if (!boardQ.title.trim()) return;
    setQuests(qs => [...qs, attachDeadlineWindow({ ...boardQ, id: `b_${Date.now()}`, done: false, xp: parseInt(boardQ.xp) || 30, deadline: boardQ.deadline || null, isFinalBoss: false })]);
    setBoardQ({ stat: "strength", title: "", desc: "", type: "main", priority: "normal", xp: 30, deadline: "", isDaily: false });
    setShowBoardAdd(false);
  }

  function addQuickDailyQuest(stat) {
    setQuests(qs => [...qs, attachDeadlineWindow({
      id: `d_${Date.now()}`,
      stat,
      title: `Daily ${STAT_CFG[stat].label} quest`,
      desc: "Repeats every day. Complete it once daily for consistent momentum.",
      type: "main",
      priority: "normal",
      xp: 30,
      deadline: null,
      done: false,
      isDaily: true,
      isFinalBoss: false,
      coinReward: 0,
      completedAt: null,
    })]);
    setToast({ e: "🔁", m: "Daily quest added.", xp: 0 });
    setTimeout(() => setToast(null), 2000);
  }

  function addFinalBossQuest() {
    const exists = quests.some(q => q.isFinalBoss);
    if (exists) {
      setToast({ e: "⚡", m: "Final boss already exists.", xp: 0 });
      setTimeout(() => setToast(null), 1800);
      return;
    }
    setQuests(qs => [...qs, attachDeadlineWindow({
      id: `final_boss_lv1`,
      stat: "persona",
      title: "Speak English Fluently — Final Boss",
      desc: "Hold a 10-minute unscripted conversation in English without switching languages. Record it or have it witnessed. This is the Level 1 capstone.",
      type: "boss",
      priority: "urgent",
      xp: 200,
      deadline: null,
      done: false,
      isDaily: false,
      isFinalBoss: true,
      locked: true,
      coinReward: 0,
      completedAt: null,
    })]);
    setToast({ e: "👑", m: "Final boss quest added.", xp: 0 });
    setTimeout(() => setToast(null), 2200);
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
    const resetDays = Math.max(1, Number(penalty.deadlineWindowDays) || getDeadlineWindowDays(penalty.deadline, `${APP_TODAY}T00:00:00`) || 1);
    const newDeadline = toDateInput(addDays(new Date(), resetDays));
    setCoins(c => Math.max(0, c - MISSED_DEADLINE_COIN_PENALTY));
    setQuests(qs => qs.map(q => q.id === penalty.id
      ? { ...q, deadline: newDeadline, deadlineWindowDays: resetDays }
      : q));
    setPenalty(null);
    setPenaltyWhy("");
    setToast({ e: "💀", m: `Deadline reset. ${MISSED_DEADLINE_COIN_PENALTY} coins lost.`, xp: 0, coins: -MISSED_DEADLINE_COIN_PENALTY });
    setTimeout(() => setToast(null), 2600);
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
  const levelTarget = calcLevelTargetXP(quests);
  const totalProgress = Math.min((totalXP / Math.max(1, levelTarget.totalTargetXP)) * 100, 100);
  const level1Status = useMemo(() => checkLevel1Complete(quests, streak), [quests, streak]);
  const finalBossQuest = level1Status.finalBossQuest;
  const isFinalBossDone = level1Status.finalBossMet;
  const levelReadyByXP = level1Status.xpMet;
  const canAdvanceLevel = level1Status.complete;
  const totalDone = quests.filter(q => q.done).length;
  const todayQ = sortQ(quests.filter(q => !q.done)).slice(0, 5);
  const levelClock = formatCountdown(levelDeadline, nowMs);

  useEffect(() => {
    if (onboarding || canAdvanceLevel || levelPenalty) return;
    if (new Date(levelDeadline).getTime() <= nowMs) {
      setLevelPenalty(getLevelPunishment(statXP, levelDeadline));
    }
  }, [onboarding, canAdvanceLevel, levelDeadline, nowMs, levelPenalty, statXP]);

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
          {toast && <>
            <div className="toast-e">{toast.e}</div>
            <div className="toast-m">{toast.m}</div>
            <div className="toast-xp">
              {`${toast.xp >= 0 ? "+" : ""}${toast.xp} XP`}
              {typeof toast.coins === "number" ? ` · ${toast.coins >= 0 ? "+" : ""}${toast.coins} coins` : ""}
            </div>
          </>}
        </div>

        <div className={`rw-toast ${rewardToast ? "show" : ""}`}>
          {rewardToast && <>
            <div className="rw-toast-top">Reward Drop</div>
            <div className="rw-toast-title">{rewardToast.title}</div>
            <div className="rw-toast-body">{rewardToast.body}</div>
          </>}
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

        {/* CARRY-FORWARD REVIEW */}
        {carryReview && (
          <div className="overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 16, padding: 20, maxWidth: 440, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--gold)", marginBottom: 4 }}>Level 2 Gate</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 16, lineHeight: 1.5 }}>
                Decide what to do with each incomplete Level 1 quest before moving on.
              </div>
              {quests.filter(q => !q.done && !q.isFinalBoss).length === 0 && (
                <div style={{ fontSize: 12, color: "var(--text2)" }}>Nothing to review.</div>
              )}
              {quests.filter(q => !q.done && !q.isFinalBoss).map(q => {
                const decision = carryDecisions[q.id] || "carry";
                return (
                  <div key={q.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{q.title}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{q.stat} · {q.type} · {q.xp} XP</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["carry", "archive", "drop"].map(opt => (
                        <button key={opt}
                          onClick={() => setCarryDecisions(d => ({ ...d, [q.id]: opt }))}
                          style={{
                            flex: 1, padding: "8px 6px", fontSize: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderRadius: 8,
                            background: decision === opt ? (opt === "drop" ? "var(--urgent-dim)" : opt === "archive" ? "var(--bg3)" : "var(--gold-dim)") : "transparent",
                            color: decision === opt ? (opt === "drop" ? "var(--urgent)" : opt === "archive" ? "var(--text2)" : "var(--gold)") : "var(--text3)",
                            border: `1px solid ${decision === opt ? (opt === "drop" ? "var(--urgent-border)" : "var(--border2)") : "var(--border)"}`
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setCarryReview(false)} style={{ flex: 1, padding: 12, background: "transparent", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 10, fontWeight: 600 }}>Cancel</button>
                <button onClick={applyCarryReview} style={{ flex: 2, padding: 12, background: "linear-gradient(90deg,#ef7a52,#cb5be7)", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: 1 }}>Confirm & Enter Level 2</button>
              </div>
            </div>
          </div>
        )}
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
              <div className="penalty-xp">−{MISSED_DEADLINE_COIN_PENALTY} coins</div>
              <div className="penalty-sub">The quest stays active and gets the same time window again after you accept.</div>
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
                <div className="profile-streak"><span>????</span><span className="streak-text">{streak} day streak</span></div>
              </div>
            </div>

            <div className="cxp-card">
              <div className="cxp-top">
                <div className="cxp-label">Level 1 Progress</div>
                <div className="cxp-pct">{Math.round(level1Status.progress)}%</div>
              </div>
              <div className="cxp-track"><div className="cxp-fill" style={{ width: `${level1Status.progress}%` }} /></div>
              <div className="cxp-bottom">
                <div className="cxp-nums">{level1Status.earnedXP} / {level1Status.level1Target} XP (80% of {level1Status.totalPossibleXP})</div>
                <div className="cxp-quests">done {totalDone}/{quests.length}</div>
              </div>
              <div className="cxp-coins">🪙 {coins} coins</div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "var(--text2)" }}>
                <div style={{ fontWeight: 700, color: "var(--text1)" }}>Final Boss unlocks when EITHER condition is met:</div>
                <div>{level1Status.streakMet ? "✅" : "⏳"} {LEVEL1_STREAK_DAYS}-day streak — {level1Status.streak}/{LEVEL1_STREAK_DAYS} days</div>
                <div>{level1Status.xpMet ? "✅" : "⏳"} 80% XP completed — {level1Status.earnedXP}/{level1Status.level1Target}</div>
                <div style={{ marginTop: 4 }}>
                  {!finalBossQuest
                    ? "👑 Final Boss — Add the Final Boss quest"
                    : isFinalBossDone
                      ? "✅ Final Boss — Completed"
                      : level1Status.prereqsMet
                        ? "👑 Final Boss — Unlocked. Complete to clear Level 1."
                        : "🔒 Final Boss — Locked (meet one condition above)"}
                </div>
              </div>
              {!finalBossQuest && (
                <button onClick={addFinalBossQuest} style={{ marginTop: 10, width: "100%", padding: "10px 12px", background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--gold-mid)", borderRadius: 10, fontWeight: 700, fontFamily: "'Syne',sans-serif", letterSpacing: 1, fontSize: 11 }}>
                  + ADD FINAL BOSS QUEST
                </button>
              )}
              {canAdvanceLevel && quests.some(q => !q.done && !q.isFinalBoss) && (
                <button onClick={() => setCarryReview(true)} style={{ marginTop: 10, width: "100%", padding: "12px", background: "linear-gradient(90deg,#ef7a52,#cb5be7)", color: "#fff", border: 0, borderRadius: 10, fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: 1.5, fontSize: 12 }}>
                  REVIEW INCOMPLETE QUESTS → LEVEL 2
                </button>
              )}
            </div>

            <div className="sh"><div className="sh-title">Stats</div></div>
            <div className="stats-row">
              {STATS.map(key => {
                const cfg = STAT_CFG[key];
                const info = getLvInfo(statXP[key]);
                return (
                  <div className="stat-mini" key={key} onClick={() => navTo("stat", key)} style={{
                    background: key === "strength"
                      ? "linear-gradient(180deg,rgba(58,20,10,.95),rgba(33,14,9,.98))"
                      : key === "creativity"
                        ? "linear-gradient(180deg,rgba(58,35,10,.95),rgba(35,21,8,.98))"
                        : key === "intelligence"
                          ? "linear-gradient(180deg,rgba(10,24,54,.95),rgba(8,17,35,.98))"
                          : "linear-gradient(180deg,rgba(36,15,58,.95),rgba(22,11,35,.98))",
                    borderColor: key === "strength"
                      ? "rgba(230,80,50,.28)"
                      : key === "creativity"
                        ? "rgba(240,160,48,.28)"
                        : key === "intelligence"
                          ? "rgba(72,136,240,.28)"
                          : "rgba(152,96,240,.28)"
                  }}>
                    <div className="stat-mini-icon">{cfg.icon}</div>
                    <div className="stat-mini-lv" style={{ color: cfg.color }}>Lv {info.level}</div>
                    <div className="stat-mini-bar"><div className="stat-mini-fill" style={{ width: `${info.progress}%`, background: cfg.color }} /></div>
                  </div>
                );
              })}
            </div>

            <div className="home-duo">
              <div className="reward-home-card">
                <div className="reward-home-top">
                  <div>
                    <div className="reward-home-label">Reward Wheel</div>
                    <div className="reward-home-title">Spin + Shop</div>
                    <div className="reward-home-copy">Use quest coins for rewards, wheel drops, and inventory.</div>
                  </div>
                  <div className="reward-pill gold">?? {coins}</div>
                </div>
                <div className="reward-home-meta">
                  <div className="reward-pill">Inv {rewardInventoryTotal}</div>
                  <div className="reward-pill">{rewardLocked ? "Locked" : "Editable"}</div>
                </div>
                <button className="reward-open-btn" onClick={() => navTo("rewards")}>Open Wheel</button>
              </div>

              <div className="reward-home-card">
                <div className="reward-home-top">
                  <div>
                    <div className="reward-home-label">Rosaye AI</div>
                    <div className="reward-home-title">Quest Brain</div>
                    <div className="reward-home-copy">Update context, deploy tasks, and get smarter next quests.</div>
                  </div>
                  <div className="reward-pill">?? {rosayeSuggestions.length}</div>
                </div>
                <div className="reward-home-meta">
                  <div className="reward-pill">{rosayeConfig.provider}</div>
                  <div className="reward-pill">Memory {Object.values(rosayeMemory).filter(v => Object.values(v || {}).some(Boolean)).length}</div>
                </div>
                <button className="reward-open-btn" onClick={() => navTo("rosaye")}>Open Rosaye</button>
              </div>
            </div>

            <div className="sh">
              <div className="sh-title">Today's Priority</div>
              <button className="sh-action" onClick={() => navTo("quests")}>All ???</button>
            </div>
            <div className="ql">
              {todayQ.length === 0 && <div className="empty">All quests complete. Absolute monster. ????</div>}
              {todayQ.map(q => (
                <QCard key={q.id} q={q} onComplete={requestCompleteQuest} onEdit={openEdit} onDelete={removeQuest}
                  editingId={editingId} editForm={editForm} setEditForm={setEditForm}
                  onSaveEdit={saveEdit} aiSuggestion={editingId === q.id ? aiSuggestion : null}
                  aiLoading={editingId === q.id ? aiLoading : false} onAddSuggestion={addSuggestion}
                  onCancelEdit={() => { setEditingId(null); setAiSuggestion(null); }}
                />
              ))}
            </div>

            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => openQuestBoardAdd("strength")}>+ Add Quest</button>
              <button className="quick-action-btn" onClick={addFinalBossQuest}>+ Final Boss</button>
              <button className="quick-action-btn" onClick={() => navTo("quests")}>Manage Quest List</button>
            </div>

            <div className="oracle-card">
              <div className="oracle-dot"><div className="oracle-pip" /><div className="oracle-lbl">Oracle</div></div>
              <div className="oracle-text">"{oracle}"</div>
            </div>
          </div>
        )}

        {page === "rosaye" && (
          <div className="page">
            <div className="ra-page">
              <div className="ra-hero">
                <div className="ra-topline">Rosaye AI</div>
                <div className="ra-title">Memory. Progress. Next Quest.</div>
                <div className="ra-sub">Rosaye is not here to chat for fun. It stores your context, updates entities like project names, and turns real progress into smarter next-step quests.</div>
              </div>

              <div className="ra-stack">
                <div className="ra-metrics">
                  <div className="ra-metric">
                    <div className="ra-topline">Provider</div>
                    <div className="ra-metric-value" style={{ fontSize: 18 }}>{rosayeConfig.apiKey.trim() ? rosayeConfig.provider : "Local"}</div>
                    <div className="ra-metric-note">{rosayeConfig.apiKey.trim() ? "API mode is active." : "Heuristic memory mode is active until you add a free API key."}</div>
                  </div>
                  <div className="ra-metric">
                    <div className="ra-topline">Messages</div>
                    <div className="ra-metric-value">{rosayeMessages.length}</div>
                    <div className="ra-metric-note">Conversation log stored locally with the rest of the app state.</div>
                  </div>
                  <div className="ra-metric">
                    <div className="ra-topline">Suggestions</div>
                    <div className="ra-metric-value">{rosayeSuggestions.length}</div>
                    <div className="ra-metric-note">Turn any suggestion below directly into a real quest.</div>
                  </div>
                </div>

                <div className="ra-panel">
                  <div className="ra-topline">Free AI Setup</div>
                  <div className="ra-grid2">
                    <div>
                      <label className="ra-label">Provider</label>
                      <select className="ra-select" value={rosayeConfig.provider} onChange={e => setRosayeConfig(current => ({ ...current, provider: e.target.value, model: rosayeProviderModel(e.target.value) }))}>
                        <option value="groq">Groq</option>
                        <option value="gemini">Gemini</option>
                        <option value="openrouter">OpenRouter</option>
                      </select>
                    </div>
                    <div>
                      <label className="ra-label">Model</label>
                      <input className="ra-input" value={rosayeConfig.model} onChange={e => setRosayeConfig(current => ({ ...current, model: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label className="ra-label">API Key</label>
                    <input className="ra-input" value={rosayeConfig.apiKey} onChange={e => setRosayeConfig(current => ({ ...current, apiKey: e.target.value }))} placeholder="Optional for now. Without a key Rosaye still works in local memory mode." />
                  </div>
                </div>

                <div className="ra-panel ra-chat">
                  <div className="ra-topline">Progress Input</div>
                  <div className="ra-messages">
                    {rosayeMessages.length === 0 && <div className="ra-empty">Try: "I completed 1 km running", "I am working on edit", or "Project name is Virtuolab".</div>}
                    {rosayeMessages.map(item => (
                      <div key={item.id} className={`ra-msg ${item.role === "user" ? "user" : "ai"}`}>
                        <div className="ra-msg-role">{item.role === "user" ? "You" : "Rosaye"}</div>
                        <div className="ra-msg-body">{item.text}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="ra-label">Tell Rosaye what happened</label>
                    <textarea className="ra-textarea" value={rosayeInput} onChange={e => setRosayeInput(e.target.value)} placeholder='Example: "I completed 1 km running" or "Project name is Virtuolab".' />
                  </div>
                  <div className="ra-row">
                    <button className="ra-btn" onClick={rosayeSubmit} disabled={rosayeLoading || !rosayeInput.trim()}>{rosayeLoading ? "Rosaye Thinking" : "Update Rosaye"}</button>
                    <button className="ra-btn-ghost" onClick={() => setRosayeMessages([])}>Clear Chat</button>
                  </div>
                </div>

                <div className="ra-panel">
                  <div className="ra-topline">Memory</div>
                  <div className="ra-memory-grid">
                    <div className="ra-memory-card">
                      <div className="ra-memory-head"><div className="ra-memory-name" style={{ color: "var(--str)" }}>Fitness</div><span className="ra-chip fit">Strength</span></div>
                      <div className="ra-memory-body">{[rosayeMemory.fitness.current, rosayeMemory.fitness.progress, rosayeMemory.fitness.next].filter(Boolean).join("\n") || "No fitness memory yet."}</div>
                    </div>
                    <div className="ra-memory-card">
                      <div className="ra-memory-head"><div className="ra-memory-name" style={{ color: "var(--cre)" }}>Work</div><span className="ra-chip work">Creativity</span></div>
                      <div className="ra-memory-body">{[rosayeMemory.work.project && `Project: ${rosayeMemory.work.project}`, rosayeMemory.work.current, rosayeMemory.work.progress, rosayeMemory.work.next].filter(Boolean).join("\n") || "No work memory yet."}</div>
                    </div>
                    <div className="ra-memory-card">
                      <div className="ra-memory-head"><div className="ra-memory-name" style={{ color: "var(--int)" }}>Learning</div><span className="ra-chip learn">Intelligence</span></div>
                      <div className="ra-memory-body">{[rosayeMemory.learning.current, rosayeMemory.learning.progress, rosayeMemory.learning.next].filter(Boolean).join("\n") || "No learning memory yet."}</div>
                    </div>
                    <div className="ra-memory-card">
                      <div className="ra-memory-head"><div className="ra-memory-name">General</div><span className="ra-chip good">Updated</span></div>
                      <div className="ra-memory-body">{[rosayeMemory.general.goal, rosayeMemory.general.note].filter(Boolean).join("\n") || "No general notes yet."}</div>
                    </div>
                  </div>
                </div>

                <div className="ra-panel">
                  <div className="ra-topline">Suggested Next Quests</div>
                  <div className="ra-suggestion-list">
                    {rosayeSuggestions.length === 0 && <div className="ra-empty">No suggestions yet. Feed Rosaye one real update first.</div>}
                    {rosayeSuggestions.map(suggestion => (
                      <div className="ra-suggestion-card" key={suggestion.id}>
                        <div className="ra-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                          <div className="ra-suggestion-title">{suggestion.title}</div>
                          <span className={`ra-chip ${suggestion.stat === "strength" ? "fit" : suggestion.stat === "creativity" ? "work" : suggestion.stat === "intelligence" ? "learn" : "good"}`}>{STAT_CFG[suggestion.stat]?.label || suggestion.stat}</span>
                        </div>
                        <div className="ra-suggestion-desc">{suggestion.desc}</div>
                        <div className="ra-chip-row" style={{ marginTop: 10 }}>
                          <span className="ra-chip good">{suggestion.xp} XP</span>
                          <span className="ra-chip">{suggestion.type}</span>
                          <span className="ra-chip">{suggestion.priority}</span>
                        </div>
                        <div className="ra-row" style={{ marginTop: 12 }}>
                          <button className="ra-btn" onClick={() => rosayeAddSuggestion(suggestion)}>Add To Quests</button>
                          <button className="ra-btn-ghost" onClick={() => rosayeCycleSuggestion(suggestion)} disabled={rosayeCyclingId === suggestion.id}>{rosayeCyclingId === suggestion.id ? "Finding Next" : "Next Quest"}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "rewards" && (
          <div className="rw-page">
            <div className="rw-stack">
              <div className="rw-panel">
                <div className="rw-topline">Reward System</div>
                <div className="rw-title">Coins. Wheel. Boundaries.</div>
                <div className="rw-sub">This is the reward layer inside Life RPG. Your quest coins, wheel wins, shop buys, and inventory all live here in one shared economy.</div>
              </div>

              <div className="rw-tabs">
                {[["wheel", "Wheel"], ["shop", "Shop"], ["inventory", "Inventory"], ["manage", "Manage"]].map(([id, label]) => (
                  <button key={id} className={`rw-tab ${rewardTab === id ? "active" : ""}`} onClick={() => setRewardTab(id)}>{label}</button>
                ))}
              </div>

              {rewardTab === "wheel" && (
                <>
                  <div className="rw-panel">
                    <div className="rw-topline">Wheel Room</div>
                    <div className="rw-sub">Pick a tier, spend coins, and let the wheel decide the drop. Rewards go into inventory as tokens instead of disappearing instantly.</div>
                    <div className="rw-metrics" style={{ marginTop: 12 }}>
                      <div className="rw-metric">
                        <div className="rw-topline">Coins</div>
                        <div className="rw-metric-value" style={{ color: "var(--gold)" }}>{coins}</div>
                        <div className="rw-metric-note">This is the live balance used by wheels and the shop.</div>
                      </div>
                      <div className="rw-metric">
                        <div className="rw-topline">Inventory</div>
                        <div className="rw-metric-value">{rewardInventoryTotal}</div>
                        <div className="rw-metric-note">Saved tokens and items waiting to be used.</div>
                      </div>
                    </div>
                  </div>

                  <div className="rw-wheel-stage">
                    <div className="rw-wheel-shell">
                      <div className="rw-wheel-pointer" />
                      <div
                        className="rw-wheel-disc"
                        style={{
                          transform: `rotate(${rewardWheelRotation}deg)`,
                          background: (rewardWheelSlices[rewardSpinTier] || []).length
                            ? `conic-gradient(${(rewardWheelSlices[rewardSpinTier] || []).map((slice, index, arr) => {
                              const start = (index / arr.length) * 360;
                              const end = ((index + 1) / arr.length) * 360;
                              return `${slice.color} ${start}deg ${end}deg`;
                            }).join(", ")})`
                            : "var(--surface2)",
                        }}
                      />
                      <div className="rw-wheel-label-layer">
                        <div style={{ width: "100%", height: "100%", transform: `rotate(${rewardWheelRotation}deg)` }}>
                          {(rewardWheelSlices[rewardSpinTier] || []).map((slice, index, arr) => {
                            const baseAngle = (360 / arr.length) * index + 360 / arr.length / 2;
                            const settleRotation = rewardSpinning ? 0 : -(baseAngle + rewardWheelRotation);
                            return (
                              <div
                                key={`${rewardSpinTier}_${slice.id}`}
                                className="rw-wheel-label"
                                style={{ transform: `translate(-50%,-50%) rotate(${baseAngle}deg) translateY(-108px) rotate(${settleRotation}deg)` }}
                              >
                                {slice.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="rw-wheel-center">
                        <div className="rw-wheel-center-title">{rewardSpinning ? "Spinning..." : RW_WHEEL_CONFIG[rewardSpinTier].label}</div>
                      </div>
                    </div>

                    <div className="rw-tier-switch">
                      {Object.keys(RW_WHEEL_CONFIG).map(tier => (
                        <button key={tier} className={`rw-tier-btn ${rewardSpinTier === tier ? "active" : ""}`} onClick={() => setRewardSpinTier(tier)}>
                          {tier}
                        </button>
                      ))}
                    </div>

                    <button className="rw-btn" onClick={() => rewardSpinWheel(rewardSpinTier)} disabled={rewardSpinning || coins < RW_WHEEL_CONFIG[rewardSpinTier].cost}>
                      {rewardSpinning ? "Wheel Spinning" : `Spin ${RW_WHEEL_CONFIG[rewardSpinTier].label} (${RW_WHEEL_CONFIG[rewardSpinTier].cost})`}
                    </button>
                  </div>

                  <div className="rw-panel">
                    <div className="rw-topline">Current Tier Pool</div>
                    <div className="rw-chip-row">
                      {(rewardActiveWheel[rewardSpinTier] || []).map(item => <span key={item.id} className="rw-chip blue">{item.emoji} {item.name}</span>)}
                      {RW_WHEEL_CONFIG[rewardSpinTier].staticSlots.map(slot => <span key={slot.id} className="rw-chip gold">{slot.label}</span>)}
                    </div>
                  </div>

                  {rewardResult && (
                    <div className="rw-result">
                      <div className="rw-result-title">{rewardResult.title}</div>
                      <div className="rw-result-body">{rewardResult.body}</div>
                    </div>
                  )}
                </>
              )}

              {rewardTab === "shop" && (
                <>
                  <div className="rw-panel">
                    <div className="rw-topline">Active Shop</div>
                    <div className="rw-sub">Tokens are time-based permissions. Items are claimable rewards you can cash in later. Both get stored in inventory first.</div>
                  </div>

                  <div className="rw-panel">
                    <div className="rw-topline">Time Tokens</div>
                    <div className="rw-sub">Scrolling, watching, reading, gaming. Buy now, use later.</div>
                  </div>
                  <div className="rw-list">
                    {rewardActiveShopTokens.map(item => (
                      <div className="rw-card" key={item.id}>
                        <div className="rw-card-top">
                          <div>
                            <div className="rw-card-title">{item.emoji} {item.name}</div>
                            <div className="rw-card-sub">{item.category} token. It sits in inventory until you choose to use the time block.</div>
                          </div>
                          <div className="rw-chip gold">{item.cost} coins</div>
                        </div>
                        <div className="rw-row" style={{ marginTop: 12 }}>
                          <button className="rw-btn" onClick={() => rewardBuy(item)} disabled={coins < item.cost}>Buy Token</button>
                          <button className="rw-btn-ghost" onClick={() => rewardUse(item)} disabled={!rwInventoryCount(rewardInventory, rwRewardTokenKey(item.id))}>Use Token</button>
                        </div>
                      </div>
                    ))}
                    {!rewardActiveShopTokens.length && <div className="rw-empty">No time tokens in the active shop right now.</div>}
                  </div>

                  <div className="rw-panel">
                    <div className="rw-topline">Claimable Items</div>
                    <div className="rw-sub">Physical or one-off rewards. Buy them first, then claim them from inventory whenever you want.</div>
                  </div>
                  <div className="rw-list">
                    {rewardActiveShopItems.map(item => (
                      <div className="rw-card" key={item.id}>
                        <div className="rw-card-top">
                          <div>
                            <div className="rw-card-title">{item.emoji} {item.name}</div>
                            <div className="rw-card-sub">{item.category} item. Buying it adds a claim token to inventory.</div>
                          </div>
                          <div className="rw-chip gold">{item.cost} coins</div>
                        </div>
                        <div className="rw-row" style={{ marginTop: 12 }}>
                          <button className="rw-btn" onClick={() => rewardBuy(item)} disabled={coins < item.cost}>Buy Item</button>
                          <button className="rw-btn-ghost" onClick={() => rewardUse(item)} disabled={!rwInventoryCount(rewardInventory, rwRewardTokenKey(item.id))}>Claim Item</button>
                        </div>
                      </div>
                    ))}
                    {!rewardActiveShopItems.length && <div className="rw-empty">No claimable items in the active shop right now.</div>}
                  </div>
                </>
              )}

              {rewardTab === "inventory" && (
                <>
                  <div className="rw-panel">
                    <div className="rw-topline">Inventory</div>
                    <div className="rw-sub">Wheel wins and shop purchases both become tokens here, so rewards feel earned and saved instead of instantly disposable.</div>
                  </div>
                  <div className="rw-list">
                    {Object.keys(rewardInventory).length === 0 && <div className="rw-empty">No tokens yet. Spin a wheel or buy something from the shop.</div>}
                    {Object.entries(rewardInventory).map(([key, count]) => {
                      if (key === "boost_double_next_quest") {
                        return (
                          <div className="rw-card" key={key}>
                            <div className="rw-card-top">
                              <div>
                                <div className="rw-card-title">Double Coins Next Quest</div>
                                <div className="rw-card-sub">Arm this before finishing a valuable quest to double the coin payout.</div>
                              </div>
                              <div className="rw-chip purple">x{count}</div>
                            </div>
                            <button className="rw-btn" style={{ marginTop: 12, width: "100%" }} onClick={rewardUseBoostToken} disabled={questBoostReady}>Use Boost</button>
                          </div>
                        );
                      }
                      const id = key.replace("reward_", "");
                      const item = rewardLibraryMap[id];
                      if (!item) return null;
                      return (
                        <div className="rw-card" key={key}>
                          <div className="rw-card-top">
                            <div>
                              <div className="rw-card-title">{item.emoji} {item.name}</div>
                              <div className="rw-card-sub">{item.rewardType === "item" ? `${item.category} item ready to claim whenever you want.` : `${item.category} token ready to use whenever you want guilt-free access.`}</div>
                            </div>
                            <div className="rw-chip green">x{count}</div>
                          </div>
                          <button className="rw-btn" style={{ marginTop: 12, width: "100%" }} onClick={() => rewardUse(item)}>{item.rewardType === "item" ? "Claim Item" : "Use Token"}</button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {rewardTab === "manage" && (
                <>
                  <div className="rw-metrics">
                    <div className="rw-metric">
                      <div className="rw-topline">Coin Balance</div>
                      <div className="rw-metric-value" style={{ color: coins >= 0 ? "var(--gold)" : "var(--urgent)" }}>{coins}</div>
                      <div className="rw-metric-note">This is your live reward economy balance.</div>
                    </div>
                    <div className="rw-metric">
                      <div className="rw-topline">Reward State</div>
                      <div className="rw-metric-value" style={{ color: rewardLocked ? "var(--high)" : "var(--green)" }}>{rewardLocked ? "Locked" : "Editable"}</div>
                      <div className="rw-metric-note">{rewardLocked ? "Library edits are frozen. Refresh live pools with coins." : "Add, edit, remove, and arrange rewards freely."}</div>
                    </div>
                  </div>

                  <div className="rw-panel rw-stack">
                    <div className="rw-topline">How To Use This Page</div>
                    <div className="rw-info-card">
                      <div className="rw-info-title">Add Rewards Cleanly</div>
                      <div className="rw-info-copy">Put every possible reward in the master library here. Choose its cost, category, reward type, and whether it should appear in the shop, the wheel, or both.</div>
                    </div>
                    <div className="rw-info-card">
                      <div className="rw-info-title">Lock, Then Refresh</div>
                      <div className="rw-info-copy">Before locking, edits are free. After locking, you keep the library fixed and rotate the live pools by spending coins on refreshes.</div>
                    </div>
                    <div className="rw-info-card">
                      <div className="rw-info-title">Cheat Rule</div>
                      <div className="rw-info-copy">If you use a pleasure reward without paying or using a token first, log it here and let the debt hit your balance.</div>
                    </div>
                  </div>

                  <div className="rw-panel rw-stack">
                    <div className="rw-topline">Reward Library Manager</div>
                    <div className="rw-row">
                      <button className="rw-btn" onClick={rewardLockEconomy} disabled={rewardLocked}>Lock Reward Economy</button>
                      <button className="rw-btn-ghost" onClick={() => rewardRefreshShop(!rewardLocked)}>{rewardLocked ? `Refresh Shop (${RW_SHOP_REFRESH_COST})` : "Free Shop Refresh"}</button>
                    </div>
                    <div className="rw-row">
                      <button className="rw-btn-ghost" onClick={() => rewardRefreshWheel(!rewardLocked)}>{rewardLocked ? `Refresh Wheel (${RW_WHEEL_REFRESH_COST})` : "Free Wheel Refresh"}</button>
                      <button className="rw-btn-ghost" onClick={rewardRefreshAll}>{rewardLocked ? `Full Refresh (${RW_FULL_REFRESH_COST})` : "Free Full Refresh"}</button>
                    </div>
                  </div>

                  <div className="rw-panel rw-stack">
                    <div className="rw-topline">Add Reward</div>
                    <div className="rw-grid2">
                      <div>
                        <label className="rw-label">Name</label>
                        <input className="rw-input" value={newReward.name} onChange={e => setNewReward(current => ({ ...current, name: e.target.value }))} disabled={rewardLocked} />
                      </div>
                      <div>
                        <label className="rw-label">Cost</label>
                        <input className="rw-input" type="number" value={newReward.cost} onChange={e => setNewReward(current => ({ ...current, cost: e.target.value }))} disabled={rewardLocked} />
                      </div>
                    </div>
                    <div className="rw-grid2">
                      <div>
                        <label className="rw-label">Category</label>
                        <select className="rw-select" value={newReward.category} onChange={e => setNewReward(current => ({ ...current, category: e.target.value }))} disabled={rewardLocked}>
                          {["entertainment", "food", "time", "rest", "any"].map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="rw-label">Reward Type</label>
                        <select className="rw-select" value={newReward.rewardType} onChange={e => setNewReward(current => ({ ...current, rewardType: e.target.value }))} disabled={rewardLocked}>
                          <option value="token">Time Token</option>
                          <option value="item">Claimable Item</option>
                        </select>
                      </div>
                    </div>
                    <div className="rw-grid2">
                      <div>
                        <label className="rw-label">Short Tag</label>
                        <input className="rw-input" value={newReward.emoji} onChange={e => setNewReward(current => ({ ...current, emoji: e.target.value.slice(0, 3) }))} disabled={rewardLocked} />
                      </div>
                      <div>
                        <label className="rw-label">Preview</label>
                        <div className="rw-input" style={{ display: "flex", alignItems: "center" }}>{newReward.rewardType === "item" ? "This will appear as a claimable shop item." : "This will appear as a time-based token."}</div>
                      </div>
                    </div>
                    <div className="rw-checks">
                      {["basic", "silver", "gold"].map(tier => (
                        <label key={tier} className="rw-check">
                          <input
                            type="checkbox"
                            checked={newReward.tiers.includes(tier)}
                            onChange={() => setNewReward(current => ({
                              ...current,
                              tiers: current.tiers.includes(tier) ? current.tiers.filter(value => value !== tier) : [...current.tiers, tier],
                            }))}
                            disabled={rewardLocked}
                          />
                          <span>{tier}</span>
                        </label>
                      ))}
                    </div>
                    <div className="rw-row">
                      <button className="rw-btn-ghost" onClick={() => setNewReward(current => ({ ...current, shopEligible: !current.shopEligible }))} disabled={rewardLocked}>{newReward.shopEligible ? "Shop On" : "Shop Off"}</button>
                      <button className="rw-btn-ghost" onClick={() => setNewReward(current => ({ ...current, wheelEligible: !current.wheelEligible }))} disabled={rewardLocked}>{newReward.wheelEligible ? "Wheel On" : "Wheel Off"}</button>
                    </div>
                    <button className="rw-btn" onClick={rewardAddReward} disabled={rewardLocked || !newReward.name.trim()}>Add Reward To Library</button>
                  </div>

                  <div className="rw-list">
                    {rewardLibrary.map(item => (
                      <div className="rw-card" key={item.id}>
                        <div className="rw-grid2">
                          <div>
                            <label className="rw-label">Name</label>
                            <input className="rw-input" value={item.name} onChange={e => rewardUpdateItem(item.id, "name", e.target.value)} disabled={rewardLocked} />
                          </div>
                          <div>
                            <label className="rw-label">Cost</label>
                            <input className="rw-input" type="number" value={item.cost} onChange={e => rewardUpdateItem(item.id, "cost", parseInt(e.target.value, 10) || 0)} disabled={rewardLocked} />
                          </div>
                        </div>
                        <div className="rw-grid2" style={{ marginTop: 10 }}>
                          <div>
                            <label className="rw-label">Category</label>
                            <select className="rw-select" value={item.category} onChange={e => rewardUpdateItem(item.id, "category", e.target.value)} disabled={rewardLocked}>
                              {["entertainment", "food", "time", "rest", "any"].map(value => <option key={value} value={value}>{value}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="rw-label">Reward Type</label>
                            <select className="rw-select" value={item.rewardType} onChange={e => rewardUpdateItem(item.id, "rewardType", e.target.value)} disabled={rewardLocked}>
                              <option value="token">Time Token</option>
                              <option value="item">Claimable Item</option>
                            </select>
                          </div>
                        </div>
                        <div className="rw-grid2" style={{ marginTop: 10 }}>
                          <div>
                            <label className="rw-label">Short Tag</label>
                            <input className="rw-input" value={item.emoji} onChange={e => rewardUpdateItem(item.id, "emoji", e.target.value.slice(0, 3))} disabled={rewardLocked} />
                          </div>
                          <div>
                            <label className="rw-label">Mode</label>
                            <div className="rw-input" style={{ display: "flex", alignItems: "center" }}>{item.rewardType === "item" ? "Claimable item" : "Time token"}</div>
                          </div>
                        </div>
                        <div className="rw-chip-row">
                          <span className={`rw-chip ${item.shopEligible ? "green" : ""}`}>{item.shopEligible ? "Shop Eligible" : "Shop Off"}</span>
                          <span className={`rw-chip ${item.wheelEligible ? "blue" : ""}`}>{item.wheelEligible ? "Wheel Eligible" : "Wheel Off"}</span>
                          <span className={`rw-chip ${item.enabled ? "gold" : "red"}`}>{item.enabled ? "Enabled" : "Disabled"}</span>
                        </div>
                        <div className="rw-checks" style={{ marginTop: 10 }}>
                          {["basic", "silver", "gold"].map(tier => (
                            <label key={`${item.id}_${tier}`} className="rw-check">
                              <input type="checkbox" checked={item.tiers.includes(tier)} onChange={() => rewardToggleTier(item.id, tier)} disabled={rewardLocked} />
                              <span>{tier}</span>
                            </label>
                          ))}
                        </div>
                        <div className="rw-row" style={{ marginTop: 12 }}>
                          <button className="rw-btn-ghost" onClick={() => rewardUpdateItem(item.id, "shopEligible", !item.shopEligible)} disabled={rewardLocked}>{item.shopEligible ? "Remove From Shop" : "Add To Shop"}</button>
                          <button className="rw-btn-ghost" onClick={() => rewardUpdateItem(item.id, "wheelEligible", !item.wheelEligible)} disabled={rewardLocked}>{item.wheelEligible ? "Remove From Wheel" : "Add To Wheel"}</button>
                        </div>
                        <div className="rw-row" style={{ marginTop: 10 }}>
                          <button className="rw-btn-ghost" onClick={() => rewardUpdateItem(item.id, "enabled", !item.enabled)} disabled={rewardLocked}>{item.enabled ? "Disable Reward" : "Enable Reward"}</button>
                          <button className="rw-btn-danger" onClick={() => rewardRemoveItem(item.id)} disabled={rewardLocked}>Remove Reward</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rw-panel rw-stack">
                    <div className="rw-topline">Cheat And Debt</div>
                    <div className="rw-sub">If you accessed a reward without a token first, log it and let the balance drop. That is the enforcement layer.</div>
                    <div className="rw-row">
                      <select className="rw-select" value={cheatRewardId} onChange={e => setCheatRewardId(e.target.value)}>
                        {rewardLibrary.filter(item => item.enabled).map(item => <option key={item.id} value={item.id}>{item.name} ({item.cost})</option>)}
                      </select>
                      <button className="rw-btn-danger" onClick={rewardLogCheat}>Log Cheat</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── QUEST BOARD ── */}
        {page === "quests" && (
          <div className="page">
            <div style={{ padding: "40px 20px 16px" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Level 1</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Quest Board</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>
                {totalDone}/{quests.length} complete · {Math.round(totalProgress)}% by XP · {isFinalBossDone ? "Final Boss complete" : "Final Boss pending"}
              </div>
            </div>

            <div className="sh">
              <div className="sh-title">Manage Quests</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="sh-action" onClick={() => addQuickDailyQuest("strength")}>+ Daily Quest</button>
                <button className="sh-action" onClick={() => setShowBoardAdd(v => !v)}>{showBoardAdd ? "Cancel" : "+ Add Quest"}</button>
              </div>
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
                    <select className="ep-select" value={boardQ.type} onChange={e => { const t = e.target.value; const xpMap = { boss: 50, main: 30, side: 15 }; setBoardQ(p => ({ ...p, type: t, xp: xpMap[t] ?? p.xp })); }}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select>
                  </div>
                </div>
                <div className="ep-row" style={{ marginTop: 8 }}>
                  <label className="ep-label">Daily Repeat</label>
                  <input type="checkbox" checked={!!boardQ.isDaily} onChange={e => setBoardQ(p => ({ ...p, isDaily: e.target.checked }))} />
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
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="sh-action" onClick={() => addQuickDailyQuest(activeStat)}>+ Daily Quest</button>
                  <button className="sh-action" onClick={() => setShowAdd(f => !f)}>{showAdd ? "Cancel" : "+ Add"}</button>
                </div>
              </div>

              {showAdd && (
                <div className="add-form">
                  <div className="add-form-title">New Quest</div>
                  <div className="ep-row"><label className="ep-label">Title</label><input className="ep-input" value={newQ.title} onChange={e => setNewQ(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" /></div>
                  <div className="ep-row"><label className="ep-label">Description</label><textarea className="ep-textarea" value={newQ.desc} onChange={e => setNewQ(p => ({ ...p, desc: e.target.value }))} placeholder="Details..." /></div>
                  <div className="ep-2">
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Type</label><select className="ep-select" value={newQ.type} onChange={e => { const t = e.target.value; const xpMap = { boss: 50, main: 30, side: 15 }; setNewQ(p => ({ ...p, type: t, xp: xpMap[t] ?? p.xp })); }}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select></div>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Priority</label><select className="ep-select" value={newQ.priority} onChange={e => setNewQ(p => ({ ...p, priority: e.target.value }))}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
                  </div>
                  <div className="ep-2" style={{ marginTop: 8 }}>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">XP</label><input className="ep-input" type="number" value={newQ.xp} onChange={e => setNewQ(p => ({ ...p, xp: e.target.value }))} /></div>
                    <div className="ep-row" style={{ marginBottom: 0 }}><label className="ep-label">Deadline</label><input className="ep-input" type="date" value={newQ.deadline} onChange={e => setNewQ(p => ({ ...p, deadline: e.target.value }))} /></div>
                  </div>
                  <div className="ep-row" style={{ marginTop: 8 }}>
                    <label className="ep-label">Daily Repeat</label>
                    <input type="checkbox" checked={!!newQ.isDaily} onChange={e => setNewQ(p => ({ ...p, isDaily: e.target.checked }))} />
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
    <div className={`qcard ${q.type} ${q.done ? "done" : ""}`}>
      <div className="qcard-top">
        <div className={`qcheck ${q.done ? "checked" : ""}`} onClick={() => !q.done && onComplete(q)}>{q.done ? "✓" : ""}</div>
        <div className="qbody">
          <div className="qtags">
            <span className={`qtag ${q.type === "boss" ? "qtag-boss" : q.type === "main" ? "qtag-main" : "qtag-side"}`} style={typeColor[q.type] || {}}>
              {q.isFinalBoss ? "👑 Final Boss" : q.type === "boss" ? "⚡ Boss" : q.type === "main" ? "Main" : "Side"}
            </span>
            {q.isDaily && <span className="qstat-tag" style={{ background: "#43c27a20", color: "#43c27a", borderColor: "#43c27a35" }}>🔁 Daily</span>}
            <span className={`qprio-tag prio-${q.priority}`}>{q.priority}</span>
            <span className="qstat-tag" style={{ background: `${cfg?.color}15`, color: cfg?.color, borderColor: `${cfg?.color}25` }}>{cfg?.icon} {cfg?.label}</span>
          </div>
          <div className="qtitle">{q.title}</div>
          {q.desc && <div className="qdesc">{q.desc}</div>}
        </div>
        <div className="qaction-col">
          <div className="qxp">+{q.xp}</div>
          {!q.done && onComplete && <button className="qmini-btn complete" onClick={() => onComplete(q)}>Complete</button>}
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
            <div><label className="ep-label">Type</label><select className="ep-select" value={editForm.type || "main"} onChange={e => { const t = e.target.value; const xpMap = { boss: 50, main: 30, side: 15 }; setEditForm(f => ({ ...f, type: t, xp: xpMap[t] ?? f.xp })); }}><option value="side">Side</option><option value="main">Main</option><option value="boss">Boss</option></select></div>
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
