import {graphql} from '../../gpl'
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export const verifyUserGoogleTokenQuery=graphql(
   `#graphql
    query VerifyUserGoogleToken($token: String!){
        verifyGoogleToken(token: $token)
    }
` 
);

// recommendedUsers {
//     id
//     firstName
//     lastName
//     profileImageURL
// }
export const getCurrentUserQuery = `
    query GetCurrentUser {
      getCurrentUser {
        id
        profileImageURL
        email
        firstName
        lastName
        
        followers {
            id  
            firstName
            lastName
            profileImageURL
        }
        following {
            id
            firstName
            lastName
            profileImageURL
        }
        tweet{
            id
            content
            author {
                id
                firstName
                lastName
                profileImageURL
            }
        }
    }
}
`;



export const getUserByIdQuery  =`
    query GetUserById($id: ID!) {
    getUserById(id: $id) {
        id
        firstName
        lastName
        profileImageURL
        followers {
            id
            firstName
            lastName
            profileImageURL
        }
        following {
            id
            firstName
            lastName
            profileImageURL
        }
        tweet {
            content
            id
            author {
                id
                firstName
                lastName
                profileImageURL
            }
        }
    }
}
`;