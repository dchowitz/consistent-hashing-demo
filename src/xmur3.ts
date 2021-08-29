// xmur3 hash (32bit), based on https://stackoverflow.com/a/47593316/339272

const MIN_HASH = 0x00;
const MAX_HASH = 0xffffffff;
export { MIN_HASH, MAX_HASH };

export default function xmur3(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);

  return (h ^= h >>> 16) >>> 0;
}
