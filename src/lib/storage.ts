import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

interface ImageSize {
  width: number;
  height: number;
  type: 'original' | 'thumbnail' | 'preview';
}

const IMAGE_SIZES: ImageSize[] = [
  { width: 1920, height: 1080, type: 'original' },
  { width: 400, height: 300, type: 'preview' },
  { width: 150, height: 150, type: 'thumbnail' },
];

export class StorageService {
  static async uploadImage(
    file: Buffer,
    contentType: string,
    pixelId?: string,
    commentId?: string
  ) {
    try {
      const images = await Promise.all(
        IMAGE_SIZES.map(async size => {
          // Processar imagem com sharp
          const processedImage = await sharp(file)
            .resize(size.width, size.height, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .toBuffer();

          // Gerar nome único para o arquivo
          const key = `${size.type}/${uuidv4()}.${contentType.split('/')[1]}`;

          // Upload para S3
          await s3Client.send(
            new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key,
              Body: processedImage,
              ContentType: contentType,
              CacheControl: 'max-age=31536000', // 1 ano
            })
          );

          // Gerar URL assinada de leitura para acesso temporário
          const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key,
            }),
            { expiresIn: 3600 }
          );

          // Salvar no banco de dados
          const image = await prisma.image.create({
            data: {
              url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
              type: size.type,
              ...(pixelId && { pixelId }),
              ...(commentId && { commentId }),
            },
          });

          return {
            id: image.id,
            url,
            type: size.type,
          };
        })
      );

      return images;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  static async deleteImage(imageId: string) {
    try {
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new Error('Imagem não encontrada');
      }

      // Extrair key da URL
      const key = image.url.split('.com/')[1];

      // Deletar do S3
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        })
      );

      // Deletar do banco de dados
      await prisma.image.delete({
        where: { id: imageId },
      });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw new Error('Falha ao deletar imagem');
    }
  }

  static async getSignedUrl(imageId: string) {
    try {
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new Error('Imagem não encontrada');
      }

      const key = image.url.split('.com/')[1];

      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 3600 }
      );

      return url;
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw new Error('Falha ao gerar URL de acesso');
    }
  }
}
