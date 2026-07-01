function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createImageSeed({ date, frameNumber = 0, style = 0, salt = '', randomize = false }) {
  const datePart = date.replace(/-/g, '');
  const framePart = String(frameNumber).padStart(3, '0');
  const stylePart = String(style).padStart(2, '0');
  const saltPart = String(salt || '');

  const combined = `${datePart}-${framePart}-${stylePart}-${saltPart}`;
  const hash = hashString(combined);

  if (randomize) {
    const randomComponent = Math.floor(Math.random() * 1000000);
    return (hash + randomComponent) % 90000 + 10000;
  }

  return hash % 90000 + 10000;
}

module.exports = {
  createImageSeed,
};
