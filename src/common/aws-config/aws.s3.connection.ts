import * as AWS from 'aws-sdk';
import {ConfigService} from "@nestjs/config";

export const createS3Provider = {
    provide: 'S3',
    useFactory: async (configService: ConfigService) => {
        const AWS_ACCESS_KEY_ID = configService.get('AWS_ACCESS_KEY_ID');
        const AWS_SECRET_ACCESS_KEY = configService.get('AWS_SECRET_ACCESS_KEY');
        const AWS_REGION = configService.get('AWS_REGION');
        const AWS_S3_BUCKET_NAME = configService.get('AWS_S3_BUCKET_NAME');

        const AwsConnectionsParams = {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
        }

        const AwsPresignedUrlParams = {
            Bucket: AWS_S3_BUCKET_NAME,
            Expires: 300,
        }

        const s3 = new AWS.S3(AwsConnectionsParams);
        return { s3, AWS_S3_BUCKET_NAME, AwsPresignedUrlParams };
    },
    inject: [ConfigService],
}
