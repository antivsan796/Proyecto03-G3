export async function getOperations() {
  const { default: operations } = await import('../../data/datasetG3.json');
  return operations;
}
