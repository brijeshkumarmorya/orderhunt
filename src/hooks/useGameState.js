import { useState, useCallback, useRef, useEffect } from 'react';

const TOTAL = 10;

/* ── helpers ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck() {
  return shuffle(
    Array.from({ length: TOTAL }, (_, i) => i + 1)
  ).map((value, id) => ({ id, value, flipped: false, owner: null }));
}

/* ── synthesised sfx ── */
function beep(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === 'flip') {
      o.frequency.setValueAtTime(600, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(); o.stop(ctx.currentTime + 0.12);
    } else if (type === 'correct') {
      o.frequency.setValueAtTime(523, ctx.currentTime);
      o.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
      o.frequency.setValueAtTime(784, ctx.currentTime + 0.16);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      o.frequency.setValueAtTime(280, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      o.start(); o.stop(ctx.currentTime + 0.22);
    } else if (type === 'win') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const oo = ctx.createOscillator();
        const gg = ctx.createGain();
        oo.connect(gg); gg.connect(ctx.destination);
        oo.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        gg.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
        gg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        oo.start(ctx.currentTime + i * 0.12);
        oo.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else if (type === 'reset') {
      o.type = 'triangle';
      o.frequency.setValueAtTime(400, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      o.start(); o.stop(ctx.currentTime + 0.35);
    }
  } catch { /* noop */ }
}

/* ── hook ── */
export function useGameState() {
  const [cards, setCards] = useState(makeDeck);
  const [turn, setTurn] = useState('user');
  const [userTarget, setUserTarget] = useState(1);
  const [sysTarget, setSysTarget] = useState(1);
  const [status, setStatus] = useState('playing');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [difficulty, setDifficultyState] = useState('medium');
  const [scores, setScores] = useState({ user: 0, system: 0 });
  const [sound, setSound] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [flashCard, setFlashCard] = useState(null);
  const [resetting, setResetting] = useState(false);

  // Refs for values accessed in timeouts (avoids stale closures)
  const sysTargetRef = useRef(1);
  const userTargetRef = useRef(1);
  const diffRef = useRef('medium');
  const soundRef = useRef(true);
  const cardsRef = useRef(cards);
  const sysMemory = useRef(new Map());
  const timerRefs = useRef([]);

  useEffect(() => { sysTargetRef.current = sysTarget; }, [sysTarget]);
  useEffect(() => { userTargetRef.current = userTarget; }, [userTarget]);
  useEffect(() => { diffRef.current = difficulty; }, [difficulty]);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  useEffect(() => { cardsRef.current = cards; }, [cards]);

  const sfx = useCallback((t) => { if (soundRef.current) beep(t); }, []);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
  }, []);

  const addTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timerRefs.current.push(id);
    return id;
  }, []);

  // Toast helper
  const flash = useCallback((text, type = 'info') => {
    setToast({ text, type, key: Date.now() });
    addTimer(() => setToast(null), 1800);
  }, [addTimer]);

  // Reset game
  const resetGame = useCallback(() => {
    clearTimers();
    const newDeck = makeDeck();
    setCards(newDeck);
    cardsRef.current = newDeck;
    setTurn('user');
    setUserTarget(1);
    setSysTarget(1);
    sysTargetRef.current = 1;
    userTargetRef.current = 1;
    setStatus('playing');
    setToast(null);
    setBusy(false);
    setThinking(false);
    setFlashCard(null);
    setResetting(false);
    sysMemory.current = new Map();
  }, [clearTimers]);

  // Set difficulty and restart
  const setDifficulty = useCallback((d) => {
    setDifficultyState(d);
    diffRef.current = d;
    // We need to reset but can't call resetGame synchronously here due to closure
    clearTimers();
    const newDeck = makeDeck();
    setCards(newDeck);
    cardsRef.current = newDeck;
    setTurn('user');
    setUserTarget(1);
    setSysTarget(1);
    sysTargetRef.current = 1;
    userTargetRef.current = 1;
    setStatus('playing');
    setToast(null);
    setBusy(false);
    setThinking(false);
    setFlashCard(null);
    setResetting(false);
    sysMemory.current = new Map();
  }, [clearTimers]);

  // AI card selection
  const pickForAI = useCallback((currentCards, target, diff) => {
    const pool = currentCards.filter(c => !c.flipped);
    if (!pool.length) return null;

    if (diff === 'hard') {
      const known = pool.find(c => sysMemory.current.get(c.id) === target);
      if (known) return known;
      const unseen = pool.filter(c => !sysMemory.current.has(c.id));
      const candidates = unseen.length > 0 ? unseen : pool;
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    if (diff === 'medium') {
      const recent = new Map([...sysMemory.current.entries()].slice(-4));
      const known = pool.find(c => recent.get(c.id) === target);
      if (known) return known;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  // Execute one system pick (called recursively on correct)
  const doSystemPick = useCallback(() => {
    setThinking(true);

    const thinkDelay = 700 + Math.random() * 900;
    addTimer(() => {
      setThinking(false);

      const currentCards = cardsRef.current;
      const target = sysTargetRef.current;
      const diff = diffRef.current;

      const pick = pickForAI(currentCards, target, diff);
      if (!pick) {
        setTurn('user');
        setBusy(false);
        return;
      }

      // Remember this card
      sysMemory.current.set(pick.id, pick.value);

      // Flip the card
      const flippedCards = currentCards.map(c =>
        c.id === pick.id ? { ...c, flipped: true } : c
      );
      setCards(flippedCards);
      cardsRef.current = flippedCards;
      sfx('flip');

      if (pick.value === target) {
        // === CORRECT ===
        sfx('correct');
        setFlashCard({ id: pick.id, type: 'correct' });
        addTimer(() => setFlashCard(null), 800);

        // Claim card
        const claimedCards = flippedCards.map(c =>
          c.id === pick.id ? { ...c, owner: 'system' } : c
        );
        setCards(claimedCards);
        cardsRef.current = claimedCards;

        const next = target + 1;
        setSysTarget(next);
        sysTargetRef.current = next;

        if (next > TOTAL) {
          // AI wins
          setStatus('lost');
          flash('AI wins! 🤖', 'error');
          sfx('wrong');
          setScores(s => ({ ...s, system: s.system + 1 }));
          setBusy(false);
          return;
        }

        flash(`AI found ${target}!`, 'system');

        // Continue AI turn after delay
        addTimer(() => doSystemPick(), 900);
      } else {
        // === WRONG ===
        sfx('wrong');
        setFlashCard({ id: pick.id, type: 'wrong' });
        flash('AI missed!', 'info');

        // Reset AI target to 1
        setSysTarget(1);
        sysTargetRef.current = 1;

        addTimer(() => {
          setFlashCard(null);
          // Strip AI's claimed cards + flip all non-user cards back
          const resetCards = cardsRef.current.map(card => {
            if (card.owner === 'user') return card; // keep user's cards
            return { ...card, flipped: false, owner: null };
          });
          setCards(resetCards);
          cardsRef.current = resetCards;
          setResetting(true);
          sfx('reset');
          addTimer(() => setResetting(false), 400);

          // Switch to user turn
          setTurn('user');
          setBusy(false);
          flash('Your turn!', 'info');
        }, 1000);
      }
    }, thinkDelay);
  }, [pickForAI, sfx, flash, addTimer]);

  // User clicks a card
  const clickCard = useCallback((cardId) => {
    if (turn !== 'user' || busy || status !== 'playing') return;

    const currentCards = cardsRef.current;
    const card = currentCards.find(c => c.id === cardId);
    if (!card || card.flipped) return;

    setBusy(true);
    sfx('flip');

    // Remember for AI
    sysMemory.current.set(card.id, card.value);

    // Flip the card
    const flippedCards = currentCards.map(c =>
      c.id === cardId ? { ...c, flipped: true } : c
    );
    setCards(flippedCards);
    cardsRef.current = flippedCards;

    const target = userTargetRef.current;

    if (card.value === target) {
      // === CORRECT ===
      sfx('correct');
      setFlashCard({ id: cardId, type: 'correct' });
      addTimer(() => setFlashCard(null), 800);

      // Claim the card
      const claimedCards = flippedCards.map(c =>
        c.id === cardId ? { ...c, owner: 'user' } : c
      );
      setCards(claimedCards);
      cardsRef.current = claimedCards;

      const next = target + 1;
      setUserTarget(next);
      userTargetRef.current = next;

      if (next > TOTAL) {
        // User wins!
        setStatus('won');
        flash('You win! 🎉', 'success');
        sfx('win');
        setScores(s => ({ ...s, user: s.user + 1 }));
        setBusy(false);
        return;
      }

      flash(`Found ${card.value}!`, 'success');
      setBusy(false);
      // User continues their turn
    } else {
      // === WRONG ===
      sfx('wrong');
      setFlashCard({ id: cardId, type: 'wrong' });
      flash(`Wrong! Needed ${target}`, 'error');

      // Reset user target to 1
      setUserTarget(1);
      userTargetRef.current = 1;

      addTimer(() => {
        setFlashCard(null);
        // Strip user's claimed cards + flip all non-AI cards back
        const resetCards = cardsRef.current.map(c => {
          if (c.owner === 'system') return c; // keep AI's cards
          return { ...c, flipped: false, owner: null };
        });
        setCards(resetCards);
        cardsRef.current = resetCards;
        setResetting(true);
        sfx('reset');
        addTimer(() => setResetting(false), 400);

        // Switch to system turn
        setTurn('system');

        // Start AI after small delay
        addTimer(() => doSystemPick(), 500);
      }, 1000);
    }
  }, [turn, busy, status, sfx, flash, addTimer, doSystemPick]);

  // Cleanup on unmount
  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    cards, turn, userTarget, sysTarget, status, toast,
    busy, difficulty, scores, sound, thinking, flashCard, resetting,
    clickCard, resetGame, setDifficulty,
    toggleSound: () => setSound(s => !s),
  };
}
