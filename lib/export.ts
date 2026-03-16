export async function exportCanvasToPNG(filename: string = 'diagram.png') {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const canvasElement = document.querySelector('.react-flow') as HTMLElement;

    if (!canvasElement) {
      throw new Error('Canvas not found');
    }

    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      allowTaint: true,
      useCORS: true,
      width: canvasElement.clientWidth,
      height: canvasElement.clientHeight,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
