// src/data/recommendedSets.ts

/**
 * 캐릭터별 추천 에코 세트 조합
 *
 * 형식: [primary] = 5피스 1세트 / [primary, secondary] = 3피스 + 2피스 하이브리드
 * alternatives는 대안 조합
 */
export interface SetRecommendation {
  primary: string[];
  alternatives?: string[][];
}

export const RECOMMENDED_SETS: Record<string, SetRecommendation> = {
  // ── Fusion ──
  chixia:     { primary: ['molten-rift'] },
  mortefi:    { primary: ['empyrean-anthem'], alternatives: [['molten-rift']] },
  encore:     { primary: ['molten-rift'] },
  changli:    { primary: ['molten-rift'], alternatives: [['tidebreaking-courage']] },
  brant:      { primary: ['tidebreaking-courage'], alternatives: [['molten-rift']] },
  lupa:       { primary: ['flaming-clawprint'] },
  galbrena:   { primary: ['flamewings-shadow', 'flaming-clawprint'] },
  aemeath:    { primary: ['trailblazing-star'] },
  mornye:     { primary: ['halo-of-starry-radiance'] },

  // ── Glacio ──
  baizhi:     { primary: ['rejuvenating-glow'] },
  sanhua:     { primary: ['moonlit-clouds'] },
  lingyang:   { primary: ['frosty-resolve'], alternatives: [['freezing-frost']] },
  zhezhi:     { primary: ['empyrean-anthem'] },
  youhu:      { primary: ['rejuvenating-glow'] },
  carlotta:   { primary: ['frosty-resolve'], alternatives: [['freezing-frost']] },

  // ── Aero ──
  yangyang:   { primary: ['moonlit-clouds'] },
  aalto:      { primary: ['moonlit-clouds'] },
  jiyan:      { primary: ['sierra-gale'] },
  jianxin:    { primary: ['moonlit-clouds'] },
  'rover-aero': { primary: ['windward-pilgrimage'] },
  ciaccona:   { primary: ['gusts-of-welkin'] },
  cartethyia: { primary: ['windward-pilgrimage'] },
  iuno:       { primary: ['crown-of-valor', 'sierra-gale'] },
  qiuyuan:    { primary: ['law-of-harmony', 'sierra-gale'] },
  sigrika:    { primary: ['sound-of-true-name'] },

  // ── Electro ──
  yuanwu:     { primary: ['empyrean-anthem'] },
  lumi:       { primary: ['moonlit-clouds'] },
  buling:     { primary: ['rejuvenating-glow'] },
  calcharo:   { primary: ['void-thunder'] },
  yinlin:     { primary: ['moonlit-clouds'], alternatives: [['void-thunder']] },
  'xiangli-yao': { primary: ['void-thunder'] },
  augusta:    { primary: ['crown-of-valor', 'void-thunder'] },

  // ── Spectro ──
  'rover-spectro': { primary: ['moonlit-clouds'] },
  verina:     { primary: ['rejuvenating-glow'] },
  jinhsi:     { primary: ['celestial-light'] },
  shorekeeper: { primary: ['rejuvenating-glow'] },
  phoebe:     { primary: ['eternal-radiance'] },
  zani:       { primary: ['eternal-radiance'] },
  'luuk-herssen': { primary: ['rite-of-gilded-revelation'] },
  lynae:      { primary: ['pact-of-neonlight-leap'] },

  // ── Havoc ──
  danjin:     { primary: ['havoc-eclipse'] },
  taoqi:      { primary: ['moonlit-clouds'] },
  'rover-havoc': { primary: ['havoc-eclipse'] },
  camellya:   { primary: ['havoc-eclipse'] },
  roccia:     { primary: ['midnight-veil'] },
  cantarella: { primary: ['midnight-veil'] },
  phrolova:   { primary: ['dream-of-the-lost', 'havoc-eclipse'] },
  chisa:      { primary: ['thread-of-severed-fate', 'havoc-eclipse'] },
};
