const assert = require('assert');
// Test simple para verificar que el entorno funciona
try {
  assert.strictEqual(1 + 1, 2);
  console.log(" 🧪 ✅ Todos los tests pasaron con éxito.");
  process.exit(0);
} catch (error) {
  console.error(" ❌ Test fallido", error);
  process.exit(1);
}