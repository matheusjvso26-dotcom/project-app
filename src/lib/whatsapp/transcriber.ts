import OpenAI, { toFile } from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function transcribeAudioMessage(dbMessageId: string, mediaId: string) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('[Transcriber] OPENAI_API_KEY não configurada. Pulando transcrição.');
            return;
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const token = process.env.META_ACCESS_TOKEN;

        if (!token) {
            console.warn('[Transcriber] META_ACCESS_TOKEN não configurado.');
            return;
        }

        console.log(`[Transcriber] Baixando aúdiao ${mediaId} da Meta...`);

        // 1. Obter URL do áudio na Meta
        const urlRes = await fetch(`https://graph.facebook.com/v19.0/${mediaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!urlRes.ok) {
            console.error('[Transcriber] Erro ao obter Metadata do Audio na Meta.');
            return;
        }

        const urlData = await urlRes.json();
        const mediaUrl = urlData.url;

        if (!mediaUrl) return;

        // 2. Baixar o binário dócil da Meta
        const mediaRes = await fetch(mediaUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!mediaRes.ok) {
            console.error('[Transcriber] Erro no download do stream do Audio.');
            return;
        }

        const arrayBuffer = await mediaRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Converte o Buffer de rede para um File-like Object suportado pela API v4 da OpenAI
        const file = await toFile(buffer, 'audio.ogg', { type: mediaRes.headers.get('content-type') || 'audio/ogg' });

        console.log(`[Transcriber] Processando IA Whisper para o arquivo (${buffer.length} bytes)...`);

        // 3. Transcrever usando o modelo Whisper-1
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'whisper-1',
            language: 'pt',
        });

        // 4. Salvar resultado no Banco de Dados atrelado à Mensagem
        if (transcription && transcription.text) {
            await prisma.message.update({
                where: { id: dbMessageId },
                data: { transcription: transcription.text }
            });
            console.log(`[Transcriber] Sucesso! Legenda gerada para ${dbMessageId}.`);
        }

    } catch (e: any) {
        console.error('[Transcriber] Falha fatal no fluxo de transcrição:', e.message);
    }
}
