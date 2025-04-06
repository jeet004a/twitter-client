import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { graphqlClient } from "../clients/api"
import { getAllTweetsQuery } from "../graphql/query/tweet"
import { CreateTweetData, Tweet } from "../gpl/graphql"
import { createTweetMutation } from "../graphql/mutation/tweet"
import toast from "react-hot-toast"

type TweetBody={
    getAllTweets:{
        id: string,
        content: string,
        imageURL?: string
        author: {
        id:string
        firstName:string
        lastName: string
        profileImageURL?:string
        }
    }
}


export const useGetAllTweets=()=>{
    const query=useQuery<TweetBody>({
        queryKey: ['all-tweets'],
        queryFn: ()=> graphqlClient.request(getAllTweetsQuery)

    })

    return {...query,tweets: query.data?.getAllTweets}
}


export const useCreateTweet=()=>{
    const queryClient=useQueryClient()
    const mutation=useMutation({
        mutationFn:(payload: CreateTweetData)=>graphqlClient.request(createTweetMutation,{payload}),
        onMutate:()=>toast.loading('Create Tweet',{id:"1"}),
        onSuccess:async()=> {
            await queryClient.invalidateQueries({queryKey: ['all-tweets']});
            toast.success("Created Success", {id:"1"})
        }
    })

    return mutation
}