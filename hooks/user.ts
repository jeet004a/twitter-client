"use client";
import { useQuery } from "@tanstack/react-query"
// export default graphqlClient
import { graphqlClient } from "../clients/api"
import  {getCurrentUserQuery }  from "../graphql/query/user"

type GetCurrentUserResponse = {
    getCurrentUser: {
      id: string;
      profileImageURL: string;
      email: string;
      firstName: string;
      lastName: string;
      tweet:{
        id: string;
        content: string;
          author:{
            firstName: String;
            lastName: String;
            profileImageURL: String
        }
      }
    };
  };

export const userCurrentUser=()=>{
    const query=useQuery<GetCurrentUserResponse>({
        queryKey: ['current-user'],
        queryFn: ()=> graphqlClient.request(getCurrentUserQuery)
    })
    return {...query,user:query.data?.getCurrentUser}
}

// const fetchUsers = async () => {
//     return await graphqlClient.request(getCurrentUserQuery);
// };

// export const userCurrentUser=()=>{
//     const query=useQuery({
//         queryKey: ['current-user'],
//         queryFn: ()=> fetchUsers
//     })
//     console.log(query.data)
//     return {...query,user:null}
// }