import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const audioFile = files.audio[0];
    const audioBuffer = fs.readFileSync(audioFile.filepath);

    // Create FormData for the API request
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { 
      type: audioFile.mimetype 
    }), audioFile.originalFilename || 'audio.wav');
    formData.append('model', process.env.AZURE_AI_FOUNDRY_MODEL_NAME || 'whisper-1');
    
    // Optional parameters
    formData.append('language', 'en');
    formData.append('response_format', 'json');

    const response = await fetch(`${process.env.AZURE_AI_FOUNDRY_ENDPOINT}/v1/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AZURE_AI_FOUNDRY_API_KEY}`,
        // Don't set Content-Type header - let fetch set it automatically for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Clean up temp file
    fs.unlinkSync(audioFile.filepath);

    res.status(200).json({ transcription: result.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
}