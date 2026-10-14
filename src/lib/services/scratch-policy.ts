export function chooseWeightedPrize(prizes: Array<{ label: string; weight: number }>, randomValue: number) {
  if (!prizes.length) return null;
  let cursor = randomValue;
  for (const prize of prizes) { cursor -= prize.weight; if (cursor < 0) return prize.label; }
  return prizes.at(-1)?.label ?? null;
}
