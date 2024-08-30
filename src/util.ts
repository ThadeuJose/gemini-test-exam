export function extractMimeTypeAndData(image: string): {
  mimeType: string;
  data: string;
  extension: string;
} {
  if (image.startsWith('data:') && image.includes(';base64,')) {
    const [prefix, data] = image.split(';base64,');
    const mimeType = prefix.replace('data:', '');

    if (!data) {
      throw new Error('Base64 data not found in the URL.');
    }

    const mimeTypeToExtension: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
    };
    const extension = mimeTypeToExtension[mimeType];
    if (!extension) {
      throw new Error(`No file extension found for MIME type: ${mimeType}`);
    }

    return { mimeType, data, extension };
  } else {
    throw new Error(
      "Invalid data URL format. Expected format: 'data:[<mediatype>];base64,<base64data>'",
    );
  }
}
