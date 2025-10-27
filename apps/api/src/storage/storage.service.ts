import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: AWS.S3;

  constructor(private config: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: `http://${config.get('STORAGE_ENDPOINT')}:${config.get('STORAGE_PORT')}`,
      accessKeyId: config.get('STORAGE_ACCESS_KEY'),
      secretAccessKey: config.get('STORAGE_SECRET_KEY'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async uploadFile(file: Buffer, key: string, contentType: string) {
    const params = {
      Bucket: this.config.get('STORAGE_BUCKET'),
      Key: key,
      Body: file,
      ContentType: contentType,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: this.config.get('STORAGE_BUCKET'),
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  getSignedUrl(key: string, expiresIn = 3600) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.config.get('STORAGE_BUCKET'),
      Key: key,
      Expires: expiresIn,
    });
  }
}
