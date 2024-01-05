import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {join} from "path";
import {UserModule} from "../user/user.module";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {JwtAuthModule} from "../jwt-auth/jwt-auth.module";
import {AvatarModule} from "../avatar/avatar.module";
import {VoteModule} from "../vote/vote.module";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
            sortSchema: true,
            driver: ApolloDriver,
        }),
        UserModule,
        JwtAuthModule,
        AvatarModule,
        VoteModule,
    ],
})
export class GraphqlModule {}
