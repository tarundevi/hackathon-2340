export async function exportCanvasToPNG(filename: string = 'diagram.png') {
  try {
    // Import html2canvas dynamically to avoid bundle bloat
    const html2canvas = (await import('html2canvas')).default;

    // Find the canvas container (ReactFlow wrapper)
    const canvasElement = document.querySelector('.react-flow');

    if (!canvasElement) {
      throw new Error('Canvas not found');
    }

    // Clone the element to avoid mutating the original
    const clonedElement = canvasElement.cloneNode(true) as HTMLElement;

    // Create a temporary container to hold the cloned element
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.visibility = 'hidden';
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
      // Capture canvas as PNG with better settings for SVG
      const canvas = await html2canvas(clonedElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: canvasElement.clientWidth,
        height: canvasElement.clientHeight,
      });

      // Create download link
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      // Clean up temporary container
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
