export function createDmPairKey(firstUserId: number, secondUserId: number) {
  const left = Math.min(firstUserId, secondUserId);
  const right = Math.max(firstUserId, secondUserId);

  return `${left}:${right}`;
}
