import {Injectable} from "@nestjs/common";
import {AWS_S3_BUCKET_NAME, s3} from "../common/aws-config/aws.s3.connection";
import AWS from "aws-sdk";

@Injectable()
export class AwsAvatarService {
    private s3: AWS.S3;
    constructor() {
        this.s3 = s3;
    }

    async generatePresignedUrl(key: string, params: Record<string, any>): Promise<string> {
        const urlParams = { ...params, Key: key };
        return this.s3.getSignedUrlPromise('putObject', urlParams);
    }

    async getAvatar(key: string) {
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        }
        const data = await this.s3.getObject(params).promise();
        return data.Body;
    }
}