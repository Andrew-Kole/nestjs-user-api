import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export class AwsAvatarService {
    constructor(@Inject('S3') private readonly s3Provider: any) {}
    async generatePresignedUrl(key: string): Promise<string> {
        const { s3, AwsPresignedUrlParams } = this.s3Provider;
        const urlParams = { ...AwsPresignedUrlParams, Key: key };
        return s3.getSignedUrlPromise('putObject', urlParams);
    }

    async getAvatar(key: string) {
        const { s3, AWS_S3_BUCKET_NAME } = this.s3Provider;
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        }
        const data = await s3.getObject(params).promise();
        return data.Body;
    }

    async uploadFileToS3(params) {
        params = {...params, Bucket: this.s3Provider.AWS_S3_BUCKET_NAME};
        return this.s3Provider.s3.upload(params).promise();
    }
}