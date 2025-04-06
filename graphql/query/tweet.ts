import { graphql } from "../../gpl";

export const getAllTweetsQuery=`
    query GetAllTweets {
    getAllTweets {
        id
        content
        imageURL
        author {
        id
        firstName
        lastName
        profileImageURL
        }
  }
}
`


export const getSignedURLForTweetQuery=`
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
}
`