// "use client";
// import { useRouter } from "next/navigation";
// import { useRouter } from "next/router"
// import { notFound, useParams } from "next/navigation";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import type { GetServerSideProps, NextPage } from "next";
import { FaArrowLeft } from "react-icons/fa6";
import { userCurrentUser } from "@/hooks/user";
import Image from "next/image";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gpl/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCallback, useMemo } from "react";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueries, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";

interface ServerProps{
    userInfo?: User,
    // tweet?: Tweet[]
}



const UserProfilePage: NextPage<ServerProps>=(props)=>{
    const {user: currentUser}=userCurrentUser()
    const queryClient=useQueryClient()

    const amIFollwing=useMemo(() => {
        if(!props.userInfo) return false
        return(
            (currentUser?.following?.findIndex((el: any)=> el?.id ===props.userInfo?.id) ?? -1 )>=0
        );
    }, [currentUser?.following]);

    // console.log(props?.userInfo?.tweet.length)
    // const [totalTweet, settotalTweet] = useState("")
    
    // const router=useRouter()
    // const { id } = useParams();
    // const response =await userDetails()
    // console.log(response)

    // console.log(props)

    // console.log(id)
    const handleFollowUser=useCallback(
      async() => {
        if(!props.userInfo?.id) return

        await graphqlClient.request(followUserMutation,{to:props.userInfo?.id})

        await queryClient.invalidateQueries({ queryKey: ['current-user'] })

      },
      [props.userInfo?.id, queryClient],
    );


    const handleUnFollowUser=useCallback(
        async() => {
          if(!props.userInfo?.id) return
  
          await graphqlClient.request(unfollowUserMutation,{to:props.userInfo?.id})
  
          await queryClient.invalidateQueries({ queryKey: ['current-user'] })
  
        },
        [props.userInfo?.id, queryClient],
      );

    return(
        <div >
            <TwitterLayout>
                <div >
                    <nav className=" flex items-center gap-3 py-3 px-3">
                    <FaArrowLeft className="text-xl"/>
                    <div>
                        <h1 className="text-xl font-bold">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                        <h3 className="text-md font-bold text-slate-500">{props?.userInfo?.tweet.length} Tweet</h3>
                    </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {props.userInfo?.profileImageURL && 
                        <Image src={props.userInfo?.profileImageURL}
                        className="rounded-full" 
                        alt="Profile-Image" height={100} width={100}/>}
                        <h1 className="text-xl font-bold mt-5">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                <span>{props.userInfo?.followers?.length} followers</span>
                                <span>{props.userInfo?.following?.length} following</span>
                            </div>
                            { currentUser?.id !==props.userInfo?.id && 
                                <>
                                    {amIFollwing ? (
                                        <button 
                                        onClick={handleUnFollowUser}
                                         className="bg-white text-black px-3 py-1 rounded-full text-sm">Unfollow</button>
                                    ):(
                                        <button 
                                        onClick={handleFollowUser} 
                                        className="bg-white text-black px-3 py-1 rounded-full text-sm">Follow</button>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                    <div>
                    {Array.isArray(props.userInfo?.tweet) && 
                        props.userInfo.tweet.map((tweet) => (
                        <FeedCard data={tweet as Tweet} key={tweet.id}></FeedCard>
                        ))}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    )
}



type GetUserByIdResponse = {
    getUserById: User;
};


export const getServerSideProps: GetServerSideProps<ServerProps>=async(context)=>{
    const id=context.query.id
    if(!id) return {notFound:true, props:{userInfo: undefined}}

    const userInfo=await graphqlClient.request<GetUserByIdResponse>(getUserByIdQuery, {id})
    if(!userInfo?.getUserById) return {notFound:true}
    return {
        props:{
            userInfo: userInfo.getUserById as User
        }
    }
}






export default UserProfilePage