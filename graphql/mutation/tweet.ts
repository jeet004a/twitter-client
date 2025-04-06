export const createTweetMutation=`
mutation CreateTweet($payload: CreateTweetData!) {
        createTweet(payload: $payload) {
            id
        }
    }
`


// content
//             imageURL
//             author {
//             id
//             firstName
//             lastName
//             email
//             }