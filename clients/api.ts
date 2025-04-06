import { GraphQLClient } from "graphql-request";

const isClient=typeof window !== "undefined"

export const graphqlClient=new GraphQLClient(process.env.NEXT_PUBLIC_API_URL as string,{
    headers:()=>({
        Authorization: isClient? `Bearer ${window.localStorage.getItem('__twitter_token')}`:""
    })
})

// export default graphqlClient

//http://localhost:8000/graphql this api for local test
//https://d10hdkbrx0sfml.cloudfront.net/graphql this api cloud front