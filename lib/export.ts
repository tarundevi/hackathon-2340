export async function exportCanvasToPNG(filename: string = 'diagram.png') {
  try {
    // Import html2canvas dynamically to avoid bundle bloat
    const html2canvas = (await import('html2canvas')).default;

    // Find the canvas container (ReactFlow wrapper)
    const canvasElement = document.querySelector('.react-flow');

    if (!canvasElement) {
      throw new Error('Canvas not found');
    }

    // Capture canvas as PNG
    const canvas = await html2canvas(canvasElement as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    // Create download link
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
