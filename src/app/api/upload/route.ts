import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';
import { withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const pixelId = formData.get('pixelId') as string;
    const commentId = formData.get('commentId') as string;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo do arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
    }

    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande' }, { status: 400 });
    }

    // Converter File para Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload da imagem
    const images = await StorageService.uploadImage(buffer, file.type, pixelId, commentId);

    // Se for uma imagem de pixel, atualizar o pixel
    if (pixelId) {
      await prisma.pixel.update({
        where: { id: pixelId },
        data: {
          images: {
            connect: images.map(img => ({ id: img.id })),
          },
        },
      });
    }

    // Se for uma imagem de comentário, atualizar o comentário
    if (commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          images: {
            connect: images.map(img => ({ id: img.id })),
          },
        },
      });
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro ao processar upload' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
