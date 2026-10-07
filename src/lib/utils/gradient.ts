const GRADIENTS = [
  "linear-gradient(135deg, #5B4BFF 0%, #2E1F8F 100%)",
  "linear-gradient(135deg, #EC4899 0%, #7C1D5B 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #7C4A03 100%)",
  "linear-gradient(135deg, #22C55E 0%, #0F5C31 100%)",
  "linear-gradient(135deg, #0EA5E9 0%, #0B4F73 100%)",
  "linear-gradient(135deg, #8B5CF6 0%, #3B2172 100%)",
  "linear-gradient(135deg, #F43F5E 0%, #7A1128 100%)",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradientForSeed(seed: string): string {
  return GRADIENTS[hashString(seed) % GRADIENTS.length];
}
